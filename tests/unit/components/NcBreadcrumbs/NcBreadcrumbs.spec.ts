/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import NcBreadcrumb from '../../../../src/components/NcBreadcrumb/NcBreadcrumb.vue'
import NcBreadcrumbs from '../../../../src/components/NcBreadcrumbs/NcBreadcrumbs.vue'

const crumbs = [
	{ name: 'Home', href: '/home' },
	{ name: 'Team vault', href: '/home/vault', title: 'The team vault', iconPath: 'M0 0h24v24H0z' },
	{ name: 'Production', href: '/home/vault/production' },
]

describe('NcBreadcrumbs', () => {
	describe('with crumbs as data', () => {
		it('renders a breadcrumb per crumb, in order', () => {
			const wrapper = mount(NcBreadcrumbs, { props: { crumbs, ariaLabel: 'Trail' } })
			expect(wrapper.get('nav').attributes('aria-label')).toBe('Trail')
			const items = wrapper.findAllComponents(NcBreadcrumb)
			expect(items.map((item) => item.props('name'))).toEqual(['Home', 'Team vault', 'Production'])
		})

		it('links every crumb but the last', () => {
			const wrapper = mount(NcBreadcrumbs, { props: { crumbs } })
			const items = wrapper.findAllComponents(NcBreadcrumb)
			expect(items[0].props('href')).toBe('/home')
			expect(items[1].props('href')).toBe('/home/vault')
			expect(items[2].props('href')).toBeUndefined()
			expect(wrapper.findAll('a').map((link) => link.attributes('href'))).toEqual(['/home', '/home/vault'])
		})

		it('marks the last crumb as the current location', () => {
			const wrapper = mount(NcBreadcrumbs, { props: { crumbs } })
			const current = wrapper.findAll('[aria-current="page"]')
			expect(current).toHaveLength(1)
			expect(current[0].text()).toBe('Production')
		})

		it('passes the title and the icon of a crumb', () => {
			const wrapper = mount(NcBreadcrumbs, { props: { crumbs } })
			const vault = wrapper.findAllComponents(NcBreadcrumb)[1]
			expect(vault.props('title')).toBe('The team vault')
			expect(vault.find('svg path').attributes('d')).toBe('M0 0h24v24H0z')
		})

		it('links with vue-router when a crumb has to', async () => {
			const router = createRouter({
				history: createWebHashHistory(),
				routes: [
					{ path: '/', name: 'root', component: { template: '<div />' } },
					{ path: '/folders/:id', name: 'folder', component: { template: '<div />' } },
				],
			})
			const wrapper = mount(NcBreadcrumbs, {
				props: { crumbs: [{ name: 'Home', to: { name: 'folder', params: { id: '1' } } }, { name: 'Here' }] },
				global: { plugins: [router] },
			})
			await router.isReady()
			expect(wrapper.findAll('a').map((link) => link.attributes('href'))).toEqual(['#/folders/1'])
		})

		it('emits crumbClick with the crumb, its index and the event', async () => {
			const wrapper = mount(NcBreadcrumbs, { props: { crumbs } })
			await wrapper.findAll('a')[1].trigger('click')
			const [crumb, index, event] = wrapper.emitted('crumbClick')![0] as [unknown, number, MouseEvent]
			expect(crumb).toEqual(crumbs[1])
			expect(index).toBe(1)
			expect(event).toBeInstanceOf(MouseEvent)
		})

		it('lets a crumbClick listener keep the link from being followed', async () => {
			let prevented = false
			const wrapper = mount(NcBreadcrumbs, {
				props: {
					crumbs,
					onCrumbClick: (_crumb: unknown, _index: number, event: MouseEvent) => {
						event.preventDefault()
						prevented = event.defaultPrevented
					},
				},
			})
			await wrapper.findAll('a')[0].trigger('click')
			expect(prevented).toBe(true)
		})

		it('ignores the slot when crumbs are given', () => {
			const wrapper = mount(NcBreadcrumbs, {
				props: { crumbs },
				slots: { default: () => h(NcBreadcrumb, { name: 'From the slot' }) },
			})
			const names = wrapper.findAllComponents(NcBreadcrumb).map((item) => item.props('name'))
			expect(names).not.toContain('From the slot')
		})
	})

	it('still renders the breadcrumbs of the slot without crumbs', () => {
		const wrapper = mount(NcBreadcrumbs, {
			slots: { default: () => [h(NcBreadcrumb, { name: 'Home', href: '/' }), h(NcBreadcrumb, { name: 'Folder' })] },
		})
		expect(wrapper.findAllComponents(NcBreadcrumb).map((item) => item.props('name'))).toEqual(['Home', 'Folder'])
	})
})
