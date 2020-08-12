/**
 * @copyright Copyright (c) 2020 Azul <azul@riseup.net>
 *
 * @author Azul <azul@riseup.net>
 *
 * @license GNU AGPL version 3 or any later version
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
import { emit } from '@nextcloud/event-bus'
import AppNavigation from '../../../../src/components/AppNavigation/AppNavigation.vue'

describe('AppNavigation.vue', () => {
	'use strict'

	describe('by default', () => {
		it('is open', () => {
			const wrapper = mount(AppNavigation)
			expect(wrapper.vm.$data.open).toBe(true)
		})
	})
	describe('toggle via event bus', () => {
		it('toggle to turn it off', () => {
			const wrapper = mount(AppNavigation)
			emit('toggle-navigation', {open: undefined})
			expect(wrapper.vm.$data.open).toBe(false)
		})

		it('toggle with open: false keeps it closed', () => {
			const wrapper = mount(AppNavigation)
			emit('toggle-navigation', {open: false})
			emit('toggle-navigation', {open: false})
			expect(wrapper.vm.$data.open).toBe(false)
		})

	})
})
