
describe('UploadPicker valid uploads', () => {
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

		// Mount picker
		cy.mount(UploadPicker, { propsData }).as('uploadPicker')

		// Label is displayed before upload
		cy.get('[data-cy-upload-picker]')
			.contains('button', 'New')
			.should('be.visible')

		// Check and init aliases
		cy.get('[data-cy-upload-picker] [data-cy-upload-picker-input]').as('input').should('exist')
		cy.get('[data-cy-upload-picker] [data-cy-upload-picker-progress]').as('progress').should('exist')
	})

	afterEach(() => resetDocument())

	it('Uploads a file', () => {
		const { promise, resolve } = Promise.withResolvers<void>()
		cy.intercept('PUT', '/remote.php/dav/files/*/*', (req) => {
			req.reply({ statusCode: 201 })
			req.on('response', async () => await promise)
		}).as('upload')

		cy.get('@input').attachFile({
			// Fake file of 5 MB
			fileContent: new Blob([new ArrayBuffer(2 * 1024 * 1024)]),
			fileName: 'image.jpg',
			mimeType: 'image/jpeg',
			encoding: 'utf8',
			lastModified: new Date().getTime(),
		})

		cy.get('@progress').should('be.visible')
		cy.get('[data-cy-upload-picker]')
			.within(() => {
				// Label gets hidden during upload
				cy.contains('button', 'New').should('not.exist')
				// but the button exists
				cy.get('button[data-cy-upload-picker-add]')
					.should('be.visible')
					.and('have.attr', 'aria-label', 'New')
			})
			.then(() => resolve())

		cy.wait('@upload').then(() => {
			cy.get('@progress')
				.should('not.be.visible')

			// Label is displayed again after upload
			cy.get('[data-cy-upload-picker] button').should('contain.text', 'New')
		})
	})
})

describe('UploadPicker valid uploads', () => {
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

		// Mount picker
		cy.mount(UploadPicker, { propsData }).as('uploadPicker')

		// Check and init aliases
		cy.get('[data-cy-upload-picker] [data-cy-upload-picker-input]').as('input').should('exist')
		cy.get('[data-cy-upload-picker] .upload-picker__progress').as('progress').should('exist')
	})

	afterEach(() => resetDocument())

	it('Uploads a file with chunking', () => {
		// Intercept tmp upload chunks folder creation
		cy.intercept('MKCOL', '/remote.php/dav/uploads/*/web-file-upload*', {
			statusCode: 201,
		}).as('init')

		// Intercept chunks upload
		cy.intercept({
			method: 'PUT',
			url: '/remote.php/dav/uploads/*/web-file-upload*/*',
		}, (req) => {
			req.reply({
				statusCode: 201,
			})
		}).as('chunks')

		// Intercept final assembly request
		cy.intercept('MOVE', '/remote.php/dav/uploads/*/web-file-upload*/.file', (req) => {
			req.reply({
				statusCode: 204,
				// Fake assembling chunks
				delay: 2000,
			})
		}).as('assembly')

		// Start upload
		cy.get('@input').attachFile({
			// Fake file of 256 MB
			fileContent: new Blob([new ArrayBuffer(256 * 1024 * 1024)]),
			fileName: 'photos.zip',
			mimeType: 'application/zip',
			encoding: 'utf8',
			lastModified: new Date().getTime(),
		})

		cy.wait('@init').then(() => {
			cy.get('[data-cy-upload-picker] .upload-picker__progress')
				.as('progress')
				.should('be.visible')
		})
		cy.wait('@chunks').then(() => {
			cy.get('[data-cy-upload-picker] .upload-picker__progress')
				.as('progress')
				.should('be.visible')
			cy.get('@progress')
				.children('progress')
				.should('not.have.value', '0')
		})
		cy.wait('@assembly', { timeout: 60000 }).then(() => {
			cy.get('[data-cy-upload-picker] .upload-picker__progress')
				.as('progress')
				.should('not.be.visible')
			cy.get('@chunks.all').should('have.lengthOf', 26)
		})
	})

	it('Uploads a file without chunking', () => {
		// Intercept single upload
		cy.intercept('PUT', '/remote.php/dav/files/*/*', {
			statusCode: 201,
		}).as('upload')

		cy.get('@input').attachFile({
			// Fake file of 5 MB
			fileContent: new Blob([new ArrayBuffer(5 * 1024 * 1024)]),
			fileName: 'image.jpg',
			mimeType: 'image/jpeg',
			encoding: 'utf8',
			lastModified: new Date().getTime(),
		})

		cy.get('[data-cy-upload-picker] .upload-picker__progress')
			.as('progress')
			.should('not.be.visible')
		cy.wait('@upload').then(() => {
			cy.get('@progress')
				.children('progress')
				.should('not.have.value', '0')
		})
	})
})

