/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Component } from 'vue'

import { mount } from 'cypress/vue2'
import NcModal from '../../src/components/NcModal/NcModal.vue'

describe('NcModal', () => {
	it('Modal is labelled correctly if name is set', () => {
		mount(NcModal, {
			propsData: {
				show: true,
				name: 'My modal',
				size: 'small',
			},
			slots: {
				default: 'Text',
			},
		})

		cy.findByRole('dialog', { name: 'My modal' }).should('exist')
	})

	it('Modal is labelled correctly if `labelId` is set', () => {
		mount(NcModal, {
			propsData: {
				show: true,
				size: 'small',
				labelId: 'my-id',
			},
			slots: {
				default: '<h2 id="my-id">Labelled dialog</h2>',
			},
		})

		cy.findByRole('dialog', { name: 'Labelled dialog' }).should('exist')
	})

	it('Modal is labelled correctly if `labelId` and `name` are set', () => {
		mount(NcModal, {
			propsData: {
				show: true,
				size: 'small',
				name: 'My modal',
				labelId: 'my-id',
			},
			slots: {
				default: '<h2 id="my-id">Real name</h2>',
			},
		})

		cy.findByRole('dialog', { name: 'Real name' }).should('exist')
	})

	it('close button is visible when content is scrolled', () => {
		mount(NcModal, {
			propsData: {
				show: true,
				size: 'small',
				name: 'Name',
			},
			slots: {
				// Create two div as children, first is 100vh = overflows the content, second just gets some data attribute so we can scroll into view
				default: {
					render: (h) => h('div', [
						h('div', { style: 'height: 100vh;' }),
						h('div', { attrs: { 'data-cy': 'bottom' } }),
					]),
				} as Component,
			},
		})

		cy.get('[data-cy="bottom"]').scrollIntoView()
		cy.get('button.modal-container__close').should('be.visible')
	})
})
