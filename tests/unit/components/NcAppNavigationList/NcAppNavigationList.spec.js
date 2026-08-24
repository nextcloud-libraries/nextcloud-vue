/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
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
 * Mount the list with a plain entry and an active one, each with a stubbed
 * geometry. Entries are plain elements: the list must not depend on their
 * markup, only on them asking for the highlight.
 */
function mountList() {
	const wrapper = mount(NcAppNavigationList, {
		slots: {
			default: '<div class="entry" data-id="one">One</div>'
				+ '<div class="entry active" data-id="two">Two</div>',
		},
	})
	setRect(wrapper.element, 0, 300)
	const entries = wrapper.findAll('.entry').map((e) => e.element)
	setRect(entries[0], 0, 44)
	setRect(entries[1], 50, 44)
	return { wrapper, entries, api: wrapper.vm }
}

describe('NcAppNavigationList.vue', () => {
	let rafQueue = new Map()
	let rafId = 0

	beforeEach(() => {
		rafQueue = new Map()
		rafId = 0
		vi.stubGlobal('requestAnimationFrame', (cb) => {
			rafQueue.set(++rafId, cb)
			return rafId
		})
		// Cancelling has to actually drop the callback, otherwise a flush runs
		// frames the component already cancelled
		vi.stubGlobal('cancelAnimationFrame', (id) => rafQueue.delete(id))
	})

	afterEach(() => {
		vi.unstubAllGlobals()
	})

	/** Run the queued requestAnimationFrame callbacks. */
	const flushRaf = () => {
		const queued = [...rafQueue.values()]
		rafQueue.clear()
		queued.forEach((cb) => cb())
	}

	it('renders the highlight hidden until an entry asks for it', () => {
		const { wrapper } = mountList()
		// Always rendered, so moving it can transition from a painted position
		expect(wrapper.get('.app-navigation-list__highlight').classes())
			.not.toContain('app-navigation-list__highlight--visible')
	})

	it('shows and positions the highlight on the requesting entry', async () => {
		const { wrapper, entries, api } = mountList()

		api.show(entries[0])
		await nextTick()

		expect(api.visible).toBe(true)
		expect(api.top).toBe(0)
		expect(api.height).toBe(44)
		expect(api.overActive).toBe(false)
		expect(wrapper.get('.app-navigation-list__highlight').classes())
			.toContain('app-navigation-list__highlight--visible')
	})

	it('snaps when appearing, then enables sliding', async () => {
		const { api } = mountList()

		api.show(api.$el.querySelector('[data-id="one"]'))
		expect(api.animated).toBe(false)

		await nextTick()
		flushRaf()
		expect(api.animated).toBe(true)
	})

	it('slides when moving between entries while visible', async () => {
		const { entries, api } = mountList()

		api.show(entries[0])
		await nextTick()
		flushRaf()
		api.show(entries[1])

		expect(api.animated).toBe(true)
		expect(api.top).toBe(50)
	})

	it('turns transparent over the active entry', async () => {
		const { wrapper, entries, api } = mountList()

		api.show(entries[1])
		await nextTick()

		expect(api.overActive).toBe(true)
		expect(wrapper.get('.app-navigation-list__highlight').classes())
			.toContain('app-navigation-list__highlight--over-active')
	})

	it('hides when the entry holding the highlight releases it', async () => {
		const { entries, api } = mountList()

		api.show(entries[0])
		// E.g. a virtual scroller dropping the entry the highlight sits on
		api.hide(entries[0])

		expect(api.visible).toBe(false)
	})

	it('keeps sliding when the pointer dwells between entries', async () => {
		const { wrapper, entries, api } = mountList()

		api.show(entries[0])
		await nextTick()
		flushRaf()

		// The pointer sits in the gap between two entries for a while. No entry is
		// entered, and the list was not left, so the highlight must stay put.
		flushRaf()
		expect(api.visible).toBe(true)

		api.show(entries[1])
		await nextTick()

		// Must not have dropped to the snapping path
		expect(api.visible).toBe(true)
		expect(api.animated).toBe(true)
		expect(api.top).toBe(50)
		expect(wrapper.get('.app-navigation-list__highlight').classes())
			.toContain('app-navigation-list__highlight--animated')
	})

	it('hides when the pointer leaves the list', async () => {
		const { wrapper, entries, api } = mountList()

		api.show(entries[0])
		await nextTick()
		expect(api.visible).toBe(true)

		await wrapper.trigger('pointerleave')

		expect(api.visible).toBe(false)
	})

	it('ignores a release from an entry that no longer holds the highlight', async () => {
		const { entries, api } = mountList()

		api.show(entries[0])
		await nextTick()
		// Pointer moved to the next entry before the previous one reported leaving
		api.show(entries[1])
		api.hide(entries[0])

		expect(api.visible).toBe(true)
		expect(api.top).toBe(50)
	})

	it('re-measures on scroll, so it follows virtualised entries', async () => {
		const { wrapper, entries, api } = mountList()

		api.show(entries[0])
		await nextTick()
		flushRaf()

		// A virtual scroller repositions its entries as the list scrolls
		setRect(entries[0], 120, 44)
		await wrapper.trigger('scroll')
		flushRaf()

		expect(api.top).toBe(120)
	})

	it('does not re-measure on scroll while hidden', async () => {
		const { wrapper, entries, api } = mountList()

		api.show(entries[0])
		api.hide(entries[0])
		flushRaf()
		setRect(entries[0], 200, 44)
		await wrapper.trigger('scroll')
		flushRaf()

		expect(api.top).toBe(0)
	})
})
