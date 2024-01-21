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
import { beforeAll, describe, expect, it, vi } from 'vitest'
import NcAppSettingsDialog from '../../../../src/components/NcAppSettingsDialog/NcAppSettingsDialog.vue'
import { defineComponent, h, inject, nextTick, onMounted } from 'vue'
import { resizeWindowWidth } from '../../testing-utils'

/**
 * Mocked AppSettingsSection that just registers it self
 */
const MockSection = defineComponent({
	props: { id: { type: String, default: 'test_id' } },
	setup(props) {
		const register = inject<(id: string, name: string)=> void>('registerSection')
		onMounted(() => register?.(props.id, 'test_name'))
		return () => h('li', ['empty'])
	},
})

describe('NcAppSettingsDialog: Sections registration', () => {
	beforeAll(async () => {
		await resizeWindowWidth(1024)
	})

	it('injects register function to children', async () => {
		const wrapper = mount(NcAppSettingsDialog, {
			slots: {
				default: MockSection,
			},
			props: {
				open: true,
				showNavigation: true,
			},
		})

		await nextTick()

		expect(wrapper.findAll('nav a')).toHaveLength(1)
		expect(wrapper.find('nav a').text()).toBe('test_name')
	})

	it('can register a new section', async () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const wrapper = mount<Vue & { registerSection: any }>(NcAppSettingsDialog, {
			props: {
				open: true,
				showNavigation: true,
			},
		})

		wrapper.vm.registerSection('test_id', 'test_name')
		await nextTick()
		expect(wrapper.findAll('nav a')).toHaveLength(1)
		expect(wrapper.find('nav a').text()).toBe('test_name')
	})

	it('warn on register a already registered section name', async () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const wrapper = mount<Vue & { registerSection: any }>(NcAppSettingsDialog, {
			props: {
				open: true,
				showNavigation: true,
			},
		})

		const spy = vi.spyOn(globalThis.console, 'warn')
		spy.mockImplementationOnce(() => {})

		// First call should be OK
		wrapper.vm.registerSection('test_id', 'test_name')
		await nextTick()
		expect(wrapper.findAll('nav a')).toHaveLength(1)
		expect(spy).not.toHaveBeenCalled()

		// Second one should unregister first and replace with this one, but show an error
		wrapper.vm.registerSection('test_id_2', 'test_name')
		await nextTick()
		expect(wrapper.findAll('nav a')).toHaveLength(2)
		expect(spy).toHaveBeenCalled()
	})

	it('error on register a already registered section ID', async () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const wrapper = mount<Vue & { registerSection: any }>(NcAppSettingsDialog, {
			props: {
				open: true,
				showNavigation: true,
			},
		})

		// First call should be OK
		wrapper.vm.registerSection('test_id', 'test_name')
		await nextTick()
		expect(wrapper.findAll('nav a')).toHaveLength(1)

		// Second one should unregister first and replace with this one, but show an error
		expect(() => wrapper.vm.registerSection('test_id', 'test_other_name')).toThrow()
		await nextTick()
		expect(wrapper.findAll('nav a')).toHaveLength(1)
	})

	it('can unregister a section', async () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const wrapper = mount<Vue & { registerSection: any, unregisterSection: any }>(NcAppSettingsDialog, {
			props: {
				open: true,
				showNavigation: true,
			},
		})

		wrapper.vm.registerSection('test_id', 'test_name')
		wrapper.vm.registerSection('test_id2', 'test_name2')
		await nextTick()
		expect(wrapper.findAll('nav a')).toHaveLength(2)

		wrapper.vm.unregisterSection('test_id')
		await nextTick()
		expect(wrapper.findAll('nav a')).toHaveLength(1)
		expect(wrapper.find('nav a').text()).toBe('test_name2')
	})
})
