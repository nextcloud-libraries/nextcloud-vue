/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import NcPasswordField from './NcPasswordField.story.vue'

describe('NcPasswordField', () => {
	it('password is hidden', () => {
		cy.mount(NcPasswordField)

		cy.get('input[type="password"]').should('be.visible')
		cy.get('.story-wrapper').compareSnapshot('NcPasswordField-password-hidden')
	})

	it('password can be shown', () => {
		cy.mount(NcPasswordField, {
			propsData: {
				visible: true,
			},
		})

		cy.get('input[type="text"]').should('be.visible')
		cy.get('.story-wrapper').compareSnapshot('NcPasswordField-password-visible')
	})

	it('password can be shown by trailing button click', () => {
		cy.mount(NcPasswordField)

		cy.get('input[type="password"]')
			.should('be.visible')

		cy.get('[aria-label="Show password"]')
			.should('be.visible')
			.click()

		cy.get('input[type="password"]')
			.should('not.exist')
		cy.get('input[type="text"]')
			.should('be.visible')
		cy.get('.story-wrapper').compareSnapshot('NcPasswordField-password-toggled-by-button-visible')
	})

	it('password as-text is hidden', () => {
		cy.mount(NcPasswordField, {
			propsData: {
				asText: true,
			},
		})

		cy.get('input[type="text"]').should('be.visible')
		cy.get('.story-wrapper').compareSnapshot('NcPasswordField-password-as-text-hidden')
	})

	it('password as-text can be shown', () => {
		cy.mount(NcPasswordField, {
			propsData: {
				asText: true,
				visible: true,
			},
		})

		cy.get('input[type="text"]').should('be.visible')
		cy.get('.story-wrapper').compareSnapshot('NcPasswordField-password-as-text-visible')
	})

	it('password as-text can be shown by trailing button click', () => {
		cy.mount(NcPasswordField, {
			propsData: {
				asText: true,
			},
		})

		cy.get('input[type="text"]')
			.should('be.visible')

		cy.get('[aria-label="Show password"]')
			.should('be.visible')
			.click()

		cy.get('input[type="text"]')
			.should('be.visible')
		cy.get('[aria-label="Hide password"]')
			.should('be.visible')
		cy.get('.story-wrapper').compareSnapshot('NcPasswordField-password-as-text-toggled-by-button-visible')
	})
})
