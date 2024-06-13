/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, test } from '@jest/globals'
import { shallowMount } from '@vue/test-utils'
import NcAppNavigationCaption from '../../../../src/components/NcAppNavigationCaption/NcAppNavigationCaption.vue'

describe('NcAppNavigationCaption.vue', () => {
	test('attributes are passed to actions', async () => {
		const wrapper = shallowMount(NcAppNavigationCaption, {
			propsData: {
				name: 'The name',
			},
			attrs: {
				forceMenu: 'true',
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

	test('can set id on the caption', async () => {
		const wrapper = shallowMount(NcAppNavigationCaption, {
			propsData: {
				name: 'The name',
				isHeading: true,
				headingId: 'my-heading-id',
			},
		})

		expect(wrapper.find('h2').attributes('id')).toBe('my-heading-id')
	})

	test('component is a list entry by default', async () => {
		const wrapper = shallowMount(NcAppNavigationCaption, {
			propsData: {
				name: 'The name',
			},
		})

		expect(wrapper.element.tagName).toBe('LI')
		expect(wrapper.find('h2').exists()).toBe(false)
		expect(wrapper.find('span').exists()).toBe(true)
	})

	test('component tags are adjusted when used as heading', async () => {
		const wrapper = shallowMount(NcAppNavigationCaption, {
			propsData: {
				name: 'The name',
				isHeading: true,
			},
		})

		expect(wrapper.element.tagName).toBe('DIV')
		expect(wrapper.find('h2').exists()).toBe(true)
	})

	test('can set the heading level', async () => {
		const wrapper = shallowMount(NcAppNavigationCaption, {
			propsData: {
				name: 'The name',
				isHeading: true,
				headingLevel: 3,
			},
		})

		expect(wrapper.contains('h3')).toBe(true)
		expect(wrapper.contains('h2')).toBe(false)
	})

	test('does not set the heading level to h1', async () => {
		const wrapper = shallowMount(NcAppNavigationCaption, {
			propsData: {
				name: 'The name',
				isHeading: true,
				headingLevel: 1,
			},
		})

		expect(wrapper.contains('h2')).toBe(true)
		expect(wrapper.contains('h1')).toBe(false)
	})
})
