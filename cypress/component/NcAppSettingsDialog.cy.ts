/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { defineComponent, h } from 'vue'

import NcAppSettingsDialog from '../../src/components/NcAppSettingsDialog/NcAppSettingsDialog.vue'
import NcAppSettingsSection from '../../src/components/NcAppSettingsSection/NcAppSettingsSection.vue'

describe('NcAppSettingsDialog', () => {
	it('Dialog is correctly labelled', () => {
		cy.mount(NcAppSettingsDialog, {
			propsData: {
				open: true,
				name: 'My settings dialog',
			},
			slots: {
				default: defineComponent({
					render: () => h(NcAppSettingsSection, { props: { name: 'First section', id: 'first' } }),
				}),
			},
		})

		cy.findByRole('dialog', { name: 'My settings dialog' }).should('exist')
	})

	it('Dialog sections are correctly labelled', () => {
		cy.mount(NcAppSettingsDialog, {
			propsData: {
				open: true,
				name: 'My settings dialog',
				showNavigation: true,
			},
			slots: {
				default: defineComponent({
					render: () => h(NcAppSettingsSection, { props: { name: 'First section', id: 'first' } }, ['The section content']),
				}),
			},
		})

		cy.findByRole('dialog', { name: 'My settings dialog' }).should('exist')
		cy.findByRole('dialog', { name: 'My settings dialog' })
			.findByRole('region', { name: 'First section' })
			.should('exist')
			.and('contain.text', 'The section content')
	})
})
