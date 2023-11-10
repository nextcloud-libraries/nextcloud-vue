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
import NcAppSettingsDialog from '../../../../src/components/NcAppSettingsDialog/NcAppSettingsDialog.vue'
import { defineComponent, inject, onMounted } from 'vue'

/**
 * Mocked AppSettingsSection that just registers it self
 */
const MockSection = defineComponent({
	props: { id: { type: String, default: 'test_id' } },
	setup(props) {
		const register = inject<(id: string, name: string)=> void>('registerSection')
		onMounted(() => register?.(props.id, 'test_name'))
	},
})

describe('NcAppSettingsDialog: Sections registration', () => {
	it('injects register function to children', async () => {
		const wrapper = mount(NcAppSettingsDialog, {
			slots: {
				default: MockSection,
			},
			propsData: {
				open: true,
			},
		})

		expect(wrapper.vm.$data.sections).toHaveLength(1)
		expect(wrapper.vm.$data.sections[0]).toEqual({ id: 'test_id', name: 'test_name' })
	})

	it('can register a new section', async () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const wrapper = mount<Vue & { registerSection: any }>(NcAppSettingsDialog, {
			propsData: {
				open: true,
			},
		})

		wrapper.vm.registerSection('test_id', 'test_name')
		expect(wrapper.vm.$data.sections).toHaveLength(1)
		expect(wrapper.vm.$data.sections[0]).toEqual({ id: 'test_id', name: 'test_name' })
	})

	it('warn on register a already registered section name', async () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const wrapper = mount<Vue & { registerSection: any }>(NcAppSettingsDialog, {
			propsData: {
				open: true,
			},
		})

		const spy = jest.spyOn(globalThis.console, 'error')
		spy.mockImplementationOnce(() => {})

		// First call should be OK
		wrapper.vm.registerSection('test_id', 'test_name')
		expect(wrapper.vm.$data.sections).toHaveLength(1)
		expect(spy).not.toHaveBeenCalled()

		// Second one should unregister first and replace with this one, but show an error
		wrapper.vm.registerSection('test_id_2', 'test_name')
		expect(wrapper.vm.$data.sections).toHaveLength(2)
		expect(spy).toHaveBeenCalled()
	})

	it('error on register a already registered section ID', async () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const wrapper = mount<Vue & { registerSection: any }>(NcAppSettingsDialog, {
			propsData: {
				open: true,
			},
		})

		// First call should be OK
		wrapper.vm.registerSection('test_id', 'test_name')
		expect(wrapper.vm.$data.sections).toHaveLength(1)
		// Second one should unregister first and replace with this one, but show an error
		expect(() => wrapper.vm.registerSection('test_id', 'test_other_name')).toThrow()
		expect(wrapper.vm.$data.sections).toHaveLength(1)
	})

	it('can unregister a section', async () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const wrapper = mount<Vue & { registerSection: any, unregisterSection: any }>(NcAppSettingsDialog, {
			propsData: {
				open: true,
			},
		})

		wrapper.vm.registerSection('test_id', 'test_name')
		wrapper.vm.registerSection('test_id2', 'test_name2')
		expect(wrapper.vm.$data.sections).toHaveLength(2)
		wrapper.vm.unregisterSection('test_id')
		expect(wrapper.vm.$data.sections).toHaveLength(1)
		expect(wrapper.vm.$data.sections[0]).toEqual({ id: 'test_id2', name: 'test_name2' })
	})
})
