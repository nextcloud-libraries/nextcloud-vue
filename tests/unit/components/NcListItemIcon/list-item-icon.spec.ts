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
import NcListItemIcon from '../../../../src/components/NcListItemIcon/NcListItemIcon.vue'

describe('NcListItemIcon', () => {
	it('highlights the search query', async () => {
		const wrapper = shallowMount(NcListItemIcon, {
			propsData: {
				name: 'J. Doe',
				subname: 'privacy@example.com',
				search: 'doe',
			},
		})

		const highlights = wrapper.findAllComponents({ name: 'NcHighlight' })
		expect(highlights).toHaveLength(2)
		expect(highlights.at(0).props('text')).toBe('J. Doe')
		expect(highlights.at(0).props('search')).toBe('doe')
		expect(highlights.at(1).props('text')).toBe('privacy@example.com')
		expect(highlights.at(1).props('search')).toBe('doe')
	})

	it('highlights the email notation query', async () => {
		const wrapper = shallowMount(NcListItemIcon, {
			propsData: {
				name: 'J. Doe',
				subname: 'privacy@example.com',
				search: 'Manager <privacy@example.com>',
			},
		})

		const highlights = wrapper.findAllComponents({ name: 'NcHighlight' })
		expect(highlights).toHaveLength(2)
		expect(highlights.at(0).props('search')).toBe('Manager')
		expect(highlights.at(1).props('search')).toBe('privacy@example.com')
	})

	it('highlights the email notation query even if only partly typed', async () => {
		const wrapper = shallowMount(NcListItemIcon, {
			propsData: {
				name: 'J. Doe',
				subname: 'privacy@example.com',
				search: 'Manager <privacy',
			},
		})

		const highlights = wrapper.findAllComponents({ name: 'NcHighlight' })
		expect(highlights).toHaveLength(2)
		expect(highlights.at(0).props('search')).toBe('Manager')
		expect(highlights.at(1).props('search')).toBe('privacy')
	})

	it('does not highlight the email notation query when missing email', async () => {
		const wrapper = shallowMount(NcListItemIcon, {
			propsData: {
				name: 'J. Doe',
				subname: 'privacy@example.com',
				search: 'Doe <',
			},
		})

		const highlights = wrapper.findAllComponents({ name: 'NcHighlight' })
		expect(highlights).toHaveLength(2)
		expect(highlights.at(0).props('search')).toBe('Doe <')
		expect(highlights.at(1).props('search')).toBe('Doe <')
	})

	it('does not highlight the email notation query when no user', async () => {
		const wrapper = shallowMount(NcListItemIcon, {
			propsData: {
				name: 'J. Doe',
				subname: 'privacy@example.com',
				search: 'Doe <privacy@example.com>',
				isNoUser: true,
			},
		})

		const highlights = wrapper.findAllComponents({ name: 'NcHighlight' })
		expect(highlights).toHaveLength(2)
		expect(highlights.at(0).props('search')).toBe('Doe <privacy@example.com>')
		expect(highlights.at(1).props('search')).toBe('Doe <privacy@example.com>')
	})
})
