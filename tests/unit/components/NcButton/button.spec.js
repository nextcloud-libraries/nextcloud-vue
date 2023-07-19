/**
 * @copyright Copyright (c) 2023 Ferdinand Thiessen <opensource@fthiessen.de>
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

import { shallowMount } from '@vue/test-utils'
import NcButton from '../../../../src/components/NcButton/NcButton.vue'

describe('NcButton', () => {
	it('emits update:pressed', async () => {
		const wrapper = shallowMount(NcButton, { propsData: { pressed: true, ariaLabel: 'button' } })
		wrapper.findComponent('button').trigger('click')
		expect(wrapper.emitted('update:pressed')?.length).toBe(1)
		expect(wrapper.emitted('update:pressed')[0]).toEqual([false])

		// Now the same but when pressed was false
		await wrapper.setProps({ pressed: false })
		wrapper.findComponent('button').trigger('click')
		expect(wrapper.emitted('update:pressed')?.length).toBe(2)
		expect(wrapper.emitted('update:pressed')[1]).toEqual([true])
	})

	it('does not emit update:pressed when not configured', async () => {
		const wrapper = shallowMount(NcButton, { propsData: { ariaLabel: 'button' } })
		wrapper.findComponent('button').trigger('click')
		expect(wrapper.emitted('update:pressed')).toBe(undefined)
	})
})
