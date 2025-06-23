/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import NcDateTimePickerNative from '../../../../src/components/NcDateTimePickerNative/NcDateTimePickerNative.vue'

describe('NcDateTimePickerNative.vue', () => {
	it('sets id from props', () => {
		const wrapper = mount(NcDateTimePickerNative, {
			props: {
				id: 'test',
			},
		})

		expect(wrapper.element.getAttribute('id')).toBe(null)
		expect(wrapper.find('input').attributes('id')).toBe('test')
	})

	it('sets id even if undefined', () => {
		const wrapper = mount(NcDateTimePickerNative)

		expect(wrapper.element.getAttribute('id')).toBe(null)

		const inputId = wrapper.find('input').attributes('id')
		expect(inputId).toMatch(/nc-vue-\d+/)
		expect(wrapper.find('label').attributes('for')).toBe(inputId)
	})

	it('sets class and inputClass', () => {
		const wrapper = mount(NcDateTimePickerNative, {
			props: {
				inputClass: 'input-class',
				class: 'class'
			}
		})

		expect(wrapper.classes('class')).toBe(true)
		expect(wrapper.find('input').classes('input-class')).toBe(true)
	})

	it('sets label', () => {
		const wrapper = mount(NcDateTimePickerNative, {
			props: {
				label: 'the label',
			}
		})

		expect(wrapper.find('label').text()).toBe('the label')
	})

	it('sets the default label', () => {
		const wrapper = mount(NcDateTimePickerNative)

		expect(wrapper.find('label').text()).toBe('Please choose a date')
	})

	it('allows a hidden label', async () => {
		const wrapper = mount(NcDateTimePickerNative, {
			props: {
				label: 'the label',
			}
		})

		expect(wrapper.find('label').text()).toBe('the label')
		expect(wrapper.find('label').classes('hidden-visually')).toBe(false)

		await wrapper.setProps({ hideLabel: true, label: 'the label' })
		expect(wrapper.find('label').text()).toBe('the label')
		expect(wrapper.find('label').classes('hidden-visually')).toBe(true)
	})
})
