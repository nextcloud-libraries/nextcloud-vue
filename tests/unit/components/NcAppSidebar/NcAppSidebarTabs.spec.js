/**
 * @copyright Copyright (c) 2020 Raimund Schlüßler <raimund.schluessler@mailbox.org>
 * @copyright Copyright (c) 2020 Simon Belbeoch <simon.belbeoch@gmail.com>
 *
 * @author Raimund Schlüßler <raimund.schluessler@mailbox.org>
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
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// import { createApp } from 'vue'
import NcAppSidebarTabs from '../../../../src/components/NcAppSidebar/NcAppSidebarTabs.vue'
import NcAppSidebarTab from '../../../../src/components/NcAppSidebarTab/NcAppSidebarTab.vue'
import NcActionButton from '../../../../src/components/NcActionButton/NcActionButton.vue'

const initialConsole = { ...console }

describe('NcAppSidebarTabs.vue', () => {
	'use strict'

	beforeEach((ctx) => {
		ctx.onWarning = vi.fn()
		ctx.consoleDebug = vi.fn()
		global.console = { ...console, debug: ctx.consoleDebug }
	})

	afterEach(() => {
		// app.config.warnHandler = () => null
		global.console = initialConsole
	})

	describe('when using the component without tabs', () => {
		describe('with only one div', () => {
			beforeEach((ctx) => {
				ctx.wrapper = mount(NcAppSidebarTabs, {
					props: {
						title: 'Sidebar title.',
					},
					slots: {
						default: ['<div />'],
					},
				})
			})

			it('does not display the nav element', ({wrapper}) => {
				expect(wrapper.find('nav').exists()).toBe(false)
			})
			it('Issues no warning nor logs to console.', ({ consoleDebug, onWarning }) => {
				expect(onWarning).toHaveBeenCalledTimes(0)
				expect(consoleDebug).toHaveBeenCalledTimes(0)
			})
			it('does not display the nav element', ({ wrapper }) => {
				expect(wrapper.find('nav').exists()).toBe(false)
			})
		})

		describe('with div and secondary action', () => {
			beforeEach((ctx) => {
				ctx.wrapper = mount(NcAppSidebarTabs, {
					props: {
						title: 'Sidebar title.',
					},
					slots: {
						default: '<div />',
						'secondary-actions': ['<NcActionButton icon="icon-delete">Test</NcActionButton>'],
					},
					global: {
						stubs: {
							// used to register custom components
							NcActionButton,
						},
					},
				})
			})
			it('Issues no warning.', ({ onWarning }) => {
				expect(onWarning).toHaveBeenCalledTimes(0)
			})
		})
	})

	describe('when only children of type AppSidebarTab is used', () => {
		describe('when 3 children of type AppSidebarTab are used', () => {
			beforeEach((ctx) => {
				ctx.wrapper = mount(NcAppSidebarTabs, {
					slots: {
						default: [
							'<nc-app-sidebar-tab id="first" icon="icon-details" name="Tab1">Tab1</nc-app-sidebar-tab>',
							'<nc-app-sidebar-tab id="second" icon="icon-details" name="Tab2">Tab2</nc-app-sidebar-tab>',
							'<nc-app-sidebar-tab id="last" icon="icon-details" name="Tab2">Tab2</nc-app-sidebar-tab>',
						],
					},
					global: {
						stubs: {
						// used to register custom components
							NcAppSidebarTab,
						},
					},
				})
			})

			it('Issues no warning.', ({ onWarning }) => {
				expect(onWarning).toHaveBeenCalledTimes(0)
			})
			it('display the nav element', ({ wrapper }) => {
				expect(wrapper.find('nav').exists()).toBe(true)
			})
			it('display all the 3 elements in li', ({ wrapper }) => {
				const liList = wrapper.findAll('nav>ul>li')
				expect(liList.length).toEqual(3)
			})
			it('emit "update:active" event with the selected tab id when clicking on a tab', ({ wrapper }) => {
				const lastLink = wrapper.find('nav>ul>li:last-of-type>a')
				lastLink.trigger('click')
				expect(wrapper.emitted('update:active')[0]).toEqual(['last'])
			})
			it('emit "update:active" event with the first tab id when keydown pageup is pressed', ({ wrapper }) => {
				const lastLink = wrapper.find('nav>ul>li:last-of-type>a')
				lastLink.trigger('keydown.page-up')
				expect(wrapper.emitted('update:active')[0]).toEqual(['first'])
			})
			it('emit "update:active" event with the last tab id when keydown pagedown is pressed', ({ wrapper }) => {
				const lastLink = wrapper.find('nav>ul>li:last-of-type>a')
				lastLink.trigger('keydown.page-down')
				expect(wrapper.emitted('update:active')[0]).toEqual(['last'])
			})
			describe('when we select the first element', (ctx) => {
				beforeEach((ctx) => {
					ctx.wrapper.setProps({ active: 'first' })
				})
				it('does not emit "update:active" event when keydown left is pressed', ({ wrapper }) => {
					expect(wrapper.emitted('update:active')).toBeFalsy()
					const firstLink = wrapper.find('nav>ul>li>a')
					firstLink.trigger('keydown.left')
					expect(wrapper.emitted('update:active')).toBeFalsy()
				})
				it('emit "update:active" event with the next tab id when keydown right is pressed', ({ wrapper }) => {
					const firstLink = wrapper.find('nav>ul>li>a')
					firstLink.trigger('keydown.right')
					expect(wrapper.emitted('update:active')[0]).toEqual(['second'])
				})
			})
			describe('when we select the last element', (ctx) => {
				beforeEach(async (ctx) => {
					await wrapper.setProps({ active: 'last' })
				})
				it('emit "update:active" event with the previous tab id when keydown left is pressed', async ({ wrapper }) => {
					expect(wrapper.vm.activeTab).toBe('last')
					const lastLink = wrapper.find('nav>ul>li:last-of-type>a')
					lastLink.trigger('keydown.left')
					expect(wrapper.emitted('update:active')[0]).toEqual(['second'])
				})
				it('does not emit "update:active" event when keydown right is pressed', ({ wrapper }) => {
					expect(wrapper.emitted('update:active')).toBeFalsy()
					const lastLink = wrapper.find('nav>ul>li:last-of-type>a')
					lastLink.trigger('keydown.right')
					expect(wrapper.emitted('update:active')).toBeFalsy()
				})
			})
		})
	
		describe('when they is only 1 child of type AppSidebarTab are used', () => {
			beforeEach((ctx) => {
				ctx.wrapper = mount(NcAppSidebarTabs, {
					slots: {
						default: [
							'<nc-app-sidebar-tab id="1" icon="icon-details" name="Tab1">Tab1</nc-app-sidebar-tab>',
						],
					},
					global: {
						stubs: {
							// used to register custom components
							NcAppSidebarTab,
						},
					},
				})
			})
			it('Issues no warning.', ({ onWarning }) => {
				expect(onWarning).toHaveBeenCalledTimes(0)
			})
			it('does not display the nav element', ({ wrapper }) => {
				expect(wrapper.find('nav').exists()).toBe(false)
			})
		})
	})
	describe('when tabs and other elements are mixed', () => {
		it('Issues a warning and logs to console .', ({ consoleDebug, onWarning }) => {
			mount(NcAppSidebarTabs, {
				slots: {
					default: [
						'<nc-app-sidebar-tab id="1" icon="icon-details" name="Tab1">Tab1</nc-app-sidebar-tab>',
						'<NcAppSidebarTab id="2" icon="icon-details" name="Tab2">Tab2</NcAppSidebarTab>',
						'<div>Non-tab-content</div>',
						'Test',
					],
				},
				global: {
					stubs: {
						NcAppSidebarTab,
					},
				},
			})
			expect(consoleDebug).toHaveBeenCalledTimes(2)
			expect(onWarning).toHaveBeenCalledTimes(1)
		})
	})
})
