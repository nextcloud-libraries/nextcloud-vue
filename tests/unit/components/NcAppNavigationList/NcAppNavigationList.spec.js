/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import NcAppNavigationList from '../../../../src/components/NcAppNavigationList/NcAppNavigationList.vue'

/**
 * Stub getBoundingClientRect, which jsdom always reports as zero.
 *
 * @param {Element} el the element to stub
 * @param {number} top the top offset to report
 * @param {number} height the height to report
 */
function setRect(el, top, height) {
	el.getBoundingClientRect = () => ({
		top,
		height,
		bottom: top + height,
		left: 0,
		right: 0,
		width: 0,
		x: 0,
		y: top,
		toJSON: () => ({}),
	})
}

/**
 * Mount the list with three entries: a plain one, the active one and an entry
 * that is being edited, each with a stubbed geometry.
 */
function mountList() {
	const wrapper = mount(NcAppNavigationList, {
		slots: {
			default: '<div class="app-navigation-entry" data-id="one">One</div>'
				+ '<div class="app-navigation-entry active" data-id="two">Two</div>'
				+ '<div class="app-navigation-entry app-navigation-entry--editing" data-id="three">Three</div>',
		},
	})
	setRect(wrapper.element, 0, 300)
	const entries = wrapper.findAll('.app-navigation-entry')
	setRect(entries[0].element, 0, 44)
	setRect(entries[1].element, 50, 44)
	setRect(entries[2].element, 100, 44)
	return wrapper
}

describe('NcAppNavigationList.vue', () => {
	let rafQueue = []

	beforeEach(() => {
		rafQueue = []
		vi.stubGlobal('requestAnimationFrame', (cb) => rafQueue.push(cb))
	})

	afterEach(() => {
		vi.unstubAllGlobals()
	})

	/** Run the queued requestAnimationFrame callbacks. */
	const flushRaf = () => {
		const queued = rafQueue
		rafQueue = []
		queued.forEach((cb) => cb())
	}

	it('enables the sliding highlight once mounted', async () => {
		const wrapper = mountList()
		expect(wrapper.vm.enabled).toBe(true)
		await nextTick()
		expect(wrapper.get('.app-navigation-list__highlight')).toBeTruthy()
	})

	it('shows and positions the highlight over the hovered entry', async () => {
		const wrapper = mountList()

		await wrapper.find('[data-id="one"]').trigger('pointerover')

		expect(wrapper.vm.visible).toBe(true)
		expect(wrapper.vm.top).toBe(0)
		expect(wrapper.vm.height).toBe(44)
		expect(wrapper.vm.overActive).toBe(false)
	})

	it('snaps when re-appearing, then enables sliding', async () => {
		const wrapper = mountList()

		await wrapper.find('[data-id="one"]').trigger('pointerover')
		// Snapped into place: no transition yet, the rAF has not run
		expect(wrapper.vm.animated).toBe(false)

		flushRaf()
		await nextTick()
		// Sliding is enabled for subsequent moves
		expect(wrapper.vm.animated).toBe(true)
	})

	it('slides (animates) when moving while already visible', async () => {
		const wrapper = mountList()

		await wrapper.find('[data-id="one"]').trigger('pointerover')
		await wrapper.find('[data-id="two"]').trigger('pointerover')

		expect(wrapper.vm.animated).toBe(true)
		expect(wrapper.vm.top).toBe(50)
	})

	it('turns transparent over the active entry', async () => {
		const wrapper = mountList()

		await wrapper.find('[data-id="two"]').trigger('pointerover')

		expect(wrapper.vm.overActive).toBe(true)
		expect(wrapper.get('.app-navigation-list__highlight').classes())
			.toContain('app-navigation-list__highlight--over-active')
	})

	it('ignores entries that are being edited', async () => {
		const wrapper = mountList()

		await wrapper.find('[data-id="three"]').trigger('pointerover')

		expect(wrapper.vm.visible).toBe(false)
	})

	it('hides the highlight when the pointer leaves the list', async () => {
		const wrapper = mountList()

		await wrapper.find('[data-id="one"]').trigger('pointerover')
		expect(wrapper.vm.visible).toBe(true)

		await wrapper.trigger('pointerleave')
		expect(wrapper.vm.visible).toBe(false)
	})

	it('hides only when focus leaves the list entirely', async () => {
		const wrapper = mountList()
		await wrapper.find('[data-id="one"]').trigger('focusin')
		expect(wrapper.vm.visible).toBe(true)

		// Focus moving to another entry inside the list keeps it visible
		await wrapper.find('[data-id="two"]').element.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: wrapper.find('[data-id="one"]').element }))
		expect(wrapper.vm.visible).toBe(true)

		// Focus leaving the list hides it
		await wrapper.find('[data-id="two"]').element.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: document.body }))
		expect(wrapper.vm.visible).toBe(false)
	})
})
