/*
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { createRouter, createWebHashHistory, RouterLink } from 'vue-router'
import NcButton from '../../../../src/components/NcButton/NcButton.vue'

describe('NcButton', () => {
	describe('as a native button', () => {
		it('renders a button element by default', () => {
			const wrapper = shallowMount(NcButton)
			expect(wrapper.element.tagName).toBe('BUTTON')
		})

		it('using the `type` prop works', () => {
			const wrapper = shallowMount(NcButton, { props: { type: 'submit' } })
			const button = wrapper.find('button')
			expect(button.exists()).toBeTruthy()
			expect(button.attributes('type')).toBe('submit')
		})
	})

	describe('as a toggle button', () => {
		it('has aria-pressed="true" when pressed', () => {
			const wrapper = shallowMount(NcButton, { props: { ariaLabel: 'button', pressed: true } })
			const button = wrapper.get('button')
			expect(button.attributes('aria-pressed')).toBe('true')
		})

		it('has aria-pressed="false" when not pressed', () => {
			const wrapper = shallowMount(NcButton, { props: { ariaLabel: 'button', pressed: false } })
			const button = wrapper.get('button')
			expect(button.attributes('aria-pressed')).toBe('false')
		})

		it('has no aria-pressed when pressed is not specified', () => {
			const wrapper = shallowMount(NcButton, { props: { ariaLabel: 'button' } })
			const button = wrapper.get('button')
			expect(button.attributes('aria-pressed')).not.toBeDefined()
		})

		it('has no aria-pressed for a link even if pressed is passed', () => {
			const wrapper = shallowMount(NcButton, { props: { ariaLabel: 'link', pressed: true, href: 'http://example.com' } })
			const link = wrapper.get('a')
			expect(link.attributes('aria-pressed')).not.toBeDefined()
		})

		it('toggles pressed on pressed update', async () => {
			const wrapper = shallowMount(NcButton, { props: { ariaLabel: 'button', pressed: true } })
			await wrapper.setProps({ pressed: false })
			expect(wrapper.get('button').attributes('aria-pressed')).toBe('false')
		})

		it('emits update:pressed on press with a new pressed state', async () => {
			const wrapper = shallowMount(NcButton, { props: { ariaLabel: 'button', pressed: true } })
			await wrapper.get('button').trigger('click')
			expect(wrapper.emitted('update:pressed')?.length).toBe(1)
			expect(wrapper.emitted('update:pressed')![0]).toEqual([false])
		})

		it('does not emit update:pressed on press when pressed is not specified', async () => {
			const wrapper = shallowMount(NcButton, { props: { ariaLabel: 'button' } })
			wrapper.get('button').trigger('click')
			expect(wrapper.emitted('update:pressed')).toBe(undefined)
		})

		it('does not emit update:pressed on press for a link', async () => {
			const wrapper = shallowMount(NcButton, { props: { ariaLabel: 'button', pressed: true, href: '#' } })
			await wrapper.get('a').trigger('click')
			expect(wrapper.emitted('update:pressed')).toBe(undefined)
		})
	})

	describe('as a RouterLink', () => {
		const router = createRouter({
			history: createWebHashHistory(),
			routes: [
				{
					path: '/',
					name: 'root',
					redirect: { name: 'dashboard' },
				},
				{
					path: '/apps/dashboard',
					name: 'dashboard',
					component: {
						template: 'Dashboard App',
					},
				},
				{
					path: '/apps/files',
					name: 'files',
					component: {
						template: 'Files App',
					},
				},
			],
		})

		beforeEach(async () => {
			await router.push({ name: 'dashboard' })
		})

		it('renders RouterLink when "to" route is passed', () => {
			const to = { name: 'files' }
			const wrapper = mount(NcButton, {
				props: {
					to,
				},
				global: {
					plugins: [router],
				},
			})
			const routerLink = wrapper.findComponent(RouterLink)
			expect(routerLink.exists()).toBeTruthy()
			expect(routerLink.props('to')).toEqual(to)
			expect(wrapper.element.tagName).toBe('A')
			expect(wrapper.attributes('href')).toBe('#/apps/files')
		})

		it('renders RouterLink when "to" route is passed even if a "href" is also passed', () => {
			const to = { name: 'files' }
			const wrapper = mount(NcButton, {
				props: {
					to,
					href: '/extra-href',
				},
				global: {
					plugins: [router],
				},
			})
			const routerLink = wrapper.findComponent(RouterLink)
			expect(routerLink.exists()).toBeTruthy()
			expect(routerLink.props('to')).toEqual(to)
			expect(wrapper.element.tagName).toBe('A')
			expect(wrapper.attributes('href')).toBe('#/apps/files')
		})

		it('fallbacks to a button when route is provided but there is no router', () => {
			const wrapper = mount(NcButton, { props: { to: { name: 'files' } } })
			expect(wrapper.element.tagName).toBe('BUTTON')
			expect(wrapper.attributes('href')).toBeUndefined()
			expect(wrapper.attributes('to')).toBeUndefined()
		})
	})

	describe('as a native link', () => {
		it('render a native link when href is passed', () => {
			const wrapper = shallowMount(NcButton, { props: { href: '/settings/user' } })
			expect(wrapper.element.tagName).toBe('A')
			expect(wrapper.attributes('href')).toBe('/settings/user')
			expect(wrapper.attributes('to')).toBeUndefined()
		})

		it('render a native link with rel="nofollow noreferrer noopener"', () => {
			const wrapper = shallowMount(NcButton, { props: { href: '/settings/user' } })
			expect(wrapper.attributes('rel')).toBe('nofollow noreferrer noopener')
		})
	})
})
