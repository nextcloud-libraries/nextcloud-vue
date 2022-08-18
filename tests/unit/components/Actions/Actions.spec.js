/**
 * @copyright Copyright (c) 2022 Raimund Schlüßler <raimund.schluessler@mailbox.org>
 *
 * @author Raimund Schlüßler <raimund.schluessler@mailbox.org>
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

import Actions from '../../../../src/components/Actions/Actions.vue'
import ActionButton from '../../../../src/components/ActionButton/ActionButton.vue'

let wrapper

describe('Actions.vue', () => {
	'use strict'
	describe('when using the component with', () => {
		describe('two ActionButtons', () => {
			beforeEach(() => {
				wrapper = mount(Actions, {
					slots: {
						default: [
							'<ActionButton>Test1</ActionButton>',
							'<ActionButton>Test2</ActionButton>',
						],
					},
					stubs: {
						// used to register custom components
						ActionButton,
					},
				})
			})
			it('shows the menu toggle.', () => {
				expect(wrapper.find('.action-item__menutoggle').exists()).toBe(true)
			})
		})
		describe('one ActionButton', () => {
			beforeEach(() => {
				wrapper = mount(Actions, {
					slots: {
						default: [
							'<ActionButton>Test1</ActionButton>',
						],
					},
					stubs: {
						// used to register custom components
						ActionButton,
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

		describe('3 ActionButton with one inline', () => {
			beforeEach(() => {
				wrapper = mount(Actions, {
					slots: {
						default: [
							'<ActionButton>Test1</ActionButton>',
							'<ActionButton>Test2</ActionButton>',
							'<ActionButton>Test3</ActionButton>',
						],
					},
					stubs: {
						// used to register custom components
						ActionButton,
					},
					propsData: {
						inline: 1,
					},
				})
			})
			it('shows the first action outside.', () => {
				expect(wrapper.findAll('.action-item').length).toBe(2)
				expect(wrapper.findAll('button.action-item').length).toBe(1)
				expect(wrapper.find('button.action-item').exists()).toBe(true)
			})
			it('shows the menu toggle.', () => {
				expect(wrapper.find('.action-item__menutoggle').exists()).toBe(true)
			})
			it('shows the first two action outside on prop change.', async () => {
				await wrapper.setProps({ inline: 2 })
				expect(wrapper.findAll('.action-item').length).toBe(3)
				expect(wrapper.findAll('button.action-item').length).toBe(2)
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
	})
})
