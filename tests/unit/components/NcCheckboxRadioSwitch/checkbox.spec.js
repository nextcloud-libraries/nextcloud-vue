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
})
