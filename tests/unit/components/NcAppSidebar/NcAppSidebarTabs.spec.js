/**
 * @copyright Copyright (c) 2020 Raimund Schlüßler <raimund.schluessler@mailbox.org>
 * @copyright Copyright (c) 2020 Simon Belbeoch <simon.belbeoch@gmail.com>
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

import Vue from 'vue'
import NcAppSidebarTabs from '../../../../src/components/NcAppSidebar/NcAppSidebarTabs.vue'
import NcAppSidebarTab from '../../../../src/components/NcAppSidebarTab/NcAppSidebarTab.vue'
import NcActionButton from '../../../../src/components/NcActionButton/NcActionButton.vue'

let onWarning
let consoleDebug

let wrapper

const initialConsole = { ...console }

describe('NcAppSidebarTabs.vue', () => {
	'use strict'
	beforeEach(() => {
		onWarning = jest.fn()
		consoleDebug = jest.fn()
		Vue.config.warnHandler = onWarning
		global.console = { ...console, debug: consoleDebug }
	})
	afterEach(() => {
		Vue.config.warnHandler = () => null
		global.console = initialConsole
	})
	describe('when using the component without tabs', () => {
		describe('with only one div', () => {
			beforeEach(() => {
				wrapper = mount(NcAppSidebarTabs, {
					propsData: {
						name: 'Sidebar name.',
					},
					slots: {
						default: ['<div />'],
					},
				})
			})
			it('Issues no warning nor logs to console.', () => {
				expect(onWarning).toHaveBeenCalledTimes(0)
				expect(consoleDebug).toHaveBeenCalledTimes(0)
			})
			it('does not display the tablist element', () => {
				expect(wrapper.find('div[role="tablist"]').exists()).toBe(false)
			})
		})
		describe('with div and secondary action', () => {
			beforeEach(() => {
				wrapper = mount(NcAppSidebarTabs, {
					propsData: {
						name: 'Sidebar name.',
					},
					slots: {
						default: '<div />',
						'secondary-actions': [
							'<NcActionButton icon="icon-delete">Test</NcActionButton>',
						],
					},
					stubs: {
						// used to register custom components
						NcActionButton,
					},
				})
			})
			it('Issues no warning.', () => {
				expect(onWarning).toHaveBeenCalledTimes(0)
			})
		})

		it('does not display the tablist element', () => {
			expect(wrapper.find('div[role="tablist"]').exists()).toBe(false)
		})
	})
	describe('when only children of type AppSidebarTab is used', () => {
		describe('when 3 children of type AppSidebarTab are used', () => {
			beforeEach(() => {
				wrapper = mount(NcAppSidebarTabs, {
					slots: {
						default: [
							'<nc-app-sidebar-tab id="first" icon="icon-details" name="Tab1">Tab1</nc-app-sidebar-tab>',
							'<nc-app-sidebar-tab id="second" icon="icon-details" name="Tab2">Tab2</nc-app-sidebar-tab>',
							'<nc-app-sidebar-tab id="last" icon="icon-details" name="Tab2">Tab2</nc-app-sidebar-tab>',
						],
					},
					stubs: {
						// used to register custom components
						NcAppSidebarTab,
					},
					attachTo: document.body,
				})
			})
			it('Issues no warning.', () => {
				expect(onWarning).toHaveBeenCalledTimes(0)
			})
			it('display the tablist element', () => {
				expect(wrapper.find('div[role="tablist"]').exists()).toBe(true)
			})
			it('display all the 3 elements', () => {
				const liList = wrapper.findAll(
					'div[role="tablist"]>.checkbox-radio-switch',
				)
				expect(liList.length).toEqual(3)
			})
			it('emit "update:active" event with the selected tab id when clicking on a tab', () => {
				const lastLink = wrapper.find(
					'div[role="tablist"]>button.checkbox-radio-switch:last-of-type',
				)
				lastLink.trigger('click')
				expect(wrapper.emitted('update:active')[0]).toEqual(['last'])
			})
			it('emit "update:active" event with the first tab id when keydown pageup is pressed', () => {
				const lastLink = wrapper.find(
					'div[role="tablist"]>button.checkbox-radio-switch:last-of-type',
				)
				lastLink.trigger('keydown.pageup')
				expect(wrapper.emitted('update:active')[0]).toEqual(['first'])
			})
			it('emit "update:active" event with the last tab id when keydown pagedown is pressed', () => {
				const lastLink = wrapper.find(
					'div[role="tablist"]>button.checkbox-radio-switch:last-of-type',
				)
				lastLink.trigger('keydown.pagedown')
				expect(wrapper.emitted('update:active')[0]).toEqual(['last'])
			})
			describe('when we select the first element', () => {
				beforeEach(() => {
					wrapper.setData({ activeTab: 'first' })
				})
				it('does not emit "update:active" event when keydown left is pressed', () => {
					expect(wrapper.emitted('update:active')).toBeFalsy()
					const firstLink = wrapper.find(
						'div[role="tablist"]>button.checkbox-radio-switch',
					)
					firstLink.trigger('keydown.left')
					expect(wrapper.emitted('update:active')).toBeFalsy()
				})
				it('emit "update:active" event with the next tab id when keydown right is pressed', () => {
					const firstLink = wrapper.find(
						'div[role="tablist"]>button.checkbox-radio-switch',
					)
					firstLink.trigger('keydown.right')
					expect(wrapper.emitted('update:active')[0]).toEqual(['second'])
				})
			})
			describe('when we select the last element', () => {
				beforeEach(() => {
					wrapper.setData({ activeTab: 'last' })
				})
				it('emit "update:active" event with the previous tab id when keydown left is pressed', () => {
					const lastLink = wrapper.find(
						'div[role="tablist"]>button.checkbox-radio-switch:last-of-type',
					)
					lastLink.trigger('keydown.left')
					expect(wrapper.emitted('update:active')[0]).toEqual(['second'])
				})
				it('does not emit "update:active" event when keydown right is pressed', () => {
					expect(wrapper.emitted('update:active')).toBeFalsy()
					const lastLink = wrapper.find(
						'div[role="tablist"]>button.checkbox-radio-switch:last-of-type',
					)
					lastLink.trigger('keydown.right')
					expect(wrapper.emitted('update:active')).toBeFalsy()
				})
			})
		})
		describe('when they is only 1 child of type AppSidebarTab are used', () => {
			beforeEach(() => {
				wrapper = mount(NcAppSidebarTabs, {
					slots: {
						default: [
							'<nc-app-sidebar-tab id="1" icon="icon-details" name="Tab1">Tab1</nc-app-sidebar-tab>',
						],
					},
					stubs: {
						// used to register custom components
						NcAppSidebarTab,
					},
				})
			})
			it('Issues no warning.', () => {
				expect(onWarning).toHaveBeenCalledTimes(0)
			})
			it('does not display the tablist element', () => {
				expect(wrapper.find('div[role="tablist"]').exists()).toBe(false)
			})
		})
	})
})
