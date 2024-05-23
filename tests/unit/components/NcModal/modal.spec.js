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

import { mount } from '@vue/test-utils'
import NcModal from '../../../../src/components/NcModal/NcModal.vue'

describe('NcModal', () => {
	it('closes on click outside with `canClose`', async () => {
		const wrapper = mount(NcModal, { propsData: { canClose: true, title: 'modal' } })
		expect(wrapper.html().includes('modal-wrapper')).toBe(true)

		expect(wrapper.emitted('update:show')).toBe(undefined)

		await wrapper.find('.modal-wrapper').trigger('mousedown')
		// One emit('update:show', false)
		expect(wrapper.emitted('update:show')).toEqual([[false]])
	})

	it('not closes on click outside when `canClose` is false', async () => {
		const wrapper = mount(NcModal, { propsData: { canClose: false, title: 'modal' } })
		expect(wrapper.html().includes('modal-wrapper')).toBe(true)

		expect(wrapper.emitted('update:show')).toBe(undefined)

		await wrapper.find('.modal-wrapper').trigger('mousedown')
		// One emit('update:show', false)
		expect(wrapper.emitted('update:show')).toEqual(undefined)
	})

	it('not closes on click outside when `canClose` is true but `closeOnClickOutside` is false', async () => {
		const wrapper = mount(NcModal, { propsData: { canClose: true, closeOnClickOutside: false, title: 'modal' } })
		expect(wrapper.html().includes('modal-wrapper')).toBe(true)

		expect(wrapper.emitted('update:show')).toBe(undefined)

		await wrapper.find('.modal-wrapper').trigger('mousedown')
		// One emit('update:show', false)
		expect(wrapper.emitted('update:show')).toEqual(undefined)
	})
})
