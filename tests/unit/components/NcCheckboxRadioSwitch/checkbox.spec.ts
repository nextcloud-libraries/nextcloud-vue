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

	it('emits correct value on keyboard toggle for boolean checkbox', async () => {
		const wrapper = mount(NcCheckboxRadioSwitch, {
			props: {
				modelValue: false,
			},
			slots: {
				default: 'Toggle me',
			},
		})

		await wrapper.find('input').trigger('change')
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
	})

	it('emits correct value on keyboard toggle for checkbox group', async () => {
		const wrapper = mount(NcCheckboxRadioSwitch, {
			props: {
				modelValue: ['a'],
				value: 'b',
				name: 'test-group',
			},
			slots: {
				default: 'Option B',
			},
			attachTo: document.body,
		})

		// Simulate keyboard spacebar: browser toggles input.checked BEFORE firing change
		const input = wrapper.find('input')
		const inputEl = input.element
		inputEl.checked = true // Browser would do this before firing change
		await input.trigger('change')

		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['a', 'b']])

		wrapper.unmount()
	})

	it('emits correct value on keyboard un-toggle for checkbox group', async () => {
		const wrapper = mount(NcCheckboxRadioSwitch, {
			props: {
				modelValue: ['a', 'b'],
				value: 'b',
				name: 'test-group',
			},
			slots: {
				default: 'Option B',
			},
			attachTo: document.body,
		})

		// Simulate keyboard spacebar unchecking: browser sets checked=false before change
		const input = wrapper.find('input')
		const inputEl = input.element
		inputEl.checked = false
		await input.trigger('change')

		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['a']])

		wrapper.unmount()
	})
})
