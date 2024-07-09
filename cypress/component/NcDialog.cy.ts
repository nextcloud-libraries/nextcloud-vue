/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import NcDialog from '../../src/components/NcDialog/NcDialog.vue'

describe('NcDialog', () => {
	it('Dialog is correctly labelled', () => {
		cy.mount(NcDialog, {
			props: {
				show: true,
				name: 'My dialog',
			},
			slots: {
				default: 'Text',
			},
		})

		cy.findByRole('dialog', { name: 'My dialog' }).should('exist')
	})
})
