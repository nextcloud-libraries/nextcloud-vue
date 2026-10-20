/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createRouter, createWebHashHistory } from 'vue-router'
import NcCard from '../../../../src/components/NcCard/NcCard.vue'

describe('NcCard', () => {
	it('renders an article with the name as a level 3 heading by default', () => {
		const wrapper = mount(NcCard, { props: { name: 'Meeting notes' } })
		expect(wrapper.element.tagName).toBe('ARTICLE')
		expect(wrapper.get('h3').text()).toBe('Meeting notes')
		expect(wrapper.find('a').exists()).toBe(false)
	})

	it('renders the heading at the given level, but never as h1', () => {
		const wrapper = mount(NcCard, { props: { name: 'Meeting notes', headingLevel: 2 } })
		expect(wrapper.get('h2').text()).toBe('Meeting notes')

		// @ts-expect-error -- level 1 is not part of the type, but can still be passed at runtime
		const level1 = mount(NcCard, { props: { name: 'Meeting notes', headingLevel: 1 } })
		expect(level1.find('h1').exists()).toBe(false)
		expect(level1.get('h2').text()).toBe('Meeting notes')
	})

	it('renders the description only when it is set', () => {
		const without = mount(NcCard, { props: { name: 'Meeting notes' } })
		expect(without.find('p').exists()).toBe(false)

		const withDescription = mount(NcCard, { props: { name: 'Meeting notes', description: 'Weekly notes' } })
		expect(withDescription.get('p').text()).toBe('Weekly notes')
	})

	it('renders the icon only when an icon path or icon slot is given', () => {
		const without = mount(NcCard, { props: { name: 'Budget' } })
		expect(without.find('svg').exists()).toBe(false)

		const withPath = mount(NcCard, { props: { name: 'Budget', iconPath: 'M0 0h24v24H0z' } })
		expect(withPath.find('svg path').attributes('d')).toBe('M0 0h24v24H0z')

		const withSlot = mount(NcCard, {
			props: { name: 'Budget', iconPath: 'M0 0h24v24H0z' },
			slots: { icon: '<span class="custom-icon" />' },
		})
		expect(withSlot.find('.custom-icon').exists()).toBe(true)
		expect(withSlot.find('svg').exists()).toBe(false)
	})

	it('renders the actions, the content and the footer slots', () => {
		const wrapper = mount(NcCard, {
			props: { name: 'Budget' },
			slots: {
				actions: '<button type="button">Rename</button>',
				default: '<p class="content">Last changed by Jane Doe.</p>',
				footer: '<span class="footer">Published</span>',
			},
		})
		expect(wrapper.get('button').text()).toBe('Rename')
		expect(wrapper.get('.content').text()).toBe('Last changed by Jane Doe.')
		expect(wrapper.get('.footer').text()).toBe('Published')
	})

	it('turns the heading into a link when href is set', () => {
		const wrapper = mount(NcCard, { props: { name: 'Design', href: '/teams/design' } })
		const link = wrapper.get('h3 a')
		expect(link.attributes('href')).toBe('/teams/design')
		expect(link.text()).toBe('Design')
	})

	it('turns the heading into a router link when to is set and a router is available', async () => {
		const router = createRouter({
			history: createWebHashHistory(),
			routes: [
				{ path: '/', name: 'root', component: { template: '<div />' } },
				{ path: '/teams/:id', name: 'team', component: { template: '<div />' } },
			],
		})
		const wrapper = mount(NcCard, {
			props: { name: 'Design', to: { name: 'team', params: { id: 'design' } }, href: '/ignored' },
			global: { plugins: [router] },
		})
		await router.isReady()
		expect(wrapper.get('h3 a').attributes('href')).toBe('#/teams/design')
	})

	it('falls back to href when to is set without a router', () => {
		const wrapper = mount(NcCard, { props: { name: 'Design', to: { name: 'team' }, href: '/teams/design' } })
		expect(wrapper.get('h3 a').attributes('href')).toBe('/teams/design')
	})

	it('adds the active class only when active', () => {
		const inactive = mount(NcCard, { props: { name: 'Design' } })
		expect(inactive.classes().some((name) => name.includes('ncCard_active'))).toBe(false)

		const active = mount(NcCard, { props: { name: 'Design', active: true } })
		expect(active.classes().some((name) => name.includes('ncCard_active'))).toBe(true)
	})
})
