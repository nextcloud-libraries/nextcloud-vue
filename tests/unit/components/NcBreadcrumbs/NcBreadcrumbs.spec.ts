/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import { createMemoryHistory, createRouter, createWebHashHistory } from 'vue-router'
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

		it('links every crumb, the last one too', () => {
			const wrapper = mount(NcBreadcrumbs, { props: { crumbs } })
			expect(wrapper.findAll('a').map((link) => link.attributes('href'))).toEqual(['/home', '/home/vault', '/home/vault/production'])
		})

		it('marks the last crumb as the current location, as a link', () => {
			const wrapper = mount(NcBreadcrumbs, { props: { crumbs } })
			const current = wrapper.findAll('[aria-current="page"]')
			expect(current).toHaveLength(1)
			expect(current[0].element.tagName).toBe('A')
			expect(current[0].text()).toBe('Production')
		})

		it('keeps the focus on a crumb that becomes the current location', async () => {
			const wrapper = mount(NcBreadcrumbs, {
				attachTo: document.body,
				props: {
					crumbs,
					onCrumbClick: (_crumb: unknown, index: number, event: MouseEvent) => {
						event.preventDefault()
						wrapper.setProps({ crumbs: crumbs.slice(0, index + 1) })
					},
				},
			})
			const vault = wrapper.findAll('a')[1]
			;(vault.element as HTMLElement).focus()
			await vault.trigger('click')
			await nextTick()
			expect(document.activeElement).toBe(vault.element)
			expect(document.activeElement?.getAttribute('aria-current')).toBe('page')
			wrapper.unmount()
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
			// The listener keeps jsdom from following the link
			const wrapper = mount(NcBreadcrumbs, { props: { crumbs, onCrumbClick: (_crumb: unknown, _index: number, event: MouseEvent) => event.preventDefault() } })
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

		it('lets a crumbClick listener keep a router link from being followed', async () => {
			const router = createRouter({
				history: createMemoryHistory(),
				routes: [
					{ path: '/', component: { template: '<div />' } },
					{ path: '/a', component: { template: '<div />' } },
				],
			})
			await router.push('/')
			const wrapper = mount(NcBreadcrumbs, {
				props: {
					crumbs: [{ name: 'A', to: '/a' }, { name: 'Here', to: '/' }],
					onCrumbClick: (_crumb: unknown, _index: number, event: MouseEvent) => event.preventDefault(),
				},
				global: { plugins: [router] },
			})
			await wrapper.findAll('a')[0].trigger('click')
			await flushPromises()
			expect(router.currentRoute.value.path).toBe('/')
		})

		it('emits dropped with the link of the crumb something is dropped on', async () => {
			const wrapper = mount(NcBreadcrumbs, { props: { crumbs } })
			await wrapper.findAll('li.vue-crumb')[1].trigger('drop')
			expect(wrapper.emitted('dropped')?.[0][1]).toBe('/home/vault')
		})

		it('does not accept a drop on a crumb with disableDrop', async () => {
			const wrapper = mount(NcBreadcrumbs, { props: { crumbs: [crumbs[0], { ...crumbs[1], disableDrop: true }, crumbs[2]] } })
			expect(wrapper.findAllComponents(NcBreadcrumb)[1].props('disableDrop')).toBe(true)
			await wrapper.findAll('li.vue-crumb')[1].trigger('drop')
			expect(wrapper.emitted('dropped')).toBeUndefined()
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
