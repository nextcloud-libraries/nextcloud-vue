/**
 * @copyright Copyright (c) 2022 Raimund Schlüßler <raimund.schluessler@mailbox.org>
 *
 * @author Raimund Schlüßler <raimund.schluessler@mailbox.org>
 * @author Ferdinand Thiessen <rpm@fthiessen.de>
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
import { beforeEach, describe, expect, it } from 'vitest'

import NcActions from '../../../../src/components/NcActions/NcActions.vue'
import NcActionButton from '../../../../src/components/NcActionButton/NcActionButton.vue'
import NcActionInput from '../../../../src/components/NcActionInput/NcActionInput.vue'
import TestCompositionApi from './TestCompositionApi.vue'
import { defineComponent } from 'vue'

describe('NcActions.vue', () => {

	describe('semantic menu type', () => {
		const MyWrapper = defineComponent({
			template: '<Fragment><NcActionInput /></Fragment>',
			components: { Fragment, NcActionInput },
		})

		// This currently fails due to limitations of Vue 2
		it.failing('Can auto detect semantic menu type in wrappers', () => {
			const wrapper = mount(NcActions, {
				slots: {
					default: [
						'<MyWrapper />',
					],
				},
				stubs: {
					MyWrapper,
				},
			})

			expect(wrapper.vm.$data.actionsMenuSemanticType).toBe('dialog')
		})

		it('Can set the type manually', () => {
			const wrapper = mount(NcActions, {
				propsData: {
					forceSemanticType: 'dialog',
				},
				slots: {
					default: [
						'<MyWrapper />',
					],
				},
				stubs: {
					MyWrapper,
				},
			})

			expect(wrapper.vm.$data.actionsMenuSemanticType).toBe('dialog')
		})
	})

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
