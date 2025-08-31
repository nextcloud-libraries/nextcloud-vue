/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import NcRichContenteditable from '../../src/components/NcRichContenteditable/NcRichContenteditable.vue'

it('Placeholder is set', () => {
	cy.mount(NcRichContenteditable, {
		propsData: {
			modelValue: '',
		},
	})

	cy.get('[role="textbox"]')
		.should('be.visible')
		.and('have.attr', 'aria-placeholder', 'Write a message …')
})

// does not work as Cypress is using webpack which does not have the l10n plugin
it.skip('Placeholder is correctly translated', () => {
	cy.window()
		.then(($window) => {
			$window.document.documentElement.lang = 'de'
		})

	cy.mount(NcRichContenteditable, {
		propsData: {
			modelValue: '',
		},
	})

	cy.get('[role="textbox"]')
		.should('be.visible')
		.and('have.attr', 'aria-placeholder', 'Nachricht schreiben …')
})
