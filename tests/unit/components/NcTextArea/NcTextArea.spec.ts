/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import NcTextArea from '../../../../src/components/NcTextArea/NcTextArea.vue'

describe('NcTextArea', () => {
	it('should emit changed text', async () => {
		const wrapper = mount(NcTextArea, {
			props: {
				label: 'label',
				modelValue: '',
			},
		})

		await wrapper.get('textarea').setValue('text')

		expect(wrapper.emitted('update:modelValue')).toEqual([['text']])
	})

	it('should have the placeholder set', async () => {
		const wrapper = mount(NcTextArea, {
			props: {
				modelValue: '',
				label: 'The label',
				placeholder: 'The placeholder',
			},
		})

		expect(wrapper.find('textarea').attributes('placeholder')).toBe('The placeholder')

		await wrapper.setProps({
			label: 'The label',
			placeholder: '',
		})
		expect(wrapper.find('textarea').attributes('placeholder')).toBe('The label')
	})

	it('should have the label set', () => {
		const wrapper = mount(NcTextArea, {
			props: {
				modelValue: '',
				label: 'The label',
			},
		})

		expect(wrapper.find('label').text()).toBe('The label')
	})

	it('should have the id set', () => {
		const wrapper = mount(NcTextArea, {
			props: {
				labelOutside: true,
				modelValue: '',
			},
			attrs: {
				id: 'some-id',
			},
		})

		expect(wrapper.find('textarea').attributes('id')).toBe('some-id')
	})

	it('should have the helper text set', () => {
		const wrapper = mount(NcTextArea, {
			props: {
				helperText: 'Some helper text',
				modelValue: '',
			},
		})

		const id = wrapper.find('textarea').attributes('aria-describedby')
		expect(wrapper.find(`#${id}`).exists()).toBe(true)
		expect(wrapper.find(`#${id}`).text()).toBe('Some helper text')
	})

	it('should have the class set', () => {
		const wrapper = mount(NcTextArea, {
			props: {
				class: 'some-class',
				modelValue: '',
			},
		})

		expect(wrapper.classes('some-class')).toBe(true)
	})

	it('should have the input class set', () => {
		const wrapper = mount(NcTextArea, {
			props: {
				inputClass: 'some-class',
				modelValue: '',
			},
		})

		expect(wrapper.find('textarea').classes('some-class')).toBe(true)
	})

	it('should have the disabled attribute', async () => {
		const wrapper = mount(NcTextArea, {
			props: {
				modelValue: '',
			},
		})

		expect(wrapper.find('textarea').attributes('disabled')).toBe(undefined)

		await wrapper.setProps({
			disabled: true,
		})
		expect(wrapper.find('textarea').attributes('disabled')).toBe('')
	})
})
