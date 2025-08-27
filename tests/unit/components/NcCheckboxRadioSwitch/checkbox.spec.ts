/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount, shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import NcCheckboxRadioSwitch from '../../../../src/components/NcCheckboxRadioSwitch/NcCheckboxRadioSwitch.vue'

describe('NcCheckboxRadioSwitch', () => {
	it('sets text content', () => {
		const wrapper = mount(NcCheckboxRadioSwitch, {
			slots: {
				default: 'Test',
			},
		})

		expect(wrapper.text()).toContain('Test')
	})

	it('forwards aria-invalid and aria-errormessage to input', () => {
		const wrapper = shallowMount(NcCheckboxRadioSwitch, {
			slots: {
				default: 'Test',
			},
			attrs: {
				'aria-invalid': 'true',
				'aria-errormessage': 'id-test',
			},
		})

		const input = wrapper.find('input')
		expect(input.attributes('aria-invalid')).toBe('true')
		expect(input.attributes('aria-errormessage')).toBe('id-test')
	})

	it('sets aria-labelledby attribute correctly', () => {
		const wrapper = mount(NcCheckboxRadioSwitch, {
			props: {
				id: 'test-id',
			},
			slots: {
				default: 'Test',
			},
		})

		const labelById = wrapper.find('input').attributes('aria-labelledby')
		expect(wrapper.findComponent({ name: 'NcCheckboxContent' }).find('#' + labelById).exists()).toBe(true)
	})

	it('does not set id on button content', () => {
		const wrapper = mount(NcCheckboxRadioSwitch, {
			props: {
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

	it('sets aria-describedby attribute correctly', () => {
		const wrapper = mount(NcCheckboxRadioSwitch, {
			props: {
				description: 'My description',
			},
			slots: {
				default: 'Test',
			},
		})

		const describedById = wrapper.find('input').attributes('aria-describedby')
		const descriptionElement = wrapper.findComponent({ name: 'NcCheckboxContent' }).find('#' + describedById)
		expect(descriptionElement.exists()).toBe(true)
		expect(descriptionElement.text()).toContain('My description')
	})
})
