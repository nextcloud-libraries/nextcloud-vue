/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from '@jest/globals'
import { shallowMount } from '@vue/test-utils'
import NcInputField from '../../../../src/components/NcInputField/index.js'

describe('NcInputField', () => {
	it('should emit text when type is text', async () => {
		const wrapper = shallowMount(NcInputField, {
			propsData: {
				label: 'label',
				value: '',
				type: 'text',
			},
		})

		await wrapper.get('input').setValue('text')

		expect(wrapper.emitted('update:value')).toEqual([['text']])
	})

	it('should emit text when type is number but value is text', () => {
		const wrapper = shallowMount(NcInputField, {
			propsData: {
				value: '1',
				type: 'number',
			},
		})

		const input = wrapper.find('input').element as HTMLInputElement
		input.value = '2'
		input.dispatchEvent(new InputEvent('input'))

		expect(wrapper.emitted('update:value')).toEqual([['2']])
	})

	it('should emit a number when type is number and value is number', () => {
		const wrapper = shallowMount(NcInputField, {
			propsData: {
				value: 1,
				type: 'number',
			},
		})

		const input = wrapper.find('input').element as HTMLInputElement
		input.value = '2'
		input.dispatchEvent(new InputEvent('input'))

		expect(wrapper.emitted('update:value')).toEqual([[2]])
	})
})
