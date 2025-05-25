/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount, shallowMount } from '@vue/test-utils'
import NcInputField from '../../../../src/components/NcInputField/index.js'

import { describe, expect, it } from 'vitest'
import NcTextField from '../../../../src/components/NcTextField/NcTextField.vue'

describe('NcTextField', () => {
	it('does forward attributes to input field', async () => {
		const wrapper = mount(NcTextField, {
			props: {
				label: 'label',
				modelValue: '',
				type: 'text',
				readonly: 'readonly',
			},
		})

		expect(wrapper.get('input').attributes()).toHaveProperty('readonly')
	})

	it('does not forward own props to input field', async () => {
		const wrapper = mount(NcTextField, {
			props: {
				label: 'label',
				modelValue: '',
				type: 'text',
				trailingButtonIcon: 'close',
			},
		})

		expect(wrapper.get('input').attributes()).not.toHaveProperty('trailingbuttonicon')
	})
})
