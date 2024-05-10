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

	test('can set the heading level', async () => {
		const wrapper = shallowMount(NcAppNavigationCaption, {
			props: {
				name: 'The name',
				isHeading: true,
				headingLevel: 3,
			},
		})

		expect(wrapper.find('h3').exists()).toBe(true)
		expect(wrapper.find('h2').exists()).toBe(false)
	})

	test('does not set the heading level to h1', async () => {
		const wrapper = shallowMount(NcAppNavigationCaption, {
			props: {
				name: 'The name',
				isHeading: true,
				headingLevel: 1,
			},
		})

		expect(wrapper.find('h2').exists()).toBe(true)
		expect(wrapper.find('h1').exists()).toBe(false)
	})
})
