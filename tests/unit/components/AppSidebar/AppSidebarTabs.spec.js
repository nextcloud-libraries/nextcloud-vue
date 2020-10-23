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
import AppSidebarTabs from '../../../../src/components/AppSidebar/AppSidebarTabs.vue'
import AppSidebarTab from '../../../../src/components/AppSidebarTab/AppSidebarTab.vue'
import ActionButton from '../../../../src/components/ActionButton/ActionButton.vue'

let onWarning
let consoleDebug

let wrapper

const initialConsole = { ...console }

describe('AppSidebarTabs.vue', () => {
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
				wrapper = mount(AppSidebarTabs, {
					propsData: {
						title: 'Sidebar title.',
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
			it('does not display the nav element', () => {
				expect(wrapper.find('nav').exists()).toBe(false)
			})
		})
		describe('with div and secondary action', () => {
			beforeEach(() => {
				wrapper = mount(AppSidebarTabs, {
					propsData: {
						title: 'Sidebar title.',
					},
					slots: {
						default: '<div />',
						'secondary-actions': ['<ActionButton icon="icon-delete">Test</ActionButton>'],
					},
					stubs: {
						// used to register custom components
						ActionButton,
					},
				})
			})
			it('Issues no warning.', () => {
				expect(onWarning).toHaveBeenCalledTimes(0)
			})
		})

		it('does not display the nav element', () => {
			expect(wrapper.find('nav').exists()).toBe(false)
		})
	})
	describe('when only children of type AppSidebarTab is used', () => {
		describe('when 3 children of type AppSidebarTab are used', () => {
			beforeEach(() => {
				wrapper = mount(AppSidebarTabs, {
					slots: {
						default: [
							'<app-sidebar-tab id="first" icon="icon-details" name="Tab1">Tab1</app-sidebar-tab>',
							'<app-sidebar-tab id="second" icon="icon-details" name="Tab2">Tab2</app-sidebar-tab>',
							'<app-sidebar-tab id="last" icon="icon-details" name="Tab2">Tab2</app-sidebar-tab>',
						],
					},
					stubs: {
					// used to register custom components
						AppSidebarTab,
					},
				})
			})
			it('Issues no warning.', () => {
				expect(onWarning).toHaveBeenCalledTimes(0)
			})
			it('display the nav element', () => {
				expect(wrapper.find('nav').exists()).toBe(true)
			})
			it('display all the 3 elements in li', () => {
				const liList = wrapper.findAll('nav>ul>li')
				expect(liList.length).toEqual(3)
			})
			it('emit "update:active" event with the selected tab id when clicking on a tab', () => {
				const lastLink = wrapper.find('nav>ul>li:last-of-type>a')
				lastLink.trigger('click')
				expect(wrapper.emitted('update:active')[0]).toEqual(['last'])
			})
			it('emit "update:active" event with the first tab id when keydown pageup is pressed', () => {
				const lastLink = wrapper.find('nav>ul>li:last-of-type>a')
				lastLink.trigger('keydown.pageup')
				expect(wrapper.emitted('update:active')[0]).toEqual(['first'])
			})
			it('emit "update:active" event with the last tab id when keydown pagedown is pressed', () => {
				const lastLink = wrapper.find('nav>ul>li:last-of-type>a')
				lastLink.trigger('keydown.pagedown')
				expect(wrapper.emitted('update:active')[0]).toEqual(['last'])
			})
			describe('when we select the first element', () => {
				beforeEach(() => {
					wrapper.setData({ activeTab: 'first' })
				})
				it('does not emit "update:active" event when keydown left is pressed', () => {
					expect(wrapper.emitted('update:active')).toBeFalsy()
					const firstLink = wrapper.find('nav>ul>li>a')
					firstLink.trigger('keydown.left')
					expect(wrapper.emitted('update:active')).toBeFalsy()
				})
				it('emit "update:active" event with the next tab id when keydown right is pressed', () => {
					const firstLink = wrapper.find('nav>ul>li>a')
					firstLink.trigger('keydown.right')
					expect(wrapper.emitted('update:active')[0]).toEqual(['second'])
				})
			})
			describe('when we select the last element', () => {
				beforeEach(() => {
					wrapper.setData({ activeTab: 'last' })
				})
				it('emit "update:active" event with the previous tab id when keydown left is pressed', () => {
					const lastLink = wrapper.find('nav>ul>li:last-of-type>a')
					lastLink.trigger('keydown.left')
					expect(wrapper.emitted('update:active')[0]).toEqual(['second'])
				})
				it('does not emit "update:active" event when keydown right is pressed', () => {
					expect(wrapper.emitted('update:active')).toBeFalsy()
					const lastLink = wrapper.find('nav>ul>li:last-of-type>a')
					lastLink.trigger('keydown.right')
					expect(wrapper.emitted('update:active')).toBeFalsy()
				})
			})
		})
		describe('when they is only 1 child of type AppSidebarTab are used', () => {
			beforeEach(() => {
				wrapper = mount(AppSidebarTabs, {
					slots: {
						default: [
							'<app-sidebar-tab id="1" icon="icon-details" name="Tab1">Tab1</app-sidebar-tab>',
						],
					},
					stubs: {
						// used to register custom components
						AppSidebarTab,
					},
				})
			})
			it('Issues no warning.', () => {
				expect(onWarning).toHaveBeenCalledTimes(0)
			})
			it('does not display the nav element', () => {
				expect(wrapper.find('nav').exists()).toBe(false)
			})
		})
	})
	describe('when tabs and other elements are mixed', () => {
		it('Issues a warning and logs to console .', () => {
			mount(AppSidebarTabs, {
				slots: {
					default: [
						'<app-sidebar-tab id="1" icon="icon-details" name="Tab1">Tab1</app-sidebar-tab>',
						'<AppSidebarTab id="2" icon="icon-details" name="Tab2">Tab2</AppSidebarTab>',
						'<div>Non-tab-content</div>',
						'Test',
					],
				},
				stubs: {
					AppSidebarTab,
				},
			})
			expect(onWarning).toHaveBeenCalledTimes(1)
			expect(consoleDebug).toHaveBeenCalledTimes(2)
		})
	})
})
