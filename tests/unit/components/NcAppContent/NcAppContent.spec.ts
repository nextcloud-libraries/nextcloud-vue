/*
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { subscribe, unsubscribe } from '@nextcloud/event-bus'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import NcAppContent from '../../../../src/components/NcAppContent/NcAppContent.vue'

/**
 * Dispatch a single finger touch event on an element.
 *
 * @param element - The element to dispatch the event on
 * @param type - The touch event type
 * @param clientX - The horizontal position of the finger
 */
function dispatchTouchEvent(element: Element, type: string, clientX: number): void {
	const event = new Event(type, { bubbles: true })
	Object.defineProperty(event, 'touches', { value: [{ clientX, clientY: 0 }] })
	element.dispatchEvent(event)
}

describe('NcAppContent', () => {
	beforeEach(() => {
		document.title = 'Initial title'
	})

	it('does not set a page heading by default', () => {
		const wrapper = mount(NcAppContent)

		expect(wrapper.find('h1').exists()).toBe(false)
	})

	it('can set the page heading', () => {
		const wrapper = mount(NcAppContent, {
			propsData: {
				pageHeading: 'My heading',
			},
		})

		expect(wrapper.find('h1').text()).toBe('My heading')
	})

	it('does not set the document title without page heading', () => {
		mount(NcAppContent)

		expect(document.title).toBe('Initial title')
	})

	it('sets the document title if a heading is provided', () => {
		mount(NcAppContent, {
			propsData: {
				pageHeading: 'My heading',
			},
		})

		expect(document.title).toBe('My heading - nextcloud-vue - Nextcloud')
	})

	it('does not duplicate the heading in the document title', () => {
		mount(NcAppContent, {
			propsData: {
				pageHeading: 'nextcloud-vue',
			},
		})

		expect(document.title).toBe('nextcloud-vue - Nextcloud')
	})

	it('does not duplicate the heading in the document title if already formatted', () => {
		mount(NcAppContent, {
			propsData: {
				pageHeading: 'My heading - nextcloud-vue',
			},
		})

		expect(document.title).toBe('My heading - nextcloud-vue - Nextcloud')
	})

	it('sets the document title if pageTitle is provided', () => {
		mount(NcAppContent, {
			propsData: {
				pageTitle: 'My title',
			},
		})

		expect(document.title).toBe('My title - Nextcloud')
	})

	it('does not duplicate the title in the document title', () => {
		mount(NcAppContent, {
			propsData: {
				pageTitle: 'Nextcloud',
			},
		})

		expect(document.title).toBe('Nextcloud')
	})

	it('does not duplicate the title in the document title if already formatted', () => {
		mount(NcAppContent, {
			propsData: {
				pageTitle: 'My title - Nextcloud',
			},
		})

		expect(document.title).toBe('My title - Nextcloud')
	})

	it('sets the document title if pageTitle and pageHeading are provided', () => {
		mount(NcAppContent, {
			propsData: {
				pageHeading: 'My heading',
				pageTitle: 'My title',
			},
		})

		expect(document.title).toBe('My title - Nextcloud')
	})

	it('updates the show details state when going back to the list', async () => {
		const wrapper = mount(NcAppContent, {
			slots: {
				list: '<div class="list" />',
			},
		})

		// the details are shown by default, so the toggle to go back to the list is available
		await wrapper.find('.app-details-toggle').trigger('click')

		expect(wrapper.emitted('update:showDetails')).toEqual([[false]])
	})

	it('toggles the navigation on swipe', async () => {
		const handler = vi.fn()
		subscribe('toggle-navigation', handler)

		const wrapper = mount(NcAppContent, { attachTo: document.body })
		// the touch handlers are registered on the root element once it is mounted
		await nextTick()

		dispatchTouchEvent(wrapper.element, 'touchstart', 10)
		dispatchTouchEvent(wrapper.element, 'touchmove', 300)
		dispatchTouchEvent(wrapper.element, 'touchend', 300)

		expect(handler).toHaveBeenCalledWith({ open: true })
		unsubscribe('toggle-navigation', handler)
	})

	it('does not toggle the navigation on swipe if swiping is disabled', async () => {
		const handler = vi.fn()
		subscribe('toggle-navigation', handler)

		const wrapper = mount(NcAppContent, {
			attachTo: document.body,
			propsData: {
				disableSwipe: true,
			},
		})
		await nextTick()

		dispatchTouchEvent(wrapper.element, 'touchstart', 10)
		dispatchTouchEvent(wrapper.element, 'touchmove', 300)
		dispatchTouchEvent(wrapper.element, 'touchend', 300)

		expect(handler).not.toHaveBeenCalled()
		unsubscribe('toggle-navigation', handler)
	})
})
