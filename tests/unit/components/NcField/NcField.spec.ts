/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import NcInputField from '../../../../src/components/NcInputField/index.ts'
import NcPasswordField from '../../../../src/components/NcPasswordField/index.ts'
import NcTextField from '../../../../src/components/NcTextField/index.ts'

// shared behavior between all components
describe.each`
name                 | component
${'NcInputField'}    | ${NcInputField}
${'NcPasswordField'} | ${NcPasswordField}
${'NcTextField'}     | ${NcTextField}
`('Nc*Field - shared tests for $name', ({ component }) => {
	beforeEach(() => {
		vi.resetAllMocks()
	})

	it('should emit changed text', async () => {
		const wrapper = mount(component, {
			props: {
				label: 'label',
				modelValue: '',
				type: 'text',
			},
		})

		await wrapper.get('input').setValue('text')

		expect(wrapper.emitted('update:modelValue')).toEqual([['text']])
	})

	it('should have the placeholder set', async () => {
		const wrapper = mount(component, {
			props: {
				modelValue: '',
				label: 'The label',
				placeholder: 'The placeholder',
			},
		})

		expect(wrapper.find('input').attributes('placeholder')).toBe('The placeholder')
	})

	it('should NOT have the placeholder set to the label on Nextcloud 32', async () => {
		const wrapper = mount(component, {
			props: {
				modelValue: '',
				label: 'The label',
				placeholder: '',
			},
		})

		expect(wrapper.find('input').attributes('placeholder')).toBeFalsy()
	})

	it('should have the label set', () => {
		const wrapper = mount(component, {
			props: {
				modelValue: '',
				label: 'The label',
			},
		})

		expect(wrapper.find('label').text()).toBe('The label')
	})

	it('should have the id set', () => {
		const wrapper = mount(component, {
			props: {
				labelOutside: true,
				modelValue: '',
			},
			attrs: {
				id: 'some-id',
			},
		})

		expect(wrapper.find('input').attributes('id')).toBe('some-id')
	})

	it('should have the helper text set', () => {
		const wrapper = mount(component, {
			props: {
				helperText: 'Some helper text',
				modelValue: '',
			},
		})

		const id = wrapper.find('input').attributes('aria-describedby')
		expect(wrapper.find(`#${id}`).exists()).toBe(true)
		expect(wrapper.find(`#${id}`).text()).toBe('Some helper text')
	})

	it('should have the class set', () => {
		const wrapper = mount(component, {
			props: {
				class: 'some-class',
				modelValue: '',
			},
		})

		expect(wrapper.classes('some-class')).toBe(true)
	})

	it('should have the input class set', () => {
		const wrapper = mount(component, {
			props: {
				inputClass: 'some-class',
				modelValue: '',
			},
		})

		expect(wrapper.find('input').classes('some-class')).toBe(true)
	})

	it('should have the disabled attribute', async () => {
		const wrapper = mount(component, {
			props: {
				modelValue: '',
			},
		})

		expect(wrapper.find('input').attributes('disabled')).toBe(undefined)

		await wrapper.setProps({
			disabled: true,
		})
		expect(wrapper.find('input').attributes('disabled')).toBe('')
	})
})
