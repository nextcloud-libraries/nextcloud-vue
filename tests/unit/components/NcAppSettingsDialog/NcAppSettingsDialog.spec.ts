/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { CreateElement } from 'vue'

import { beforeAll, describe, expect, it, jest } from '@jest/globals'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, onMounted } from 'vue'
import NcAppSettingsDialog from '../../../../src/components/NcAppSettingsDialog/NcAppSettingsDialog.vue'
import { useAppSettingsDialog } from '../../../../src/components/NcAppSettingsDialog/useAppSettingsDialog.ts'
import { resizeWindowWidth } from '../../testing-utils.ts'

/**
 * Mocked AppSettingsSection that just registers it self
 */
const MockSection = defineComponent({
	props: {
		id: { type: String, default: 'test_id' },
	},
	setup(props) {
		const register = useAppSettingsDialog()
		onMounted(() => register?.registerSection(props.id, 'test_name'))
		return (h: CreateElement) => h('li', ['empty'])
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
		let context: ReturnType<typeof useAppSettingsDialog>
		const wrapper = mount(NcAppSettingsDialog, {
			propsData: {
				open: true,
				showNavigation: true,
			},
			slots: {
				default: defineComponent({
					setup() {
						context = useAppSettingsDialog()
					},
				}),
			},
		})

		context!.registerSection('test_id', 'test_name')
		await nextTick()
		expect(wrapper.findAll('nav a')).toHaveLength(1)
		expect(wrapper.find('nav a').text()).toBe('test_name')
	})

	it('warn on register a already registered section name', async () => {
		let context: ReturnType<typeof useAppSettingsDialog>
		const wrapper = mount(NcAppSettingsDialog, {
			propsData: {
				open: true,
				showNavigation: true,
			},
			slots: {
				default: defineComponent({
					setup() {
						context = useAppSettingsDialog()
					},
				}),
			},
		})

		const spy = jest.spyOn(globalThis.console, 'error')
		spy.mockImplementationOnce(() => {})

		// First call should be OK
		context!.registerSection('test_id', 'test_name')
		await nextTick()
		expect(wrapper.findAll('nav a')).toHaveLength(1)
		expect(spy).not.toHaveBeenCalled()

		// Second one should unregister first and replace with this one, but show an error
		context!.registerSection('test_id_2', 'test_name')
		await nextTick()
		expect(wrapper.findAll('nav a')).toHaveLength(2)
		expect(spy).toHaveBeenCalled()
	})

	it('error on register a already registered section ID', async () => {
		let context: ReturnType<typeof useAppSettingsDialog>
		const wrapper = mount(NcAppSettingsDialog, {
			propsData: {
				open: true,
				showNavigation: true,
			},
			slots: {
				default: defineComponent({
					setup() {
						context = useAppSettingsDialog()
					},
				}),
			},
		})

		// First call should be OK
		context!.registerSection('test_id', 'test_name')
		await nextTick()
		expect(wrapper.findAll('nav a')).toHaveLength(1)

		// Second one should unregister first and replace with this one, but show an error
		expect(() => context!.registerSection('test_id', 'test_other_name')).toThrow()
		await nextTick()
		expect(wrapper.findAll('nav a')).toHaveLength(1)
	})

	it('can unregister a section', async () => {
		let context: ReturnType<typeof useAppSettingsDialog>
		const wrapper = mount(NcAppSettingsDialog, {
			propsData: {
				open: true,
				showNavigation: true,
			},
			slots: {
				default: defineComponent({
					setup() {
						context = useAppSettingsDialog()
					},
				}),
			},
		})

		context!.registerSection('test_id', 'test_name')
		context!.registerSection('test_id2', 'test_name2')
		await nextTick()
		expect(wrapper.findAll('nav a')).toHaveLength(2)

		context!.unregisterSection('test_id')
		await nextTick()
		expect(wrapper.findAll('nav a')).toHaveLength(1)
		expect(wrapper.find('nav a').text()).toBe('test_name2')
	})
})
