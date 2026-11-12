/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { NcTabsTab } from '../../../../src/components/NcTabs/NcTabs.vue'

import { mdiCog, mdiCogOutline } from '@mdi/js'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import NcIconSvgWrapper from '../../../../src/components/NcIconSvgWrapper/NcIconSvgWrapper.vue'
import NcTabs from '../../../../src/components/NcTabs/NcTabs.vue'

// The test environment reports Nextcloud 32, but the sliding highlight is only in the current
// design, so opt into it here
vi.mock('../../../../src/utils/legacy.ts', () => ({ isLegacy: false, isLegacy34: false }))

const tabs: NcTabsTab[] = [
	{ id: 'details', label: 'Details', iconPath: mdiCogOutline, iconPathSelected: mdiCog },
	{ id: 'history', label: 'History', disabled: true },
	{ id: 'comments', label: 'Comments' },
]

/**
 * Report a position for an element, which jsdom always reports as zero.
 *
 * @param element - The element
 * @param left - The left offset to report
 * @param width - The width to report
 */
function setRect(element: Element, left: number, width: number) {
	element.getBoundingClientRect = () => ({ left, top: 0, width, height: 40, right: left + width, bottom: 40, x: left, y: 0, toJSON: () => ({}) })
}

/**
 * Mount the tabs, each tab 100px wide.
 */
async function mountTabs() {
	const wrapper = mount(NcTabs, {
		props: { tabs, modelValue: 'comments', ariaLabel: 'Document' },
		attachTo: document.body,
	})
	await nextTick()
	setRect(wrapper.get('[role="tablist"]').element, 0, 300)
	wrapper.findAll('[role="tab"]').forEach((tab, index) => setRect(tab.element, index * 100, 100))
	return wrapper
}

describe('NcTabs in the current design', () => {
	beforeEach(() => {
		// Run the frame callback at once, so the snap-then-slide handoff is settled when a test checks it
		vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
			callback(0)
			return 0
		})
	})

	afterEach(() => {
		vi.unstubAllGlobals()
		document.body.innerHTML = ''
	})

	const highlight = (wrapper: Awaited<ReturnType<typeof mountTabs>>) => wrapper.get('[role="tablist"] > [aria-hidden="true"]')

	it('has a highlight that is hidden until a tab is hovered', async () => {
		const wrapper = await mountTabs()
		expect(highlight(wrapper).attributes('class')).not.toMatch(/highlight_visible/)
	})

	it('covers the hovered tab and slides to the next one', async () => {
		const wrapper = await mountTabs()
		const tabElements = wrapper.findAll('[role="tab"]')

		await tabElements[0].trigger('pointerover')
		expect(highlight(wrapper).attributes('class')).toMatch(/highlight_visible/)
		expect(highlight(wrapper).attributes('style')).toContain('translate(0px, 0px)')
		expect(highlight(wrapper).attributes('style')).toContain('width: 100px')

		await tabElements[2].trigger('pointerover')
		expect(highlight(wrapper).attributes('class')).toMatch(/highlight_animated/)
		expect(highlight(wrapper).attributes('style')).toContain('translate(200px, 0px)')
	})

	it('turns transparent over the selected tab', async () => {
		const wrapper = await mountTabs()
		await wrapper.findAll('[role="tab"]')[2].trigger('pointerover')
		expect(highlight(wrapper).attributes('class')).toMatch(/highlight_overActive/)
	})

	it('does not highlight a disabled tab', async () => {
		const wrapper = await mountTabs()
		const tabElements = wrapper.findAll('[role="tab"]')
		await tabElements[0].trigger('pointerover')
		await tabElements[1].trigger('pointerover')
		expect(highlight(wrapper).attributes('class')).not.toMatch(/highlight_visible/)
	})

	it('follows the focus and hides when the pointer or the focus leaves the tabs', async () => {
		const wrapper = await mountTabs()
		const list = wrapper.get('[role="tablist"]')

		await wrapper.findAll('[role="tab"]')[2].trigger('focusin')
		expect(highlight(wrapper).attributes('style')).toContain('translate(200px, 0px)')
		await list.trigger('focusout', { relatedTarget: document.body })
		expect(highlight(wrapper).attributes('class')).not.toMatch(/highlight_visible/)

		await wrapper.findAll('[role="tab"]')[0].trigger('pointerover')
		await list.trigger('pointerleave')
		expect(highlight(wrapper).attributes('class')).not.toMatch(/highlight_visible/)
	})

	it('shows the selected icon of the selected tab and the other icon hidden', async () => {
		const wrapper = mount(NcTabs, { props: { tabs, modelValue: 'details' } })
		const icons = wrapper.get('[role="tab"]').findAllComponents(NcIconSvgWrapper)
		expect(icons.map((icon) => icon.props('path'))).toEqual([mdiCogOutline, mdiCog])
		expect(icons[0].element.parentElement!.className).toMatch(/iconLayer_hidden/)
		expect(icons[1].element.parentElement!.className).not.toMatch(/iconLayer_hidden/)
	})

	it('pops the icon of a tab when it is clicked', async () => {
		const wrapper = await mountTabs()
		const details = wrapper.findAll('[role="tab"]')[0]
		await details.trigger('click')
		expect(wrapper.emitted('update:modelValue')).toEqual([['details']])
		expect(details.get('[class*="icon_pop"]').exists()).toBe(true)
	})
})
