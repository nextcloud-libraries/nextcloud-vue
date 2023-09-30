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
import NcRelatedResourcesPanel from '../../../../src/components/NcRelatedResourcesPanel/NcRelatedResourcesPanel.vue'

describe('NcRelatedResourcesPanel', () => {

	let wrapper

	beforeEach(() => {
		wrapper = shallowMount(NcRelatedResourcesPanel, {
			data: () => ({
				appEnabled: true,
				headerTranslated: 'Related resources',
				loading: false,
				error: null,
				resources: [{ itemId: 'test', icon: 'test', title: 'test', url: 'http://test.com' }],
			}),
		})
	})

	it('it mounts', async () => {
		expect(wrapper.html()).toBeTruthy()
	})

	it('tests fetchRelatedResources', async () => {
		jest.mock('axios', () => ({
			get: jest.fn(() => Promise.resolve({
				data: {
					ocs: {
						data: [{ itemId: 'test', icon: 'test', title: 'test', url: 'http://test.com' }],
					},
				},
			})),
		}))
		const fetchRelatedResourcesSpy = jest.spyOn(wrapper.vm, 'fetchRelatedResources')
		wrapper.vm.appEnabled = true
		wrapper.vm.$nextTick()
		await wrapper.vm.fetchRelatedResources()
		expect(fetchRelatedResourcesSpy).toHaveBeenCalled()
		expect(wrapper.vm.resources).toEqual([{ itemId: 'test', icon: 'test', title: 'test', url: 'http://test.com' }])
	})
})
