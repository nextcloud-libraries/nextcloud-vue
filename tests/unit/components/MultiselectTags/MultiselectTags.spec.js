/**
 * @copyright Copyright (c) 2022 Robin Windey <ro.windey@gmail.com>
 *
 * @author Robin Windey <ro.windey@gmail.com>
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
import { searchTags } from '../../../../src/components/MultiselectTags/api.js'
import MultiselectTags from '../../../../src/components/MultiselectTags/MultiselectTags.vue'

jest.mock('../../../../src/components/MultiselectTags/api.js')

afterEach(() => {
	jest.clearAllMocks()
})

describe('MultiselectTags.vue', () => {
	'use strict'

	it('Test that by default only 5 tags are shown', async () => {
		const numberOfTags = 42
		const mockedTags = []
		for (let i = 0; i < numberOfTags; i++) {
			mockedTags.push({
				id: i,
				displayName: 'tag ' + i,
				canAssign: true,
				userAssignable: true,
				userVisible: true,
			})
		}

		searchTags.mockResolvedValueOnce(mockedTags)

		const wrapper = mount(MultiselectTags, {
			propsData: {
				label: 'name',
				value: [],
			},
		})

		// Wait for data to be loaded
		await new Promise(process.nextTick)

		const options = wrapper.findAll('li.multiselect__element .multiselect__option')

		expect(searchTags).toHaveBeenCalledTimes(1)
		expect(options.length).toBe(5)
	})

	it('Test that all available tags are shown if filter is null', async () => {
		const numberOfTags = 42
		const mockedTags = []
		for (let i = 0; i < numberOfTags; i++) {
			mockedTags.push({
				id: i,
				displayName: 'tag ' + i,
				canAssign: true,
				userAssignable: true,
				userVisible: true,
			})
		}

		searchTags.mockResolvedValueOnce(mockedTags)

		const wrapper = mount(MultiselectTags, {
			propsData: {
				label: 'name',
				value: [],
				filter: null,
			},
		})

		// Wait for data to be loaded
		await new Promise(process.nextTick)

		const options = wrapper.findAll('li.multiselect__element .multiselect__option')

		expect(searchTags).toHaveBeenCalledTimes(1)
		expect(options.length).toBe(numberOfTags)
	})

	it('Test that filter is applied correctly', async () => {
		const numberOfTags = 42
		const mockedTags = []
		for (let i = 0; i < numberOfTags; i++) {
			mockedTags.push({
				id: i,
				displayName: 'tag ' + i,
				canAssign: true,
				userAssignable: true,
				userVisible: true,
			})
		}

		searchTags.mockResolvedValueOnce(mockedTags)

		const wrapper = mount(MultiselectTags, {
			propsData: {
				label: 'name',
				value: [],
				filter: (element, index) => index >= 40 && element.id >= 40,
			},
		})

		// Wait for data to be loaded
		await new Promise(process.nextTick)

		const options = wrapper.findAll('li.multiselect__element .multiselect__option')

		expect(searchTags).toHaveBeenCalledTimes(1)
		expect(options.length).toBe(2)
	})
})
