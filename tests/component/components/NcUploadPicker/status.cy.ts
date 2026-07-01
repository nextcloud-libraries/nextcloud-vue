/* eslint-disable no-unused-expressions */
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
// dist file might not be built when running eslint only
// eslint-disable-next-line import/no-unresolved,n/no-missing-import
import { Folder, Permission } from '@nextcloud/files'
import { generateRemoteUrl } from '@nextcloud/router'
import { getUploader, UploadPicker } from '../../../lib/index.ts'

let state: string | undefined
before(() => {
	cy.window().then((win) => {
		state = win.document.body.innerHTML
	})
})

const resetDocument = () => {
	if (state) {
		cy.window().then((win) => {
			win.document.body.innerHTML = state!
		})
	}
}

describe('UploadPicker: status testing', () => {
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
		const onPause = cy.spy().as('pausedListener')
		const onResume = cy.spy().as('resumedListener')
		cy.mount(UploadPicker, {
			propsData,
			listeners: {
				paused: onPause,
				resumed: onResume,
			},
		}).as('uploadPicker')

		// Check and init aliases
		cy.get('[data-cy-upload-picker] [data-cy-upload-picker-input]').as('input').should('exist')
		cy.get('[data-cy-upload-picker] .upload-picker__progress').as('progress').should('exist')
	})

	afterEach(() => resetDocument())

	it('shows paused status on pause', () => {
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
		const assemblyStartStub = cy.stub().as('assemblyStart')
		cy.intercept('MOVE', '/remote.php/dav/uploads/*/web-file-upload*/.file', (req) => {
			assemblyStartStub()
			req.reply({
				statusCode: 204,
				// Fake assembling chunks
				delay: 5000,
			})
		}).as('assemblyEnd')

		// Start upload
		cy.get('@input').attachFile({
			// Fake file of 256MB
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
			cy.get('[data-cy-upload-picker-progress-label]').should('not.contain', 'estimating time left')
			cy.get('[data-cy-upload-picker-progress-label]').should('not.contain', 'paused')

			cy.wait(1000).then(() => {
				getUploader().pause()
			})

			cy.get('[data-cy-upload-picker-progress-label]').should('contain', 'paused')
			cy.get('@pausedListener').should('have.been.calledOnce')

			cy.wait(1000).then(() => {
				getUploader().start()
			})

			cy.get('[data-cy-upload-picker-progress-label]').should('not.contain', 'paused')
			cy.get('@resumedListener').should('have.been.calledOnce')
		})

		// Should will retry until success or timeout
		cy.get('@assemblyStart', { timeout: 30000 }).should('have.been.calledOnce').then(() => {
			cy.get('[data-cy-upload-picker] .upload-picker__progress')
				.as('progress')
				.should('be.visible')

			cy.get('[data-cy-upload-picker-progress-label]').should('not.contain', 'paused')
			cy.get('[data-cy-upload-picker-progress-label]').should('contain', 'assembling')
		})

		cy.wait('@assemblyEnd', { timeout: 60000 }).then(() => {
			cy.get('[data-cy-upload-picker] .upload-picker__progress')
				.as('progress')
				.should('not.be.visible')
		})
	})
})