describe('Destination management', () => {
	const propsData = {
		destination: new Folder({
			id: 56,
			owner: 'user',
			source: generateRemoteUrl('dav/files/user'),
			permissions: Permission.ALL,
			root: '/files/user',
		}),
	}

	afterEach(() => resetDocument())

	it('Upload then changes the destination', () => {
		// Mount picker
		cy.mount(UploadPicker, { propsData })

		// Check and init aliases
		cy.get('[data-cy-upload-picker] [data-cy-upload-picker-input]').as('input').should('exist')
		cy.get('[data-cy-upload-picker] .upload-picker__progress').as('progress').should('exist')

		// Intercept single upload
		cy.intercept('PUT', '/remote.php/dav/files/*/**', {
			statusCode: 201,
		}).as('upload')

		cy.get('@input').attachFile({
			// Fake file of 5 MB
			fileContent: new Blob([new ArrayBuffer(5 * 1024 * 1024)]),
			fileName: 'image.jpg',
			mimeType: 'image/jpeg',
			encoding: 'utf8',
			lastModified: new Date().getTime(),
		})

		cy.wait('@upload').then((upload) => {
			expect(upload.request.url).to.have.string(
				'/remote.php/dav/files/user/image.jpg',
			)
		})

		cy.mount(UploadPicker, { propsData }).then(({ component }) => {
			const instance = component as InstanceType<typeof UploadPicker>
			instance.setDestination(new Folder({
				id: 56,
				owner: 'user',
				source: generateRemoteUrl('dav/files/user/Photos'),
				permissions: Permission.ALL,
				root: '/files/user',
			}))
			// Wait for prop propagation
			expect(instance.uploadManager.root).to.have.string('/remote.php/dav/files/user/Photos')
		})

		cy.get('@input').attachFile({
			// Fake file of 5 MB
			fileContent: new Blob([new ArrayBuffer(5 * 1024 * 1024)]),
			fileName: 'image.jpg',
			mimeType: 'image/jpeg',
			encoding: 'utf8',
			lastModified: new Date().getTime(),
		})

		cy.wait('@upload').then((upload) => {
			expect(upload.request.url).to.have.string(
				'/remote.php/dav/files/user/Photos/image.jpg',
			)
		})
	})
})

describe('Root management', () => {
	const propsData = {
		root: null,
		destination: new Folder({
			id: 56,
			owner: 'user',
			source: generateRemoteUrl('dav/files/user'),
			permissions: Permission.ALL,
			root: '/files/user',
		}),
	}

	afterEach(() => resetDocument())

	it('Upload then changes the root', () => {
		// Mount picker
		cy.mount(UploadPicker, { propsData })

		// Check and init aliases
		cy.get('[data-cy-upload-picker] [data-cy-upload-picker-input]').as('input').should('exist')
		cy.get('[data-cy-upload-picker] .upload-picker__progress').as('progress').should('exist')

		// Intercept single upload
		cy.intercept('PUT', '/remote.php/dav/files/*/**', {
			statusCode: 201,
		}).as('upload')

		cy.get('@input').attachFile({
			// Fake file of 5 MB
			fileContent: new Blob([new ArrayBuffer(5 * 1024 * 1024)]),
			fileName: 'image.jpg',
			mimeType: 'image/jpeg',
			encoding: 'utf8',
			lastModified: new Date().getTime(),
		})

		cy.wait('@upload').then((upload) => {
			expect(upload.request.url).to.have.string(
				'/remote.php/dav/files/user/image.jpg',
			)
		})

		cy.mount(UploadPicker, { propsData }).then(({ component }) => {
			const instance = component as InstanceType<typeof UploadPicker>
			instance.setDestination(new Folder({
				id: 56,
				owner: 'user',
				source: generateRemoteUrl('dav/photos/user/albums/2022 Summer Vacations'),
				permissions: Permission.ALL,
				root: '/photos/user',
			}))
			// Wait for prop propagation
			expect(instance.uploadManager.root).to.have.string('/remote.php/dav/photos/user/albums/2022 Summer Vacations')
		})

		// Intercept single upload
		cy.intercept('PUT', '/remote.php/dav/photos/user/albums/*/*', {
			statusCode: 201,
		}).as('upload')

		cy.get('@input').attachFile({
			// Fake file of 5 MB
			fileContent: new Blob([new ArrayBuffer(5 * 1024 * 1024)]),
			fileName: 'image.jpg',
			mimeType: 'image/jpeg',
			encoding: 'utf8',
			lastModified: new Date().getTime(),
		})

		cy.wait('@upload').then((upload) => {
			expect(upload.request.url).to.have.string(
				'/remote.php/dav/photos/user/albums/2022%20Summer%20Vacations/image.jpg',
			)
		})
	})
})

