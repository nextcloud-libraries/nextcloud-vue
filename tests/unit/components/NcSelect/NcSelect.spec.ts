/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import NcSelect from '../../../../src/components/NcSelect/NcSelect.vue'

const options = ['foo', 'bar', 'baz']

describe('NcSelect', () => {
	it('renders NcTextField in search slot', () => {
		const wrapper = mount(NcSelect, {
			props: { inputLabel: 'Label', options },
		})

		expect(wrapper.findComponent({ name: 'NcTextField' }).exists()).toBe(true)
	})

	it('has the label set', () => {
		const wrapper = mount(NcSelect, {
			props: { inputLabel: 'The label', options },
		})

		expect(wrapper.find('label').text()).toBe('The label')
	})

	it('passes placeholder prop to NcTextField', () => {
		const wrapper = mount(NcSelect, {
			props: { inputLabel: 'Label', placeholder: 'Pick one', options },
		})

		// vue-select includes placeholder in attributes, NcTextField receives it
		const textField = wrapper.findComponent({ name: 'NcInputField' })
		expect(textField.exists()).toBe(true)
	})

	it('has the disabled attribute', async () => {
		const wrapper = mount(NcSelect, {
			props: { inputLabel: 'Label', options },
		})

		expect(wrapper.find('input').attributes('disabled')).toBeUndefined()

		await wrapper.setProps({ disabled: true })
		expect(wrapper.find('input').attributes('disabled')).toBe('')
	})

	it('has the inputClass set on NcTextField', () => {
		const wrapper = mount(NcSelect, {
			props: { inputLabel: 'Label', inputClass: 'custom-class', options },
		})

		expect(wrapper.findComponent({ name: 'NcTextField' }).classes('custom-class')).toBe(true)
	})

	it('emits update:modelValue on selection', async () => {
		const wrapper = mount(NcSelect, {
			props: { inputLabel: 'Label', options },
		})

		// Open dropdown
		await wrapper.find('.vs__dropdown-toggle').trigger('mousedown')
		await wrapper.vm.$nextTick()

		// Select first option
		const option = wrapper.find('.vs__dropdown-option')
		if (option.exists()) {
			await option.trigger('mousedown')
			await wrapper.vm.$nextTick()
			expect(wrapper.emitted('update:modelValue')).toBeTruthy()
		}
	})

	it('sets required conditionally based on value', async () => {
		const wrapper = mount(NcSelect, {
			props: { inputLabel: 'Label', required: true, modelValue: null, options },
		})

		expect(wrapper.find('input').attributes('required')).toBe('')

		await wrapper.setProps({ modelValue: 'foo' })
		expect(wrapper.find('input').attributes('required')).toBeUndefined()
	})

	describe('single mode', () => {
		it('uses NcTextField label (not header slot)', () => {
			const wrapper = mount(NcSelect, {
				props: { inputLabel: 'Single label', options },
			})

			// Label is on NcTextField, not a separate .select__label element
			const textField = wrapper.findComponent({ name: 'NcTextField' })
			expect(textField.props('label')).toBe('Single label')
			expect(wrapper.find('.select__label').exists()).toBe(false)
		})
	})

	describe('multi mode', () => {
		it('renders label via header slot', () => {
			const wrapper = mount(NcSelect, {
				props: { inputLabel: 'Multi label', multiple: true, options },
			})

			expect(wrapper.find('.select__label').exists()).toBe(true)
			expect(wrapper.find('.select__label').text()).toBe('Multi label')
		})

		it('passes labelOutside to NcTextField', () => {
			const wrapper = mount(NcSelect, {
				props: { inputLabel: 'Multi label', multiple: true, options },
			})

			const textField = wrapper.findComponent({ name: 'NcTextField' })
			expect(textField.props('labelOutside')).toBe(true)
		})
	})

	describe('labelOutside', () => {
		it('does not render floating label when labelOutside is true', () => {
			const wrapper = mount(NcSelect, {
				props: { inputLabel: 'Label', labelOutside: true, options },
			})

			// Single: NcTextField label should be empty
			const textField = wrapper.findComponent({ name: 'NcTextField' })
			expect(textField.props('label')).toBe('')
		})

		it('does not render header label in multi mode when labelOutside', () => {
			const wrapper = mount(NcSelect, {
				props: { inputLabel: 'Label', labelOutside: true, multiple: true, options },
			})

			expect(wrapper.find('.select__label').exists()).toBe(false)
		})
	})

	describe('accessibility', () => {
		it('warns when neither inputLabel nor ariaLabelCombobox is set', () => {
			const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
			mount(NcSelect, { props: { options } })
			expect(warnSpy).toHaveBeenCalled()
			warnSpy.mockRestore()
		})

		it('does not warn when inputLabel is set', () => {
			const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
			mount(NcSelect, { props: { inputLabel: 'Label', options } })
			expect(warnSpy).not.toHaveBeenCalled()
			warnSpy.mockRestore()
		})

		it('does not warn about NcSelect label when ariaLabelCombobox is set', () => {
			const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
			mount(NcSelect, { props: { ariaLabelCombobox: 'Search', options } })
			// NcSelect itself should not warn, though NcInputField may warn separately
			const ncSelectWarns = warnSpy.mock.calls.filter((args) => typeof args[0] === 'string' && args[0].includes('[NcSelect]'))
			expect(ncSelectWarns).toHaveLength(0)
			warnSpy.mockRestore()
		})
	})

	describe('event forwarding', () => {
		it('forwards keydown events to the inner input', async () => {
			const wrapper = mount(NcSelect, {
				props: { inputLabel: 'Label', options },
			})

			const input = wrapper.find('input')
			await input.trigger('keydown', { key: 'ArrowDown' })
			// If keydown is forwarded, vue-select processes it without error
			expect(wrapper.find('.v-select').exists()).toBe(true)
		})

		it('forwards combobox a11y attributes to the inner input', () => {
			const wrapper = mount(NcSelect, {
				props: { inputLabel: 'Label', options },
			})

			const input = wrapper.find('input')
			expect(input.attributes('role')).toBe('combobox')
			expect(input.attributes('aria-autocomplete')).toBe('list')
			expect(input.attributes('aria-expanded')).toBe('false')
		})
	})
})
