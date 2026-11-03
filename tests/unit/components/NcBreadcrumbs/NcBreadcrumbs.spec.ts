/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Fragment, h, nextTick } from 'vue'
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

	it('renders the breadcrumbs of a fragment in the slot, as from a v-for', () => {
		const wrapper = mount(NcBreadcrumbs, {
			slots: { default: () => [h(Fragment, [h(NcBreadcrumb, { name: 'Home', href: '/' }), h('span'), h(NcBreadcrumb, { name: 'Folder' })])] },
		})
		expect(wrapper.findAllComponents(NcBreadcrumb).map((item) => item.props('name'))).toEqual(['Home', 'Folder'])
	})

	it('renders nothing without breadcrumbs', () => {
		const wrapper = mount(NcBreadcrumbs)
		expect(wrapper.find('nav').exists()).toBe(false)
	})

	it('renders the actions slot next to the breadcrumbs', () => {
		const wrapper = mount(NcBreadcrumbs, {
			props: { crumbs },
			slots: { actions: () => h('button', { class: 'new' }, 'New') },
		})
		expect(wrapper.get('.breadcrumb__actions .new').text()).toBe('New')
	})

	describe('when the breadcrumbs do not fit', () => {
		const manyCrumbs = [
			{ name: 'Home', href: '/home' },
			{ name: 'Projects', href: '/home/projects' },
			{ name: 'Archive' },
			{ name: 'Team vault', to: '/home/projects/archive/vault' },
			{ name: 'Production', href: '/home/projects/archive/vault/production' },
		]

		/**
		 * Mount the breadcrumbs in a container of 300px with crumbs of 100px each, so three have to be hidden.
		 */
		async function mountNarrow() {
			vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function(this: HTMLElement) {
				return this.classList.contains('breadcrumb') ? 300 : 100
			})
			const router = createRouter({
				history: createMemoryHistory(),
				routes: [{ path: '/:path(.*)*', component: { template: '<div />' } }],
			})
			const wrapper = mount(NcBreadcrumbs, {
				props: { crumbs: manyCrumbs },
				global: { plugins: [router] },
				attachTo: document.body,
			})
			await router.isReady()
			await flushPromises()
			return wrapper
		}

		afterEach(() => {
			vi.restoreAllMocks()
			document.body.innerHTML = ''
		})

		it('hides the middle breadcrumbs and keeps the first and the last', async () => {
			const wrapper = await mountNarrow()
			const hidden = wrapper.findAll('nav > ul > li.vue-crumb--hidden')
			expect(hidden).toHaveLength(3)
			expect(wrapper.classes()).toContain('breadcrumb--collapsed')
			const visible = wrapper.findAllComponents(NcBreadcrumb).filter((crumb) => !crumb.classes('vue-crumb--hidden') && !crumb.classes('dropdown'))
			expect(visible.map((crumb) => crumb.props('name'))).toEqual(['Home', 'Production'])
			wrapper.unmount()
		})

		it('shows the hidden breadcrumbs in a menu, as a link, a button or a router link', async () => {
			const wrapper = await mountNarrow()
			await wrapper.get('nav > ul > li.dropdown button').trigger('click')
			await flushPromises()
			const items = [...document.querySelectorAll('.vue-crumb.action')]
			expect(items.map((item) => item.textContent?.trim())).toEqual(['Projects', 'Archive', 'Team vault'])
			expect(items[0].querySelector('a')?.getAttribute('href')).toBe('/home/projects')
			expect(items[1].querySelector('button')).not.toBeNull()
			expect(items[2].querySelector('a')?.getAttribute('href')).toBe('/home/projects/archive/vault')
			wrapper.unmount()
		})

		it('accepts a drop on a breadcrumb in the menu and closes the menu', async () => {
			const wrapper = await mountNarrow()
			await wrapper.get('nav > ul > li.dropdown button').trigger('click')
			await flushPromises()
			const projects = document.querySelector('.vue-crumb.action')!

			projects.dispatchEvent(new Event('dragenter', { bubbles: true }))
			expect(projects.classList).toContain('vue-crumb--hovered')
			projects.dispatchEvent(new Event('dragleave', { bubbles: true }))
			expect(projects.classList).not.toContain('vue-crumb--hovered')

			projects.dispatchEvent(new Event('dragover', { bubbles: true, cancelable: true }))
			projects.dispatchEvent(new Event('drop', { bubbles: true, cancelable: true }))
			await flushPromises()
			expect(wrapper.emitted('dropped')?.[0][1]).toBe('/home/projects')
			const menu = wrapper.findAllComponents(NcBreadcrumb).find((crumb) => crumb.classes('dropdown'))!
			expect(menu.props('open')).toBe(false)
			wrapper.unmount()
		})
	})
})
