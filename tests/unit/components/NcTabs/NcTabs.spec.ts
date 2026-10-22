/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { NcTabsTab } from '../../../../src/components/NcTabs/NcTabs.vue'

import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import NcTabs from '../../../../src/components/NcTabs/NcTabs.vue'

const tabs: NcTabsTab[] = [
	{ id: 'details', name: 'Details' },
	{ id: 'history', name: 'History', disabled: true },
	{ id: 'comments', name: 'Comments', count: 3 },
	{ id: 'sharing', name: 'Sharing' },
]

const slots = {
	'panel-details': '<p>Details panel</p>',
	'panel-comments': '<p>Comments panel</p>',
	'panel-sharing': '<p>Sharing panel</p>',
}

/**
 * Mount the tabs with a working v-model.
 *
 * @param modelValue - The selected tab id
 */
function mountTabs(modelValue?: string) {
	// A model that does not match an enabled tab is replaced while mounting, before `wrapper` is assigned
	const wrapper = mount(NcTabs, {
		props: {
			tabs,
			modelValue,
			ariaLabel: 'Document',
			'onUpdate:modelValue': (id: unknown) => Promise.resolve().then(() => wrapper.setProps({ modelValue: id as string })),
		},
		slots,
		attachTo: document.body,
	})
	return wrapper
}

describe('NcTabs', () => {
	it('renders a labeled tablist with a tab per entry', () => {
		const wrapper = mountTabs('details')
		const list = wrapper.get('[role="tablist"]')
		expect(list.attributes('aria-label')).toBe('Document')
		expect(wrapper.findAll('[role="tab"]').map((tab) => tab.text())).toEqual(['Details', 'History', 'Comments3', 'Sharing'])
		wrapper.unmount()
	})

	it('renders only the panel of the selected tab, labeled by its tab', () => {
		const wrapper = mountTabs('comments')
		const panels = wrapper.findAll('[role="tabpanel"]')
		expect(panels).toHaveLength(1)
		expect(panels[0].text()).toBe('Comments panel')

		const tab = wrapper.get('[aria-selected="true"]')
		expect(tab.text()).toContain('Comments')
		expect(panels[0].attributes('aria-labelledby')).toBe(tab.attributes('id'))
		expect(tab.attributes('aria-controls')).toBe(panels[0].attributes('id'))
		wrapper.unmount()
	})

	it('shows the first enabled tab when the model does not match one', () => {
		const wrapper = mountTabs('unknown')
		expect(wrapper.get('[aria-selected="true"]').text()).toBe('Details')
		expect(wrapper.get('[role="tabpanel"]').text()).toBe('Details panel')
		wrapper.unmount()
	})

	it.each([
		['an unknown tab', 'unknown'],
		['a disabled tab', 'history'],
		['no tab', undefined],
	])('makes the shown tab the model when the model is %s', (_, modelValue) => {
		const wrapper = mount(NcTabs, { props: { tabs, modelValue }, slots })
		expect(wrapper.emitted('update:modelValue')).toEqual([['details']])
		wrapper.unmount()
	})

	it('makes the shown tab the model when the selected tab is removed', async () => {
		const wrapper = mountTabs('comments')
		await wrapper.setProps({ tabs: tabs.filter((tab) => tab.id !== 'comments') })
		await flushPromises()
		expect(wrapper.emitted('update:modelValue')).toEqual([['details']])
		expect(wrapper.get('[aria-selected="true"]').text()).toBe('Details')
		wrapper.unmount()
	})

	it('does not change a model that matches an enabled tab', () => {
		const wrapper = mountTabs('sharing')
		expect(wrapper.emitted('update:modelValue')).toBeUndefined()
		wrapper.unmount()
	})

	it('can name the tablist by another element', () => {
		const wrapper = mount(NcTabs, { props: { tabs, modelValue: 'details', ariaLabelledby: 'heading' }, slots })
		expect(wrapper.get('[role="tablist"]').attributes('aria-labelledby')).toBe('heading')
		wrapper.unmount()
	})

	it('only lets the selected tab be reached with Tab', () => {
		const wrapper = mountTabs('details')
		expect(wrapper.findAll('[role="tab"]').map((tab) => tab.attributes('tabindex'))).toEqual(['0', '-1', '-1', '-1'])
		wrapper.unmount()
	})

	it('selects a tab on click', async () => {
		const wrapper = mountTabs('details')
		await wrapper.findAll('[role="tab"]')[2].trigger('click')
		expect(wrapper.emitted('update:modelValue')).toEqual([['comments']])
		expect(wrapper.get('[role="tabpanel"]').text()).toBe('Comments panel')
		wrapper.unmount()
	})

	it('does not select a disabled tab', async () => {
		const wrapper = mountTabs('details')
		const history = wrapper.findAll('[role="tab"]')[1]
		expect(history.attributes('disabled')).toBeDefined()
		await history.trigger('click')
		expect(wrapper.emitted('update:modelValue')).toBeUndefined()
		wrapper.unmount()
	})

	it('moves between the enabled tabs with the arrow keys and wraps around', async () => {
		const wrapper = mountTabs('details')
		const list = wrapper.get('[role="tablist"]')

		await list.trigger('keydown', { key: 'ArrowRight' })
		await nextTick()
		expect(wrapper.get('[aria-selected="true"]').text()).toContain('Comments')
		expect(document.activeElement?.textContent).toContain('Comments')

		await list.trigger('keydown', { key: 'ArrowRight' })
		await list.trigger('keydown', { key: 'ArrowRight' })
		await nextTick()
		expect(wrapper.get('[aria-selected="true"]').text()).toBe('Details')

		await list.trigger('keydown', { key: 'ArrowLeft' })
		await nextTick()
		expect(wrapper.get('[aria-selected="true"]').text()).toBe('Sharing')
		wrapper.unmount()
	})

	it('goes to the first and last tab with Home and End', async () => {
		const wrapper = mountTabs('comments')
		const list = wrapper.get('[role="tablist"]')

		await list.trigger('keydown', { key: 'End' })
		await nextTick()
		expect(wrapper.get('[aria-selected="true"]').text()).toBe('Sharing')

		await list.trigger('keydown', { key: 'Home' })
		await nextTick()
		expect(wrapper.get('[aria-selected="true"]').text()).toBe('Details')
		wrapper.unmount()
	})

	it('ignores arrow keys with a modifier', async () => {
		const wrapper = mountTabs('details')
		await wrapper.get('[role="tablist"]').trigger('keydown', { key: 'ArrowRight', ctrlKey: true })
		expect(wrapper.emitted('update:modelValue')).toBeUndefined()
		wrapper.unmount()
	})

	it('shows the count in a counter bubble', () => {
		const wrapper = mountTabs('details')
		const tabElements = wrapper.findAll('[role="tab"]')
		expect(tabElements[2].find('.counter-bubble__counter').text()).toBe('3')
		expect(tabElements[0].find('.counter-bubble__counter').exists()).toBe(false)
		wrapper.unmount()
	})
})
