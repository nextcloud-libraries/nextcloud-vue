/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { NcTabsTab } from '../../../../src/components/NcTabs/NcTabs.vue'

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
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
	const wrapper = mount(NcTabs, {
		props: {
			tabs,
			modelValue,
			ariaLabel: 'Document',
			'onUpdate:modelValue': (id: unknown) => wrapper.setProps({ modelValue: id as string }),
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
		['an enabled tab', 'sharing'],
	])('does not change the model when it is %s', (_, modelValue) => {
		const wrapper = mount(NcTabs, { props: { tabs, modelValue }, slots })
		expect(wrapper.emitted('update:modelValue')).toBeUndefined()
		wrapper.unmount()
	})

	it('shows the tab of the model once it is enabled', async () => {
		const wrapper = mountTabs('history')
		expect(wrapper.get('[aria-selected="true"]').text()).toBe('Details')
		await wrapper.setProps({ tabs: tabs.map((tab) => ({ ...tab, disabled: false })) })
		expect(wrapper.get('[aria-selected="true"]').text()).toBe('History')
		expect(wrapper.emitted('update:modelValue')).toBeUndefined()
		wrapper.unmount()
	})

	it('shows the first enabled tab when the selected tab is removed', async () => {
		const wrapper = mountTabs('comments')
		await wrapper.setProps({ tabs: tabs.filter((tab) => tab.id !== 'comments') })
		expect(wrapper.get('[aria-selected="true"]').text()).toBe('Details')
		expect(wrapper.emitted('update:modelValue')).toBeUndefined()
		wrapper.unmount()
	})

	it('keeps the tab and its panel linked when the tab id has whitespace', () => {
		const wrapper = mount(NcTabs, {
			props: { tabs: [{ id: 'my tab', name: 'Mine' }], modelValue: 'my tab' },
			slots: { 'panel-my tab': '<p>My panel</p>' },
		})
		const tab = wrapper.get('[role="tab"]')
		const panel = wrapper.get('[role="tabpanel"]')
		expect(tab.attributes('id')).not.toMatch(/\s/)
		expect(tab.attributes('aria-controls')).toBe(panel.attributes('id'))
		expect(panel.attributes('aria-labelledby')).toBe(tab.attributes('id'))
		expect(panel.text()).toBe('My panel')
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

	it('marks a disabled tab without taking it out of the keyboard order, and does not select it', async () => {
		const wrapper = mountTabs('details')
		const history = wrapper.findAll('[role="tab"]')[1]
		expect(history.attributes('aria-disabled')).toBe('true')
		expect(history.attributes('disabled')).toBeUndefined()
		await history.trigger('click')
		expect(wrapper.emitted('update:modelValue')).toBeUndefined()
		wrapper.unmount()
	})

	it('moves the focus between all tabs with the arrow keys and wraps around, without selecting', async () => {
		const wrapper = mountTabs('details')
		const list = wrapper.get('[role="tablist"]')
		const focusedText = () => document.activeElement?.textContent

		await list.trigger('keydown', { key: 'ArrowRight' })
		expect(focusedText()).toBe('History')

		await list.trigger('keydown', { key: 'ArrowRight' })
		expect(focusedText()).toContain('Comments')

		await list.trigger('keydown', { key: 'ArrowRight' })
		await list.trigger('keydown', { key: 'ArrowRight' })
		expect(focusedText()).toBe('Details')

		await list.trigger('keydown', { key: 'ArrowLeft' })
		expect(focusedText()).toBe('Sharing')

		expect(wrapper.emitted('update:modelValue')).toBeUndefined()
		expect(wrapper.get('[aria-selected="true"]').text()).toBe('Details')
		wrapper.unmount()
	})

	it('goes to the first and last tab with Home and End', async () => {
		const wrapper = mountTabs('comments')
		const list = wrapper.get('[role="tablist"]')

		await list.trigger('keydown', { key: 'End' })
		expect(document.activeElement?.textContent).toBe('Sharing')

		await list.trigger('keydown', { key: 'Home' })
		expect(document.activeElement?.textContent).toBe('Details')
		expect(wrapper.emitted('update:modelValue')).toBeUndefined()
		wrapper.unmount()
	})

	it('ignores arrow keys with a modifier', async () => {
		const wrapper = mountTabs('details')
		await wrapper.get('[role="tablist"]').trigger('keydown', { key: 'ArrowRight', ctrlKey: true })
		expect(document.activeElement).toBe(document.body)
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
