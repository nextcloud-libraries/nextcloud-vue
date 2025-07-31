/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import NcActionButton from '../../../../src/components/NcActionButton/NcActionButton.vue'
import NcActions from '../../../../src/components/NcActions/NcActions.vue'
import TestCompositionApi from './TestCompositionApi.vue'

describe('NcActions.vue', () => {
	'use strict'
	describe('when using the component with', () => {
		it('no actions elements', () => {
			const wrapper = mount(NcActions, {
				slots: {
					default: [],
				},
			})
			expect(wrapper.html()).toBe('')
		})

		/**
		 * Ensure NcActions work with Composition API components (nextcloud/nextcloud-vue#3719)
		 */
		it('composition API', () => {
			const wrapper = mount(TestCompositionApi)
			expect(wrapper.find('.action-item__menutoggle').exists()).toBe(true)
		})

		it('keeps attributes on the children', () => {
			const wrapper = mount(NcActions, {
				slots: {
					default: [
						'<NcActionButton data-test-id="button-test1">Test1</NcActionButton>',
						'<NcActionButton data-test-id="button-test2">Test2</NcActionButton>',
					],
				},
				props: {
					inline: 1,
				},
				global: {
					stubs: {
						// used to register custom components
						NcActionButton,
					},
				},
			})

			const buttons = wrapper.findAllComponents({ name: 'NcButton' })
			expect(buttons).toHaveLength(2)
			expect(buttons.at(0).attributes('data-test-id')).toBe('button-test1')
			expect(buttons.at(1).classes('action-item__menutoggle')).toBe(true)
		})

		describe('one NcActionButton', () => {
			let wrapper

			beforeEach(() => {
				wrapper = mount(NcActions, {
					slots: {
						default: [
							'<NcActionButton>Test1</NcActionButton>',
						],
					},
					global: {
						stubs: {
							// used to register custom components
							NcActionButton,
						},
					},
				})
			})
			it('shows no menu toggle.', () => {
				expect(wrapper.find('.action-item__menutoggle').exists()).toBe(false)
			})
			it('shows the menu toggle when forced.', async () => {
				await wrapper.setProps({ forceMenu: true })
				expect(wrapper.find('.action-item__menutoggle').exists()).toBe(true)
			})
		})

		describe('two NcActionButtons', () => {
			let wrapper

			beforeEach(() => {
				wrapper = mount(NcActions, {
					slots: {
						default: [
							'<NcActionButton>Test1</NcActionButton>',
							'<NcActionButton>Test2</NcActionButton>',
						],
					},
					global: {
						stubs: {
							// used to register custom components
							NcActionButton,
						},
					},
				})
			})
			it('shows the menu toggle.', () => {
				expect(wrapper.find('.action-item__menutoggle').exists()).toBe(true)
			})
		})

		describe('3 ActionButton with one inline', () => {
			let wrapper

			beforeEach(() => {
				wrapper = mount(NcActions, {
					slots: {
						default: [
							'<NcActionButton>Test1</NcActionButton>',
							'<NcActionButton>Test2</NcActionButton>',
							'<NcActionButton>Test3</NcActionButton>',
						],
					},
					global: {
						stubs: {
							// used to register custom components
							NcActionButton,
						},
					},
					props: {
						inline: 1,
					},
				})
			})
			it('shows the first action outside.', () => {
				expect(wrapper.findAll('button.action-item').length).toBe(1)
				expect(wrapper.find('button.action-item[aria-label="Test1"]').exists()).toBe(true)
			})
			it('shows the menu toggle.', () => {
				expect(wrapper.find('.action-item__menutoggle').exists()).toBe(true)
			})
			it('shows the first two action outside on prop change.', async () => {
				await wrapper.setProps({ inline: 2 })
				expect(wrapper.findAll('button.action-item').length).toBe(2)
				expect(wrapper.find('.action-item__menutoggle').exists()).toBe(true)
			})
			it('shows all actions outside on prop change.', async () => {
				await wrapper.setProps({ inline: 3 })
				expect(wrapper.findAll('.action-item').length).toBe(3)
				expect(wrapper.findAll('button.action-item').length).toBe(3)
				expect(wrapper.find('.action-item__menutoggle').exists()).toBe(false)
			})
			it('shows the menu toggle when forced.', async () => {
				await wrapper.setProps({ forceMenu: true })
				expect(wrapper.findAll('button.action-item').length).toBe(0)
				expect(wrapper.find('.action-item__menutoggle').exists()).toBe(true)
			})
		})

		it('supports URL for inline actions', () => {
			const wrapper = mount(NcActions, {
				slots: {
					default: [
						'<NcActionButton icon="http://example.com/image.png">Test1</NcActionButton>',
					],
				},
				global: {
					stubs: {
						// used to register custom components
						NcActionButton,
					},
				},
				props: {
					inline: 1,
				},
			})

			expect(wrapper.find('img[src="http://example.com/image.png"').exists()).toBe(true)
		})
	})
})
