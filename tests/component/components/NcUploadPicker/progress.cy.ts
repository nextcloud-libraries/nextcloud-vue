/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { Folder, Permission } from '@nextcloud/files'
import { generateRemoteUrl } from '@nextcloud/router'
import { UploadPicker, getUploader } from '../../../lib/index.ts'

let state: string | undefined

before(() => {
	cy.window().then((win) => {
		state = win.document.body.innerHTML
	})
})

/**
 * Reset the inner body of the document to remove any previous state of the uploader.
 */
function resetDocument(): void {
	if (state) {
		cy.window().then((win) => {
			win.document.body.innerHTML = state!
		})
	}
}

/**
 * Throttle the upload speed using browser API.
 * @param speed upload speed in bytes per second. -1 for unlimited.
 */
function throttleUpload(speed: number) {
	Cypress.automation('remote:debugger:protocol', {
		command: 'Network.emulateNetworkConditions',
		params: {
			offline: speed === 0,
			latency: 0,
			downloadThroughput: -1,
			uploadThroughput: Math.max(speed, -1),
		},
	})
}

describe('UploadPicker: progress handling', () => {
	afterEach(() => {
		resetDocument()
		throttleUpload(-1)
	})

	beforeEach(() => {
		// Make sure we reset the destination
		// so other tests do not interfere
		const propsData = {
			destination: new Folder({
				id: 56,
				owner: 'user',
				source: generateRemoteUrl('dav/files/user'),
				permissions: Permission.ALL,
				root: '/files/user',
			}),
		}

		// Start paused
		getUploader(false, true).pause()

		// Mount picker
		cy.mount(UploadPicker, {
			propsData,
		}).as('uploadPicker')

		// Check and init aliases
		cy.get('[data-cy-upload-picker] [data-cy-upload-picker-input]').as('input').should('exist')
		cy.get('[data-cy-upload-picker] [data-cy-upload-picker-progress]').as('progress').should('exist')
		cy.get('[data-cy-upload-picker] [data-cy-upload-picker-progress-label]').as('progressLabel').should('exist')
	})

	it('has upload speed information', () => {
		cy.get('@input').attachFile({
			// file of 9 MiB
			fileContent: new Blob([new ArrayBuffer(9 * 1024 * 1024)]),
			fileName: 'file.txt',
			mimeType: 'text/plain',
			encoding: 'utf8',
			lastModified: new Date().getTime(),
		})

		cy.intercept('PUT', '/remote.php/dav/files/user/file.txt', { statusCode: 201 })

		// 128 KB/s
		throttleUpload(128 * 1024)

		// See there is no progress yet
		cy.get('@progress')
			.should('be.visible')
			.should('have.value', 0)
		cy.get('@progressLabel')
			.should('contain.text', 'paused')
			// start the uploader
			.then(() => getUploader().start())

		// See the upload has started
		cy.get('@progressLabel', { timeout: 10000 })
			.should((el) => expect(el.text()).to.match(/\d+(\.\d+)?\s?KB∕s/))
			// increase speed to 1MiB/s
			.then(() => throttleUpload(1024 * 1024))
		cy.get('@progressLabel')
			.children('span')
			.first({ timeout: 9000 })
			.should((el) => {
				expect(el.text().trim()).to.equal('a few seconds left')
				expect(el.attr('title')).to.match(/\d+(\.\d+)?\s?KB∕s/)
			})
	})

	it('has increasing progress bar during non-chunked upload', () => {
		cy.get('@input').attachFile({
			// file of 5 MiB
			fileContent: new Blob([new ArrayBuffer(5 * 1024 * 1024)]),
			fileName: 'file.txt',
			mimeType: 'text/plain',
			encoding: 'utf8',
			lastModified: new Date().getTime(),
		})

		// promise used to time request response
		const { promise, resolve } = Promise.withResolvers<void>()
		cy.intercept('PUT', '/remote.php/dav/files/user/file.txt', (rq) => {
			rq.reply({ statusCode: 201 })
			rq.on('response', async () => {
				await promise
			})
		}).as('upload')

		// 1 MiB/s meaning upload will take 5 seconds
		throttleUpload(1024 * 1024)

		// See there is no progress yet
		cy.get('@progress')
			.should('be.visible')
			.should('have.value', 0)
		cy.get('@progressLabel')
			.should('contain.text', 'paused')
			// start the uploader
			.then(() => getUploader().start())

		// See the upload has started
		cy.get('@progressLabel')
			.should('contain.text', 'estimating time')

		cy.get('@progress', { timeout: 2000 })
			.should((el) => expect(el.val()).to.be.greaterThan(10))
			.and((el) => expect(el.val()).to.be.lessThan(30))
		cy.get('@progress', { timeout: 1500 })
			.should((el) => expect(el.val()).to.be.greaterThan(30))
			.and((el) => expect(el.val()).to.be.lessThan(50))
		cy.get('@progress', { timeout: 1500 })
			.should((el) => expect(el.val()).to.be.greaterThan(50))
			.and((el) => expect(el.val()).to.be.lessThan(70))
		cy.get('@progress', { timeout: 1500 })
			.should((el) => expect(el.val()).to.be.greaterThan(70))
			.and((el) => expect(el.val()).to.be.lessThan(90))

		cy.get('@progress')
			.should('have.value', 90)
			.then(() => resolve()) // resolve the promise
		// now the progress should be 100 meaning the progress bar is hidden
		cy.get('@progress')
			.should('not.be.visible')
	})

	it('has increasing progress bar for chunked upload', () => {
		// Maximum the responses can take
		Cypress.config({ defaultCommandTimeout: 7000 })

		const { promise: promiseChunk1, resolve: resolveChunk1 } = Promise.withResolvers<void>()
		const { promise: promiseChunk2, resolve: resolveChunk2 } = Promise.withResolvers<void>()
		cy.intercept('MKCOL', '/remote.php/dav/uploads/user/*', (rq) => {
			rq.reply({ statusCode: 201 })
		}).as('mkdir')
		cy.intercept('PUT', '/remote.php/dav/uploads/user/*/*', (rq) => {
			rq.reply({ statusCode: 201 })
			rq.on('response', async () => await (rq.url.endsWith('/1') ? promiseChunk1 : promiseChunk2))
		}).as('uploadBig')
		cy.intercept('MOVE', '/remote.php/dav/uploads/user/*/.file', (rq) => {
			rq.reply({ statusCode: 201 })
		}).as('move')

		// 3 MiB/s meaning upload will take 5 seconds
		throttleUpload(3 * 1024 * 1024)

		cy.get('@input').attachFile({
			// file of 15 MiB so it is chunked in 10MiB and 5 MiB
			fileContent: new Blob([new ArrayBuffer(15 * 1024 * 1024)]),
			fileName: 'file.txt',
			mimeType: 'text/plain',
			encoding: 'utf8',
			lastModified: new Date().getTime(),
		})

		// See there is no progress yet
		cy.get('@progress')
			.should('be.visible')
			.should('have.value', 0)
		cy.get('@progressLabel')
			.should('contain.text', 'paused')
			// start the uploader
			.then(() => getUploader().start())

		// See the upload has started
		cy.get('@progressLabel')
			.should((el) => expect(el.text()).to.match(/(estimating time|few seconds left)/))

		// MKCOL was successfully so the upload can begin
		cy.wait('@mkdir')

		// ~20% per second
		cy.get('@progress', { timeout: 2000 })
			.should((el) => expect(el.val()).to.be.greaterThan(10))
			.and((el) => expect(el.val()).to.be.lessThan(30))
		cy.get('@progress', { timeout: 1500 })
			.should((el) => expect(el.val()).to.be.greaterThan(30))
			.and((el) => expect(el.val()).to.be.lessThan(50))
		cy.get('@progress', { timeout: 1500 })
			.should((el) => expect(el.val()).to.be.greaterThan(50))
			.and((el) => expect(el.val()).to.be.lessThan(70))
		cy.get('@progress', { timeout: 1500 })
			.should((el) => expect(el.val()).to.be.greaterThan(70))
			.and((el) => expect(el.val()).to.be.lessThan(90))

		cy.get('@progress')
			.should('have.value', 90)
			// Now the upload (sending) is done - if we trigger the resolve the value will increase to 96% (or 95 if we resolve only chunk2)
			.then(() => resolveChunk1())
		cy.get('@progress')
			.should((e) => expect(Math.round(e.val() as number)).to.be.eq(97))
			.then(() => resolveChunk2())
		// now the progress should be 100 meaning the progress bar is hidden
		cy.get('@progress')
			.should('not.be.visible')
	})

	it('shows the progress bar while assembling', () => {
		// Maximum the responses can take
		Cypress.config({ defaultCommandTimeout: 7000 })

		const { promise, resolve } = Promise.withResolvers<void>()

		cy.intercept('PUT', '/remote.php/dav/files/user/file.txt', { statusCode: 201 }).as('upload')
		cy.intercept('MKCOL', '/remote.php/dav/uploads/user/*', { statusCode: 201 }).as('mkdir')
		cy.intercept('PUT', '/remote.php/dav/uploads/user/*/*', (rq) => {
			rq.reply({ statusCode: 201 })
			if (rq.url.endsWith('/2')) {
				rq.on('response', async () => await promise)
			}
		}).as('uploadBig')
		cy.intercept('MOVE', '/remote.php/dav/uploads/user/*/.file', { statusCode: 201, delay: 1000 }).as('move')

		// Start in paused mode
		const uploader = getUploader()

		cy.get('@input').attachFile([
			{
				// file of 5 MiB so it is not chunked
				fileContent: new Blob([new ArrayBuffer(5 * 1024 * 1024)]),
				fileName: 'file.txt',
				mimeType: 'text/plain',
				encoding: 'utf8',
				lastModified: new Date().getTime(),
			},
			{
				// file of 15 MiB so it is chunked in 10MiB and 5 MiB
				fileContent: new Blob([new ArrayBuffer(15 * 1024 * 1024)]),
				fileName: 'big-file.txt',
				mimeType: 'text/plain',
				encoding: 'utf8',
				lastModified: new Date().getTime(),
			},
		])

		// See there is no progress yet
		cy.get('@progress')
			.should('be.visible')
			.should('have.value', 0)
		cy.get('@progressLabel')
			.should('contain.text', 'paused')
			// start the uploader
			.then(() => uploader.start())

		// MKCOL was successfully so the upload can begin
		cy.wait('@mkdir')

		cy.get('@progress', { timeout: 2000 })
			.should((el) => expect(el.val()).to.be.greaterThan(10))
			.and((el) => expect(el.val()).to.be.lessThan(95))

		cy.wait('@upload')
		cy.wait('@uploadBig')
			.then(() => resolve())

		cy.get('@progressLabel')
			.should('be.visible')
			.and('contain.text', 'assembling')

		cy.wait('@move')

		cy.get('@progress')
			.should('not.be.visible')
	})
})

