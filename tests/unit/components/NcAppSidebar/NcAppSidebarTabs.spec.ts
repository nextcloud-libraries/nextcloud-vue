/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { nextTick } from 'vue'
import NcAppSidebarTabs from '../../../../src/components/NcAppSidebar/NcAppSidebarTabs.vue'
import NcAppSidebarTab from '../../../../src/components/NcAppSidebarTab/NcAppSidebarTab.vue'

// The test environment reports Nextcloud 32, but the sliding highlight only runs
// on the current design, so opt into it here.
vi.mock('../../../../src/utils/legacy.ts', () => ({ isLegacy: false, isLegacy34: false }))

/**
 * Stub getBoundingClientRect, which jsdom always reports as zero.
 *
 * @param el the element to stub
 * @param left the left offset to report
 * @param width the width to report
 */
function setRect(el: Element, left: number, width: number) {
	el.getBoundingClientRect = () => ({
		left,
		width,
		top: 0,
		height: 44,
		right: left + width,
		bottom: 44,
		x: left,
		y: 0,
		toJSON: () => ({}),
	})
}

/**
 * Mount the tabs with three tabs, the second one active, and a stubbed geometry:
 * the tablist starts at 0 and each tab is 100 wide.
 *
 * @return the mounted wrapper
 */
async function mountTabs() {
	const wrapper = mount(NcAppSidebarTabs, {
		props: { active: 'second' },
		slots: {
			default: [
				'<NcAppSidebarTab id="first" name="Tab1">Tab1</NcAppSidebarTab>',
				'<NcAppSidebarTab id="second" name="Tab2">Tab2</NcAppSidebarTab>',
				'<NcAppSidebarTab id="third" name="Tab3">Tab3</NcAppSidebarTab>',
			].join(''),
		},
		global: {
			components: { NcAppSidebarTab },
		},
	})
	// The tabs register themselves as they are created, so the tab navigation
	// only exists after the following render
	await nextTick()
	setRect(wrapper.find('[role="tablist"]').element, 0, 300)
	wrapper.findAll('[role="tab"]').forEach((tab, index) => setRect(tab.element, index * 100, 100))
	return wrapper
}

describe('NcAppSidebarTabs sliding highlight', () => {
	beforeEach(() => {
		// Run the frame callback synchronously so the snap-then-slide handoff is
		// settled by the time a test asserts on it
		vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
			cb(0)
			return 0
		})
	})

	afterEach(() => vi.unstubAllGlobals())

	test('is rendered but hidden until a tab is hovered', async () => {
		const wrapper = await mountTabs()
		await nextTick()

		const highlight = wrapper.find('.app-sidebar-tabs__highlight')
		expect(highlight.exists()).toBe(true)
		expect(highlight.classes()).not.toContain('app-sidebar-tabs__highlight--visible')
	})

	test('covers the hovered tab', async () => {
		const wrapper = await mountTabs()
		await nextTick()

		await wrapper.findAll('[role="tab"]')[0].trigger('pointerover')
		await nextTick()

		const highlight = wrapper.find('.app-sidebar-tabs__highlight')
		expect(highlight.classes()).toContain('app-sidebar-tabs__highlight--visible')
		expect(highlight.attributes('style')).toContain('translate(0px, 0px)')
		expect(highlight.attributes('style')).toContain('width: 100px')
	})

	test('slides to the next hovered tab', async () => {
		const wrapper = await mountTabs()
		await nextTick()
		const tabs = wrapper.findAll('[role="tab"]')

		await tabs[0].trigger('pointerover')
		await nextTick()
		await tabs[2].trigger('pointerover')
		await nextTick()

		const highlight = wrapper.find('.app-sidebar-tabs__highlight')
		// Sliding is enabled once it is already visible
		expect(highlight.classes()).toContain('app-sidebar-tabs__highlight--animated')
		expect(highlight.attributes('style')).toContain('translate(200px, 0px)')
	})

	test('turns transparent over the active tab', async () => {
		const wrapper = await mountTabs()
		await nextTick()
		const tabs = wrapper.findAll('[role="tab"]')

		await tabs[0].trigger('pointerover')
		await nextTick()
		expect(wrapper.find('.app-sidebar-tabs__highlight').classes())
			.not.toContain('app-sidebar-tabs__highlight--over-active')

		// The second tab is the active one
		await tabs[1].trigger('pointerover')
		await nextTick()
		expect(wrapper.find('.app-sidebar-tabs__highlight').classes())
			.toContain('app-sidebar-tabs__highlight--over-active')
	})

	test('is hidden again when the pointer leaves the tablist', async () => {
		const wrapper = await mountTabs()
		await nextTick()

		await wrapper.findAll('[role="tab"]')[0].trigger('pointerover')
		await nextTick()
		await wrapper.find('[role="tablist"]').trigger('pointerleave')
		await nextTick()

		expect(wrapper.find('.app-sidebar-tabs__highlight').classes())
			.not.toContain('app-sidebar-tabs__highlight--visible')
	})

	test('follows keyboard focus and hides when focus leaves the tablist', async () => {
		const wrapper = await mountTabs()
		await nextTick()
		const tabs = wrapper.findAll('[role="tab"]')

		await tabs[2].trigger('focusin')
		await nextTick()
		const highlight = wrapper.find('.app-sidebar-tabs__highlight')
		expect(highlight.classes()).toContain('app-sidebar-tabs__highlight--visible')
		expect(highlight.attributes('style')).toContain('translate(200px, 0px)')

		// Focus moving to something outside the tablist hides it
		await wrapper.find('[role="tablist"]').trigger('focusout', { relatedTarget: document.body })
		await nextTick()
		expect(wrapper.find('.app-sidebar-tabs__highlight').classes())
			.not.toContain('app-sidebar-tabs__highlight--visible')
	})

	test('keeps the highlight when focus moves within the tablist', async () => {
		const wrapper = await mountTabs()
		await nextTick()
		const tabs = wrapper.findAll('[role="tab"]')

		await tabs[0].trigger('focusin')
		await nextTick()
		await wrapper.find('[role="tablist"]').trigger('focusout', { relatedTarget: tabs[1].element })
		await nextTick()

		expect(wrapper.find('.app-sidebar-tabs__highlight').classes())
			.toContain('app-sidebar-tabs__highlight--visible')
	})

	test('clicking a tab activates it', async () => {
		const wrapper = await mountTabs()
		await nextTick()

		await wrapper.findAll('[role="tab"]')[2].trigger('click')
		await nextTick()

		expect(wrapper.emitted('update:active')?.at(-1)).toEqual(['third'])
		expect(wrapper.findAll('[role="tab"]')[2].attributes('aria-selected')).toBe('true')
	})

	test('does not measure again while the pointer stays on the same tab', async () => {
		const wrapper = await mountTabs()
		await nextTick()
		const tab = wrapper.findAll('[role="tab"]')[0]

		await tab.trigger('pointerover')
		await nextTick()
		const measured = vi.spyOn(tab.element, 'getBoundingClientRect')

		// pointerover fires again for the icon and label inside the same tab
		await tab.trigger('pointerover')
		await tab.trigger('pointerover')
		await nextTick()

		expect(measured).not.toHaveBeenCalled()
	})
})
