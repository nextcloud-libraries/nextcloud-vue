/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { shallowMount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import NcButton from '../../../../src/components/NcButton/NcButton.vue'

describe('NcButton as router link', () => {
	test('It is rendered as router link when router is provided', () => {
		const router = getRouter()

		const wrapper = shallowMount(NcButton, {
			props: {
				to: { name: 'test' },
			},
			global: {
				plugins: [router],
			},
		})

		const link = wrapper.find('a')
		expect(link.exists()).toBe(true)
		expect(link.attributes('href')).toBe('/test-url')
	})

	test('It is rendered as router link even if a href is passed', () => {
		const router = getRouter()

		const wrapper = shallowMount(NcButton, {
			props: {
				href: '/some-other',
				to: { name: 'test' },
			},
			global: {
				plugins: [router],
			},
		})

		const link = wrapper.find('a')
		expect(link.exists()).toBe(true)
		expect(link.attributes('href')).toBe('/test-url')
	})

	test('If no router is registered a router location will just be a plain button', () => {
		const wrapper = shallowMount(NcButton, {
			props: {
				to: { name: 'test' },
			},
		})

		const link = wrapper.find('a')
		const button = wrapper.find('button')
		expect(link.exists()).toBe(false)
		expect(button.exists()).toBe(true)
		expect(button.attributes('href')).toBeUndefined()
		expect(button.attributes('to')).toBeUndefined()
	})

	test('If no router is registered the router location is ignored and the href is used', () => {
		const wrapper = shallowMount(NcButton, {
			props: {
				href: '/some-other',
				to: { name: 'test' },
			},
		})

		const link = wrapper.find('a')
		expect(link.exists()).toBe(true)
		expect(link.attributes('href')).toBe('/some-other')
	})

	test('If no router is registered a plain link still works', () => {
		const wrapper = shallowMount(NcButton, {
			props: {
				href: '/some-other',
			},
		})

		const link = wrapper.find('a')
		expect(link.exists()).toBe(true)
		expect(link.attributes('href')).toBe('/some-other')
	})
})

/**
 * Get a very simple router for testing
 */
function getRouter() {
	return createRouter({
		history: createWebHistory(),
		routes: [{
			name: 'root',
			path: '/',
			component: {
				template: 'Root',
			},
		},
		{
			name: 'test',
			path: '/test-url',
			component: {
				template: 'Hello world!',
			},
		}],
	})
}