describe('UploadPicker: reset progress on retry', () => {
	afterEach(() => {
		resetDocument()
		throttleUpload(-1)
	})

	beforeEach(() => {
		cy.window()
			.then((win) => {
				// Internal global variable
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(win as any)._oc_capabilities = { files: { chunked_upload: { max_parallel_count: 1 } } }
			})

		// Make sure we reset the destination
		// so other tests do not interfere
		const propsData = {
			destination: new Folder({
				id: 56,
				owner: 'user',
				source: generateRemoteUrl('dav/files/user'),
				permissions: Permission.ALL,
				root: '/files/user',
			}),
		}

		// Start the uploader paused
		getUploader(false, true).pause()

		// Mount picker
		cy.mount(UploadPicker, {
			propsData,
		}).as('uploadPicker')

		// Check and init aliases
		cy.get('[data-cy-upload-picker] [data-cy-upload-picker-input]').as('input').should('exist')
		cy.get('[data-cy-upload-picker] [data-cy-upload-picker-progress]').as('progress').should('exist')
		cy.get('[data-cy-upload-picker] [data-cy-upload-picker-progress-label]').as('progressLabel').should('exist')
	})

	it('non chunked request', () => {
		let destroyRequest = true
		cy.intercept('PUT', '/remote.php/dav/files/user/file.txt', (rq) => {
			if (destroyRequest) {
				rq.reply({ statusCode: 504 })
				destroyRequest = false
			} else {
				rq.reply({ statusCode: 201 })
			}
		}).as('upload')

		throttleUpload(2 * 1024 * 1024)

		cy.get('@input').attachFile({
			// file of 5 MiB
			fileContent: new Blob([new ArrayBuffer(5 * 1024 * 1024)]),
			fileName: 'file.txt',
			mimeType: 'text/plain',
			encoding: 'utf8',
			lastModified: new Date().getTime(),
		})

		// See there is no progress yet
		cy.get('@progress')
			.should('be.visible')
			.should('have.value', 0)
		cy.get('@progressLabel')
			.should('contain.text', 'paused')
			// start the uploader
			.then(() => getUploader().start())

		// See the upload has started
		cy.get('@progressLabel')
			.should('contain.text', 'estimating time')

		cy.get('@progress', { timeout: 2000 })
			.should((el) => expect(el.val()).to.be.greaterThan(10))
			.and((el) => expect(el.val()).to.be.lessThan(40))
		cy.get('@progress', { timeout: 1500 })
			.should((el) => expect(el.val()).to.be.greaterThan(50))

		cy.wait('@upload')

		// see progress is reset
		cy.get('@progress', { timeout: 1000 })
			.should((el) => expect(el.val()).to.be.lessThan(25))

		cy.get('@progress', { timeout: 4000 })
			// see second request / retry is increasing the progress again
			.should((el) => expect(el.val()).to.be.greaterThan(26))
	})

	it('only failed chunk is reset on retry', () => {
		let retryChunk = true
		cy.intercept('MKCOL', '/remote.php/dav/uploads/user/*', (rq) => {
			rq.reply({ statusCode: 201 })
		}).as('mkdir')
		cy.intercept('MOVE', '/remote.php/dav/uploads/user/*/.file', (rq) => {
			rq.reply({ statusCode: 201 })
		}).as('move')
		cy.intercept('PUT', '/remote.php/dav/uploads/user/*/*', (rq) => {
			if (rq.url.endsWith('/2')) {
				if (retryChunk) {
					rq.reply({ statusCode: 504, delay: 1000 })
					retryChunk = false
					return
				}
			}
			rq.reply({ statusCode: 201, delay: 500 })
		}).as('upload')

		cy.get('@input').attachFile({
			// file of 25 MiB so that we get 3 chunks
			fileContent: new Blob([new ArrayBuffer(25 * 1024 * 1024)]),
			fileName: 'file.txt',
			mimeType: 'text/plain',
			encoding: 'utf8',
			lastModified: new Date().getTime(),
		})

		throttleUpload(6 * 1024 * 1024)

		// See there is no progress yet
		cy.get('@progress')
			.should('be.visible')
			.should('have.value', 0)
		cy.get('@progressLabel')
			.should('contain.text', 'paused')
			// start the uploader
			.then(() => getUploader().start())

		// chunks: 40% 40% 20%
		// See we get progress of chunk 1
		cy.get('@progress')
			.should('have.value', 40)
		// See we get some progress on chunk 2
		cy.get('@progress')
			.should((el) => expect(el.val()).to.be.greaterThan(75))
		// See the progress is reset to 40% (first chunk)
		cy.get('@progress')
			.should('have.value', 40)
		// See we succeed with uploading
		cy.get('@progress', { timeout: 5000 })
			.should((el) => expect(el.val()).to.be.greaterThan(75))
		// And suceed
		cy.get('@progress')
			.should('not.be.visible')
		cy.get('@upload.all')
			.should('have.length', 4) // 3 chunks + 1 retry
	})
})
