/**
 * SPDX-FileCopyrightText: Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import NcAppNavigation from '../../src/components/NcAppNavigation/NcAppNavigation.vue'
import NcAppNavigationItem from '../../src/components/NcAppNavigationItem/NcAppNavigationItem.vue'

describe('NcAppNavigation hotkeys', () => {
	it('opens on n keyboard press', () => {
		cy.mount({
			render: (h) => h(NcAppNavigation, {
				scopedSlots: {
					list: () => [
						h(NcAppNavigationItem, { props: { name: 'First' } }),
					],
				},
			}),
		})

		cy.contains('li', 'First').should('exist')

		cy.get('nav').then(($nav) => {
			const id = $nav.attr('id')
			cy.get(`[aria-controls="${id}"`).as('appNavigationToggle')
			cy.get('@appNavigationToggle').should('have.attr', 'aria-expanded', 'true')
			cy.get('nav').should('have.attr', 'aria-hidden', 'false')
			cy.get('nav').should('not.have.attr', 'inert')

			// close the sidebar
			cy.get('@appNavigationToggle').click()

			cy.get('@appNavigationToggle').should('have.attr', 'aria-expanded', 'false')
			cy.get('nav').should('have.attr', 'aria-hidden', 'true')
			cy.get('nav').should('have.attr', 'inert')

			// open the sidebar with the keyboard
			cy.get('body').type('n')

			cy.get('@appNavigationToggle').should('have.attr', 'aria-expanded', 'true')
			cy.get('nav').should('have.attr', 'aria-hidden', 'false')
			cy.get('nav').should('not.have.attr', 'inert')

			// make sure we auto-focus the first item
			cy.document().then((doc) => {
				const activeElement = doc.activeElement
				const navigation = doc.querySelector('nav')
				// eslint-disable-next-line no-unused-expressions
				expect(navigation?.contains(activeElement)).to.be.true
			})
		})
	})

	it('closes on n keyboard press', () => {
		cy.mount({
			render: (h) => h(NcAppNavigation, {
				scopedSlots: {
					list: () => [
						h(NcAppNavigationItem, { props: { name: 'First' } }),
					],
				},
			}),
		})

		cy.contains('li', 'First').should('exist')
		cy.get('nav').should('have.attr', 'aria-hidden', 'false')
		cy.get('nav').should('not.have.attr', 'inert')

		// pressing n does nothing until we focus something within
		cy.get('body').type('n')
		cy.get('nav').should('have.attr', 'aria-hidden', 'false')
		cy.get('nav').should('not.have.attr', 'inert')

		// focus something within
		cy.get('nav').find('a').first().focus()

		// pressing n closes the sidebar
		cy.get('body').type('n')
		cy.get('nav').should('have.attr', 'aria-hidden', 'true')
		cy.get('nav').should('have.attr', 'inert')
	})
})
