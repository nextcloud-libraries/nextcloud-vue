/* eslint-disable no-unused-expressions */
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
// dist file might not be built when running eslint only
// eslint-disable-next-line import/no-unresolved,n/no-missing-import
import { Folder, Permission, addNewFileMenuEntry, type Entry } from '@nextcloud/files'
import { generateRemoteUrl } from '@nextcloud/router'
import { UploadPicker } from '../../../lib/index.ts'

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

describe('UploadPicker: "new"-menu', () => {
	const propsData = {
		content: () => [],
		destination: new Folder({
			id: 56,
			owner: 'user',
			source: generateRemoteUrl('dav/files/user/Folder'),
			permissions: Permission.ALL,
			root: '/files/user',
		}),
	}

	afterEach(() => resetDocument())

	it('without folder-upload enabled no menu is shown', () => {
		cy.mount(UploadPicker, { propsData })

		// Check and init aliases
		cy.get('[data-cy-upload-picker] [data-cy-upload-picker-input]').as('input').should('exist')
		cy.get('[data-cy-upload-picker] .upload-picker__progress').as('progress').should('exist')
		cy.get('[data-cy-upload-picker]')
			.contains('button', 'New')
			.should('be.visible')
			// Directly trigger upload
			.and('have.attr', 'data-cy-upload-picker-menu-entry', 'upload-file')
			.click()

		cy.get('[role="menu"]').should('not.exist')
	})

	it('with folder-upload enabled a menu is shown', () => {
		cy.mount(UploadPicker, { propsData: { ...propsData, allowFolders: true } })

		// Check and init aliases
		cy.get('[data-cy-upload-picker] [data-cy-upload-picker-input]').as('input').should('exist')
		cy.get('[data-cy-upload-picker] .upload-picker__progress').as('progress').should('exist')
		cy.get('[data-cy-upload-picker]')
			.contains('button', 'New')
			.should('be.visible')
			// Directly no trigger
			.and('not.have.attr', 'data-cy-upload-picker-menu-entry', 'upload-file')
			// click should open the menu
			.click()

		cy.get('[role="menu"]')
			.should('be.visible')
			.get('[role="menuitem"]')
			// two entries: uploader folder + upload files
			.should('have.length', 2)
	})

	describe('With new-menu entries', () => {
		const entry = {
			id: 'empty-file',
			displayName: 'Create empty file',
			templateName: 'New file',
			iconClass: 'icon-file',
			enabled: (folder: Folder) => (folder.permissions & Permission.CREATE) !== 0,
			handler() {},
		} as Entry

		before(() => addNewFileMenuEntry(entry))
		beforeEach(() => cy.spy(entry, 'handler'))
		afterEach(() => resetDocument())

		it('With "noMenu" prop no menu is shown', () => {
			// Mount picker
			cy.mount(UploadPicker, { propsData: { ...propsData, noMenu: true } })

			// Check and init aliases
			cy.get('[data-cy-upload-picker] [data-cy-upload-picker-input]').as('input').should('exist')
			cy.get('[data-cy-upload-picker] .upload-picker__progress').as('progress').should('exist')
			cy.get('[data-cy-upload-picker]')
				.contains('button', 'Upload')
				.should('be.visible')
				// Directly trigger upload
				.and('have.attr', 'data-cy-upload-picker-menu-entry', 'upload-file')
				.click()

			cy.get('[role="menu"]').should('not.exist')
		})

		it('With "noMenu" prop and allowed folder-upload only the upload menu is shown', () => {
			// Mount picker
			cy.mount(UploadPicker, { propsData: { ...propsData, noMenu: true, allowFolders: true } })

			// Check and init aliases
			cy.get('[data-cy-upload-picker] [data-cy-upload-picker-input]').as('input').should('exist')
			cy.get('[data-cy-upload-picker] .upload-picker__progress').as('progress').should('exist')
			cy.get('[data-cy-upload-picker]')
				.contains('button', 'Upload')
				.should('be.visible')
				// Directly no trigger
				.and('not.have.attr', 'data-cy-upload-picker-menu-entry', 'upload-file')
				// click should open the menu
				.click()

			cy.get('[role="menu"]')
				.should('be.visible')
				.get('[role="menuitem"]')
				// only two (!) entries: uploader folder + upload files
				.should('have.length', 2)
			// Not the custom entry
			cy.get('[data-cy-upload-picker-menu-entry="empty-file"]').should('not.exist')
		})

		it('Open the New File Menu', () => {
			// Mount picker
			cy.mount(UploadPicker, { propsData })

			// Check and init aliases
			cy.get('[data-cy-upload-picker] [data-cy-upload-picker-input]').as('input').should('exist')
			cy.get('[data-cy-upload-picker] .upload-picker__progress').as('progress').should('exist')
			cy.get('[data-cy-upload-picker] .action-item__menutoggle').should('exist')

			cy.get('[data-cy-upload-picker] .action-item__menutoggle').click()
			cy.get('[data-cy-upload-picker-menu-entry="upload-file"]').should('have.length', 1)
			cy.get('[data-cy-upload-picker-menu-entry="empty-file"]').should('have.length', 1)

			cy.get('[data-cy-upload-picker-menu-entry="empty-file"]')
				.click()
				.then(() => {
					expect(entry.handler).to.be.called
				})
		})

		it.only('Changes the context', () => {
			// Mount picker
			cy.mount(UploadPicker, { propsData }).then(({ component }) => {
				const instance = component as InstanceType<typeof UploadPicker>

				// Check and init aliases
				cy.get('[data-cy-upload-picker] [data-cy-upload-picker-input]').as('input').should('exist')
				cy.get('[data-cy-upload-picker] .upload-picker__progress').as('progress').should('exist')
				cy.get('[data-cy-upload-picker] .action-item__menutoggle').should('exist')

				cy.get('[data-cy-upload-picker] .action-item__menutoggle').click()
				cy.get('[data-cy-upload-picker-menu-entry="upload-file"]').should('have.length', 1)
				cy.get('[data-cy-upload-picker-menu-entry="empty-file"]').should('have.length', 1)

				// Close menu
				cy.get('body').click()
				cy.get('[data-cy-upload-picker-menu-entry="upload-file"]').should('not.be.visible')
				cy.get('[data-cy-upload-picker-menu-entry="empty-file"]').should('not.be.visible')

				// Change context when we're sure the menu is closed
				cy.get('[role="menu"]').should('not.be.visible')
					.then(() => {
						instance.setDestination(new Folder({
							id: 56,
							owner: 'user',
							source: generateRemoteUrl('dav/files/user/Folder'),
							permissions: Permission.NONE,
							root: '/files/user',
						}))
					})

				// Menu should not be visible anymore
				cy.get('[data-cy-upload-picker] .action-item__menutoggle').should('not.exist')
				cy.get('[data-cy-upload-picker-menu-entry="upload-file"]').should('have.length', 1)
				cy.get('[data-cy-upload-picker-menu-entry="empty-file"]').should('not.exist')
			})
		})
	})
})
