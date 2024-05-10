import { describe, expect, test } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import NcAppNavigationCaption from '../../../../src/components/NcAppNavigationCaption/NcAppNavigationCaption.vue'

describe('NcAppNavigationCaption.vue', () => {
	test('attributes are passed to actions', async () => {
		const wrapper = shallowMount(NcAppNavigationCaption, {
			props: {
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
