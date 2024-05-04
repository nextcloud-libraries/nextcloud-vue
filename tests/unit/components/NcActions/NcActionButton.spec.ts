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

import NcActionButton from '../../../../src/components/NcActionButton/NcActionButton.vue'

describe('NcActionButton', () => {
	it('supports icon classes', () => {
		const wrapper = mount(NcActionButton, {
			propsData: {
				icon: 'icon-add',
			},
			slots: {
				default: 'text',
			},
		})
		expect(wrapper.find('.action-button__icon').classes('icon-add')).toBe(true)
	})

	it('supports icon URL', () => {
		const wrapper = mount(NcActionButton, {
			propsData: {
				icon: 'http://example.com/icon.png',
			},
			slots: {
				default: 'text',
			},
		})
		expect(wrapper.find('.action-button__icon').attributes('style')).toContain(
			'background-image: url(http://example.com/icon.png);',
		)
	})

	it('supports relative icon URL', () => {
		const wrapper = mount(NcActionButton, {
			propsData: {
				icon: '/icon.png',
			},
			slots: {
				default: 'text',
			},
		})
		expect(wrapper.find('.action-button__icon').attributes('style')).toContain(
			'background-image: url(/icon.png);',
		)
	})
})
