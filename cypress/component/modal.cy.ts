/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from 'cypress/vue'
import NcModal from '../../src/components/NcModal/NcModal.vue'
import type { Component } from 'vue'
import { h } from 'vue'

describe('NcModal', () => {
	it('close button is visible when content is scrolled', () => {
		mount(NcModal, {
			props: {
				show: true,
				size: 'small',
				name: 'Name',
			},
			slots: {
				// Create two div as children, first is 100vh = overflows the content, second just gets some data attribute so we can scroll into view
				default: {
					render: () =>
						h('div', [
							h('div', { style: { height: '100vh' } }),
							h('div', { 'data-cy': 'bottom' }),
						]),
				} as Component,
			},
		})

		cy.get('[data-cy="bottom"]').scrollIntoView()
		cy.get('button.modal-container__close').should('be.visible')
	})
})
