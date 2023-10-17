/**
 * @copyright 2023 Ferdinand Thiessen <opensource@fthiessen.de>
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
import { nextTick } from 'vue'
import NcAvatar from '../../../../src/components/NcAvatar/NcAvatar.vue'

describe('NcAvatar.vue', () => {
	it('aria label is set to include status if status is shown visually', async () => {
		const status = {
			icon: '',
			status: 'online',
			message: 'doing nothing',
		}

		const wrapper = mount(NcAvatar, {
			propsData: {
				user: 'janedoe',
				displayName: 'J. Doe',
				preloadedUserStatus: status,
			},
		})
		await nextTick()

		expect(wrapper.find('.avatardiv__user-status').exists()).toBe(true)
		expect(wrapper.attributes('aria-label')).toBe('Avatar of J. Doe, online')
	})

	it('aria label is set to include status even if status is do-not-disturb', async () => {
		const status = {
			icon: '',
			status: 'dnd',
			message: 'Playing DnD',
		}

		const wrapper = mount(NcAvatar, {
			propsData: {
				user: 'janedoe',
				displayName: 'J. Doe',
				preloadedUserStatus: status,
			},
		})

		await nextTick()

		expect(wrapper.find('.avatardiv__user-status').exists()).toBe(true)
		expect(wrapper.attributes('aria-label')).toBe('Avatar of J. Doe, do not disturb')
	})

	it('aria label is does not include status if status not shown', async () => {
		const status = {
			icon: '',
			status: 'online',
			message: 'Idle',
		}

		const wrapper = mount(NcAvatar, {
			propsData: {
				user: 'janedoe',
				displayName: 'J. Doe',
				preloadedUserStatus: status,
				showUserStatus: false,
			},
		})

		await nextTick()

		expect(wrapper.find('.avatardiv__user-status').exists()).toBe(false)
		expect(wrapper.attributes('aria-label')).toBe('Avatar of J. Doe')
	})
})
