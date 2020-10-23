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
		it('Issues no warning nor logs nothing to console.', () => {
			mount(AppSidebarTabs, {
				propsData: {
					title: 'Sidebar title.',
				},
				slots: {
					default: ['<div />'],
				},
			})
			expect(onWarning).toHaveBeenCalledTimes(0)
			expect(consoleDebug).toHaveBeenCalledTimes(0)
		})

		it('Issues no warning when using secondary actions.', () => {
			mount(AppSidebarTabs, {
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
			expect(onWarning).toHaveBeenCalledTimes(0)
		})
	})
	describe('when only children of type AppSidebarTab are used', () => {
		it('Issues no warning.', () => {
			mount(AppSidebarTabs, {
				slots: {
					default: [
						'<app-sidebar-tab id="1" icon="icon-details" name="Tab1">Tab1</app-sidebar-tab>',
						'<app-sidebar-tab id="2" icon="icon-details" name="Tab2">Tab2</app-sidebar-tab>',
					],
				},
				stubs: {
					// used to register custom components
					'app-sidebar-tab': AppSidebarTab,
				},
			})
			expect(onWarning).toHaveBeenCalledTimes(0)
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
