/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { shallowMount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import NcAppNavigationCaption from '../../../../src/components/NcAppNavigationCaption/NcAppNavigationCaption.vue'

describe('NcAppNavigationCaption.vue', () => {
	test('NcActions attributes are passed to actions', async () => {
		const wrapper = shallowMount(NcAppNavigationCaption, {
			props: {
				name: 'The name',
				forceMenu: true,
			},
			slots: {
				actions: [
					'<NcActionButton>Button 1</NcActionButton>',
					'<NcActionButton>Button 2</NcActionButton>',
				],
			},
		})

		expect(wrapper.findComponent({ name: 'NcActions' }).attributes('forcemenu')).toBe('true')
	})

	test('Other attributes are kept on the caption', async () => {
		const wrapper = shallowMount(NcAppNavigationCaption, {
			props: {
				name: 'The name',
			},
			attrs: {
				'data-test': 'test',
			},
			slots: {
				actions: [
					'<NcActionButton>Button 1</NcActionButton>',
					'<NcActionButton>Button 2</NcActionButton>',
				],
			},
		})

		expect(wrapper.attributes('data-test')).toBe('test')
	})

	test('can set id on the caption', async () => {
		const wrapper = shallowMount(NcAppNavigationCaption, {
			props: {
				name: 'The name',
				isHeading: true,
				headingId: 'my-heading-id',
			},
		})

		expect(wrapper.find('h2').attributes('id')).toBe('my-heading-id')
	})

	test('component is a list entry by default', async () => {
		const wrapper = shallowMount(NcAppNavigationCaption, {
			props: {
				name: 'The name',
			},
		})

		expect(wrapper.element.tagName).toBe('LI')
		expect(wrapper.find('h2').exists()).toBe(false)
		expect(wrapper.find('span').exists()).toBe(true)
	})

	test('component tags are adjusted when used as heading', async () => {
		const wrapper = shallowMount(NcAppNavigationCaption, {
			props: {
				name: 'The name',
				isHeading: true,
			},
		})

		expect(wrapper.element.tagName).toBe('DIV')
		expect(wrapper.find('h2').exists()).toBe(true)
	})
})