describe('UploadPicker notify testing', () => {
	const listeners = {
		uploaded: () => {},
		failed: () => {},
	}

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

		cy.spy(listeners, 'uploaded')
		cy.spy(listeners, 'failed')

		// Mount picker
		cy.mount(UploadPicker, {
			propsData,
			listeners,
		}).as('uploadPicker')

		// Check and init aliases
		cy.get('[data-cy-upload-picker] [data-cy-upload-picker-input]').as('input').should('exist')
		cy.get('[data-cy-upload-picker] .upload-picker__progress').as('progress').should('exist')
	})

	afterEach(() => resetDocument())

	it('Uploads a file without chunking', () => {
		const notify = cy.spy()
		const uploader = getUploader()
		uploader.addNotifier(notify)

		// Intercept single upload
		cy.intercept('PUT', '/remote.php/dav/files/*/*', {
			statusCode: 201,
		}).as('upload')

		cy.get('@input').attachFile({
			// Fake file of 5 MB
			fileContent: new Blob([new ArrayBuffer(5 * 1024 * 1024)]),
			fileName: 'image.jpg',
			mimeType: 'image/jpeg',
			encoding: 'utf8',
			lastModified: new Date().getTime(),
		})

		cy.get('[data-cy-upload-picker] .upload-picker__progress')
			.as('progress')
			.should('not.be.visible')
		cy.wait('@upload').then(() => {
			cy.get('@progress')
				.children('progress')
				.should('not.have.value', '0')
			expect(notify).to.be.calledTwice
			// The image upload
			expect(notify.getCall(0).args[0].file.name).to.eq('image.jpg')
			expect(notify.getCall(0).args[0].status).to.eq(UploadStatus.FINISHED)
			// The meta upload
			expect(notify.getCall(1).args[0].status).to.eq(UploadStatus.FINISHED)
			expect(notify.getCall(1).args[0].file.name).to.eq('')
			expect(notify.getCall(1).args[0].file.type).to.eq('httpd/unix-directory')
			// the listeners
			expect(listeners.failed).to.not.be.called
			expect(listeners.uploaded).to.be.calledTwice
		})
	})

	it('Fails a file without chunking', () => {
		const notify = cy.spy()
		const uploader = getUploader()
		uploader.addNotifier(notify)

		// Intercept single upload
		cy.intercept('PUT', '/remote.php/dav/files/*/*', {
			statusCode: 403,
		}).as('upload')

		cy.get('@input').attachFile({
			// Fake file of 5 MB
			fileContent: new Blob([new ArrayBuffer(5 * 1024 * 1024)]),
			fileName: 'image.jpg',
			mimeType: 'image/jpeg',
			encoding: 'utf8',
			lastModified: new Date().getTime(),
		})

		cy.get('[data-cy-upload-picker] .upload-picker__progress')
			.as('progress')
			.should('not.be.visible')
		cy.wait('@upload').then(() => {
			cy.get('@progress')
				.children('progress')
				.should('not.have.value', '0')
			expect(notify).to.be.calledTwice
			// The image upload
			expect(notify.getCall(0).args[0].file.name).to.eq('image.jpg')
			expect(notify.getCall(0).args[0].status).to.eq(UploadStatus.FAILED)
			// The meta upload
			expect(notify.getCall(1).args[0].status).to.eq(UploadStatus.FAILED)
			expect(notify.getCall(1).args[0].file.name).to.eq('')
			expect(notify.getCall(1).args[0].file.type).to.eq('httpd/unix-directory')
			// the listeners
			expect(listeners.uploaded).to.not.be.called
			expect(listeners.failed).to.be.calledTwice
		})
	})
})
