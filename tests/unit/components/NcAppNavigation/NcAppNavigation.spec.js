/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, it, expect } from '@jest/globals'
import { mount } from '@vue/test-utils'
import { emit } from '@nextcloud/event-bus'
import { nextTick } from 'vue'
import NcAppNavigation from '../../../../src/components/NcAppNavigation/NcAppNavigation.vue'
import { resizeWindowWidth } from '../../testing-utils.ts'

const NAVIGATION__SELECTOR = 'nav'
const TOGGLE_BUTTON__SELECTOR = 'button[aria-controls="app-navigation-vue"]'
const NAVIGATION_CLOSE__CLASS = 'app-navigation--close'

const findNavigation = (wrapper) => wrapper.get(NAVIGATION__SELECTOR)
const findToggleButton = (wrapper) => wrapper.get(TOGGLE_BUTTON__SELECTOR)

describe('NcAppNavigation.vue', () => {
	beforeEach(async () => {
		// Emulate desktop size
		await resizeWindowWidth(1024)
	})

	describe('by default', () => {
		it('is open', () => {
			const wrapper = mount(NcAppNavigation)
			const navigation = findNavigation(wrapper)

			expect(navigation.classes(NAVIGATION_CLOSE__CLASS)).toBeFalsy()
		})
	})

	describe('toggle via event bus', () => {
		it('toggles to turn it off', async () => {
			const wrapper = mount(NcAppNavigation)

			emit('toggle-navigation', { open: undefined })
			await nextTick()

			expect(wrapper.classes(NAVIGATION_CLOSE__CLASS)).toBeTruthy()
		})

		it('toggles with open: false keeps it closed', async () => {
			const wrapper = mount(NcAppNavigation)

			emit('toggle-navigation', { open: false })
			emit('toggle-navigation', { open: false })
			await nextTick()

			expect(wrapper.classes(NAVIGATION_CLOSE__CLASS)).toBeTruthy()
		})
	})

	describe('toggle via toggle button', () => {
		it('opens on toggle button click in closed navigation', async () => {
			const wrapper = mount(NcAppNavigation)
			const togglebutton = findToggleButton(wrapper)

			await togglebutton.trigger('click')

			expect(wrapper.classes(NAVIGATION_CLOSE__CLASS)).toBeTruthy()
		})
	})

	describe('toggle via mobile state', () => {
		it('closes on switch to mobile', async () => {
			const wrapper = mount(NcAppNavigation)

			expect(wrapper.classes(NAVIGATION_CLOSE__CLASS)).toBeFalsy()

			await resizeWindowWidth(1023)
			await nextTick()

			expect(wrapper.classes(NAVIGATION_CLOSE__CLASS)).toBeTruthy()
		})

		it('opens on switch to desktop', async () => {
			const wrapper = mount(NcAppNavigation)
			const togglebutton = findToggleButton(wrapper)
			await resizeWindowWidth(1023)

			expect(wrapper.classes(NAVIGATION_CLOSE__CLASS)).toBeTruthy()

			// Close
			await togglebutton.trigger('click')
			// Switch to desktop
			await resizeWindowWidth(1024)
			await nextTick()

			expect(wrapper.classes(NAVIGATION_CLOSE__CLASS)).toBeFalsy()
		})

		it('closes by ESC key on mobile', async () => {
			await resizeWindowWidth(1023)
			const wrapper = mount(NcAppNavigation)
			const navigation = findNavigation(wrapper)

			await navigation.trigger('keydown', { key: 'Escape' })

			expect(wrapper.classes(NAVIGATION_CLOSE__CLASS)).toBeTruthy()
		})

		it("doesn't close by ESC key on desktop", async () => {
			const wrapper = mount(NcAppNavigation)
			const navigation = findNavigation(wrapper)

			await navigation.trigger('keydown', { key: 'Escape' })

			expect(wrapper.classes(NAVIGATION_CLOSE__CLASS)).toBeFalsy()
		})
	})

	describe('focus trap', () => {
		// TODO
	})

	describe('accessibility', () => {
		it('has navigation role', () => {
			const wrapper = mount(NcAppNavigation)
			const navigation = findNavigation(wrapper)

			expect(
				navigation.attributes('role') === 'navigation'
				|| navigation.element.tagName === 'NAV',
			).toBeTruthy()
		})

		it('has toggle button, connected by aria-controls', () => {
			const wrapper = mount(NcAppNavigation)
			const navigation = findNavigation(wrapper)
			const togglebutton = findToggleButton(wrapper)

			expect(togglebutton.attributes('aria-controls')).toBe(navigation.attributes('id'))
		})

		it('has correct aria attributes and inert on open navigation', () => {
			const wrapper = mount(NcAppNavigation)
			const navigation = findNavigation(wrapper)
			const togglebutton = findToggleButton(wrapper)

			expect(navigation.attributes('aria-hidden')).toBe('false')
			expect(navigation.attributes('inert')).toBeFalsy()
			expect(togglebutton.attributes('aria-expanded')).toBe('true')
			expect(togglebutton.attributes('aria-label')).toBe('Close navigation')
		})

		it('has correct aria attributes and inert on closed navigation', async () => {
			const wrapper = mount(NcAppNavigation)
			const navigation = findNavigation(wrapper)
			const togglebutton = findToggleButton(wrapper)

			// Close navigation
			await togglebutton.trigger('click')

			expect(navigation.attributes('aria-hidden')).toBe('true')
			expect(navigation.attributes('inert')).toBeTruthy()
			expect(togglebutton.attributes('aria-expanded')).toBe('false')
			expect(togglebutton.attributes('aria-label')).toBe('Open navigation [n]')
		})

		it('has correct aria attributes and inert on closed navigation with disabled shortcuts', async () => {
			window.OCP = { Accessibility: { disableKeyboardShortcuts: () => true } }
			const wrapper = mount(NcAppNavigation)
			const togglebutton = findToggleButton(wrapper)

			// Close navigation
			await togglebutton.trigger('click')
			expect(togglebutton.attributes('aria-label')).toBe('Open navigation [n]')

			// Clean up
			delete window.OCP
		})

		it('has aria-label from corresponding prop on navigation', () => {
			const wrapper = mount(NcAppNavigation, {
				propsData: { ariaLabel: 'Navigation' },
			})
			const navigation = findNavigation(wrapper)
			expect(navigation.attributes('aria-label')).toBe('Navigation')
		})

		it('has aria-labelledby from corresponding prop on navigation', () => {
			const wrapper = mount(NcAppNavigation, {
				propsData: { ariaLabelledby: 'navHeaderId' },
			})
			const navigation = findNavigation(wrapper)
			expect(navigation.attributes('aria-labelledby')).toBe('navHeaderId')
		})
	})
})
