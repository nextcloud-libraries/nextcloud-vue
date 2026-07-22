/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { File, Folder, Permission } from '@nextcloud/files'
import { generateRemoteUrl } from '@nextcloud/router'
import { UploadPicker, UploadStatus, getUploader } from '../../../lib/index.ts'

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

describe('UploadPicker: progress handling', () => {
	let dirContent: File[] = []

	afterEach(() => {
		resetDocument()
	})

	beforeEach(() => {
		dirContent = []

		// Make sure we reset the destination
		// so other tests do not interfere
		const propsData = {
			content: () => dirContent,
			destination: new Folder({
				id: 56,
				owner: 'user',
				source: generateRemoteUrl('dav/files/user'),
				permissions: Permission.ALL,
				root: '/files/user',
			}),
		}

		// Start paused
		getUploader(false, true)
			.pause()

		// Mount picker
		cy.mount(UploadPicker, {
			propsData,
		}).as('uploadPicker')

		// Check and init aliases
		cy.get('[data-cy-upload-picker] [data-cy-upload-picker-input]').as('input').should('exist')
		cy.get('[data-cy-upload-picker] [data-cy-upload-picker-progress]').as('progress').should('exist')
		cy.get('[data-cy-upload-picker] [data-cy-upload-picker-progress-label]').as('progressLabel').should('exist')
	})

	it('cancels single file upload', () => {
		const notify = cy.spy()
		getUploader()
			.addNotifier(notify)

		cy.get('@input').attachFile({
			// file of 5 MiB
			fileContent: new Blob([new ArrayBuffer(5 * 1024 * 1024)]),
			fileName: 'file.txt',
			mimeType: 'text/plain',
			encoding: 'utf8',
			lastModified: new Date().getTime(),
		})

		cy.intercept('PUT', '/remote.php/dav/files/user/file.txt', { statusCode: 201, delay: 2000 })

		// See there is no progress yet
		cy.get('@progress')
			.should('be.visible')
			.should('have.value', 0)
		cy.get('@progressLabel')
			.should('contain.text', 'paused')
			// start the uploader
			.then(() => getUploader().start())

		cy.get('@progress', { timeout: 2000 })
			.should((el) => expect(el.val()).to.be.greaterThan(10))
			.and((el) => expect(el.val()).to.be.lessThan(95))

		// Now cancel the upload
		cy.get('[data-cy-upload-picker-cancel]')
			.should('be.visible')
			.click()
		cy.get('@progress')
			.should('not.be.visible')
			.then(() => {
				// eslint-disable-next-line no-unused-expressions
				expect(notify).to.be.calledOnce
				expect(notify.getCall(0).args[0].status).to.eq(UploadStatus.CANCELLED)
			})
	})

	it('cancels single chunked file upload', () => {
		const notify = cy.spy()
		getUploader()
			.addNotifier(notify)

		cy.get('@input').attachFile({
			fileContent: new Blob([new ArrayBuffer(15 * 1024 * 1024)]),
			fileName: 'file.txt',
			mimeType: 'text/plain',
			encoding: 'utf8',
			lastModified: new Date().getTime(),
		})

		cy.intercept('MKCOL', '/remote.php/dav/uploads/user/*', { statusCode: 201 })
		cy.intercept('DELETE', '/remote.php/dav/uploads/user/*', { statusCode: 201 })
		cy.intercept('PUT', '/remote.php/dav/uploads/user/web-file-upload-*/*', { statusCode: 201, delay: 2000 })

		// See there is no progress yet
		cy.get('@progress')
			.should('be.visible')
			.should('have.value', 0)
		cy.get('@progressLabel')
			.should('contain.text', 'paused')
			// start the uploader
			.then(() => getUploader().start())

		cy.get('@progress', { timeout: 2000 })
			.should((el) => expect(el.val()).to.be.greaterThan(10))
			.and((el) => expect(el.val()).to.be.lessThan(95))

		// Now cancel the upload
		cy.get('[data-cy-upload-picker-cancel]')
			.should('be.visible')
			.click()
		cy.get('@progress')
			.should('not.be.visible')
			.then(() => {
				// eslint-disable-next-line no-unused-expressions
				expect(notify).to.be.calledTwice
				expect(notify.getCall(0).args[0].status).to.eq(UploadStatus.CANCELLED)
				expect(notify.getCall(1).args[0].status).to.eq(UploadStatus.CANCELLED)
			})
	})

	it('cancels single file conflict', () => {
		dirContent.push(new File({ owner: 'test', source: 'http://example.com/remote.php/dav/files/test/file.txt', mime: 'text/plain' }))
		const notify = cy.spy()
		getUploader()
			.addNotifier(notify)

		cy.get('@input').attachFile({
			// file of 5 MiB
			fileContent: new Blob([new ArrayBuffer(5 * 1024 * 1024)]),
			fileName: 'file.txt',
			mimeType: 'text/plain',
			encoding: 'utf8',
			lastModified: new Date().getTime(),
		})

		cy.intercept('PUT', '/remote.php/dav/files/user/file.txt', { statusCode: 409, delay: 2000 })

		// See there is no progress yet
		cy.get('@progress')
			.should('be.visible')
			.should('have.value', 0)
			// start the uploader
			.then(() => getUploader().start())

		cy.get('[role="dialog"]')
			.should('be.visible')
			.find('[data-cy-conflict-picker-cancel]')
			.click()

		cy.contains('.toast-warning', 'Upload has been cancelled').should('be.visible')

		cy.get('@progress')
			.should('not.be.visible')
			.then(() => {
				// eslint-disable-next-line no-unused-expressions
				expect(notify).to.be.calledOnce
				expect(notify.getCall(0).args[0].status).to.eq(UploadStatus.CANCELLED)
			})
	})
})
