/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import NcAppSettingsDialog from '../../../../src/components/NcAppSettingsDialog/NcAppSettingsDialog.vue'
import { defineComponent, inject, nextTick, onMounted } from 'vue'
import { resizeWindowWidth } from '../../testing-utils'

/**
 * Mocked AppSettingsSection that just registers it self
 */
const MockSection = defineComponent({
	props: { id: { type: String, default: 'test_id' } },
	setup(props) {
		const register = inject<(id: string, name: string)=> void>('registerSection')
		onMounted(() => register?.(props.id, 'test_name'))
		return (h) => h('li', ['empty'])
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
			propsData: {
				open: true,
				showNavigation: true,
			},
		})

		await nextTick()

		expect(wrapper.findAll('nav a')).toHaveLength(1)
		expect(wrapper.find('nav a').text()).toBe('test_name')
	})

	it('can register a new section', async () => {
		const wrapper = mount<Vue & { registerSection: any }>(NcAppSettingsDialog, {
			propsData: {
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
		const wrapper = mount<Vue & { registerSection: any }>(NcAppSettingsDialog, {
			propsData: {
				open: true,
				showNavigation: true,
			},
		})

		const spy = jest.spyOn(globalThis.console, 'error')
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
		const wrapper = mount<Vue & { registerSection: any }>(NcAppSettingsDialog, {
			propsData: {
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
		const wrapper = mount<Vue & { registerSection: any, unregisterSection: any }>(NcAppSettingsDialog, {
			propsData: {
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
