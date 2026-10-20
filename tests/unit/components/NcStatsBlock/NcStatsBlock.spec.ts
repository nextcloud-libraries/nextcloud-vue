/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHashHistory } from 'vue-router'
import NcStatsBlock from '../../../../src/components/NcStatsBlock/NcStatsBlock.vue'

const getCanonicalLocale = vi.hoisted(() => vi.fn(() => 'en-US'))

vi.mock('@nextcloud/l10n', async (original) => ({
	...(await original()),
	getCanonicalLocale,
}))

describe('NcStatsBlock', () => {
	it('renders the name and the value', () => {
		const wrapper = mount(NcStatsBlock, { props: { name: 'Open cases', value: 42 } })
		expect(wrapper.element.tagName).toBe('DIV')
		const paragraphs = wrapper.findAll('p')
		expect(paragraphs[0].text()).toBe('Open cases')
		expect(paragraphs[1].text()).toBe('42')
	})

	it('formats a number for the user\'s locale', () => {
		getCanonicalLocale.mockImplementationOnce(() => 'de-DE')
		const wrapper = mount(NcStatsBlock, { props: { name: 'Documents', value: 12873 } })
		expect(wrapper.findAll('p')[1].text()).toBe('12.873')
	})

	it('shows a string value as it is', () => {
		const wrapper = mount(NcStatsBlock, { props: { name: 'Budget used', value: '1234 %' } })
		expect(wrapper.findAll('p')[1].text()).toBe('1234 %')
	})

	it('shows the label next to the value', () => {
		const wrapper = mount(NcStatsBlock, { props: { name: 'Documents', value: 3, label: 'this year' } })
		const spans = wrapper.findAll('p')[1].findAll('span')
		expect(spans.map((span) => span.text())).toEqual(['3', 'this year'])
	})

	it('renders the icon only when an icon path or icon slot is given', () => {
		const without = mount(NcStatsBlock, { props: { name: 'Documents', value: 3 } })
		expect(without.find('svg').exists()).toBe(false)

		const withPath = mount(NcStatsBlock, { props: { name: 'Documents', value: 3, iconPath: 'M0 0h24v24H0z' } })
		expect(withPath.find('svg path').attributes('d')).toBe('M0 0h24v24H0z')

		const withSlot = mount(NcStatsBlock, {
			props: { name: 'Documents', value: 3, iconPath: 'M0 0h24v24H0z' },
			slots: { icon: '<span class="custom-icon" />' },
		})
		expect(withSlot.find('.custom-icon').exists()).toBe(true)
		expect(withSlot.find('svg path[d="M0 0h24v24H0z"]').exists()).toBe(false)
	})

	it('adds the class of the variant, primary by default', () => {
		const primary = mount(NcStatsBlock, { props: { name: 'Documents', value: 3 } })
		expect(primary.classes().some((name) => name.includes('ncStatsBlock_primary'))).toBe(true)

		const error = mount(NcStatsBlock, { props: { name: 'Documents', value: 3, variant: 'error' } })
		expect(error.classes().some((name) => name.includes('ncStatsBlock_error'))).toBe(true)
		expect(error.classes().some((name) => name.includes('ncStatsBlock_primary'))).toBe(false)
	})

	it('shows a loading icon instead of the value while loading', () => {
		const wrapper = mount(NcStatsBlock, { props: { name: 'Storage', value: 0, loading: true } })
		expect(wrapper.attributes('aria-busy')).toBe('true')
		expect(wrapper.find('[role="img"]').attributes('aria-label')).toBe('Loading …')
		expect(wrapper.text()).not.toContain('0')
	})

	it('renders the default slot below the value', () => {
		const wrapper = mount(NcStatsBlock, {
			props: { name: 'Tasks', value: 24 },
			slots: { default: '<p class="breakdown">18 done, 6 open</p>' },
		})
		expect(wrapper.get('.breakdown').text()).toBe('18 done, 6 open')
	})

	it('renders a link when href is set', () => {
		const wrapper = mount(NcStatsBlock, { props: { name: 'Messages', value: 5, href: '/apps/mail' } })
		expect(wrapper.element.tagName).toBe('A')
		expect(wrapper.attributes('href')).toBe('/apps/mail')
	})

	it('renders a router link when to is set and a router is available', async () => {
		const router = createRouter({
			history: createWebHashHistory(),
			routes: [
				{ path: '/', name: 'root', component: { template: '<div />' } },
				{ path: '/cases', name: 'cases', component: { template: '<div />' } },
			],
		})
		const wrapper = mount(NcStatsBlock, {
			props: { name: 'Open cases', value: 42, to: { name: 'cases' }, href: '/ignored' },
			global: { plugins: [router] },
		})
		await router.isReady()
		expect(wrapper.element.tagName).toBe('A')
		expect(wrapper.attributes('href')).toBe('#/cases')
	})

	it('ignores to without a router', () => {
		const wrapper = mount(NcStatsBlock, { props: { name: 'Open cases', value: 42, to: { name: 'cases' } } })
		expect(wrapper.element.tagName).toBe('DIV')
	})
})
