/**
 * @copyright Copyright (c) 2024 Ferdinand Thiessen <opensource@fthiessen.de>
 *
 * @author Ferdinand Thiessen <opensource@fthiessen.de>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
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
