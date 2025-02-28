/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount, shallowMount } from '@vue/test-utils'
import NcCheckboxRadioSwitch from '../../../../src/components/NcCheckboxRadioSwitch/NcCheckboxRadioSwitch.vue'

describe('NcCheckboxRadioSwitch', () => {
	it('sets text content', () => {
		const wrapper = shallowMount(NcCheckboxRadioSwitch, {
			slots: {
				default: 'Test',
			},
		})

		expect(wrapper.text()).toContain('Test')
	})

	it('forwards all but data- attributes to the input', () => {
		const wrapper = shallowMount(NcCheckboxRadioSwitch, {
			slots: {
				default: 'Test',
			},
			attrs: {
				'aria-invalid': 'true',
				'aria-errormessage': 'id-test',
				'data-test': 'checkbox-test-data-attr',
				title: 'Test title',
			},
		})

		const input = wrapper.find('input')
		expect(input.attributes('aria-invalid')).toBe('true')
		expect(input.attributes('aria-errormessage')).toBe('id-test')
		expect(input.attributes('title')).toBe('Test title')
		expect(input.attributes('data-test')).not.toBe('checkbox-test-data-attr')
		expect(wrapper.attributes('data-test')).toBe('checkbox-test-data-attr')
		expect(wrapper.attributes('title')).not.toBe('Test title')
	})

	it('sets aria-labelledby attribute correctly', () => {
		const wrapper = mount(NcCheckboxRadioSwitch, {
			propsData: {
				id: 'test-id',
			},
			slots: {
				default: 'Test',
			},
		})

		expect(wrapper.find('input').attributes('aria-labelledby')).toBe('test-id-label')
		expect(wrapper.findComponent({ name: 'NcCheckboxContent' }).attributes('id')).toBe('test-id-label')
	})

	it('does not set id on button content', () => {
		const wrapper = mount(NcCheckboxRadioSwitch, {
			propsData: {
				id: 'test-id',
				type: 'button',
			},
			slots: {
				default: 'Test',
			},
		})

		expect(wrapper.find('input').exists()).toBe(false)
		expect(wrapper.findComponent({ name: 'NcCheckboxContent' }).attributes('id')).toBe(undefined)
	})
})
