/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import NcActionButton from '../../../../src/components/NcActionButton/NcActionButton.vue'
import NcAppSidebarTabs from '../../../../src/components/NcAppSidebar/NcAppSidebarTabs.vue'
import NcAppSidebarTab from '../../../../src/components/NcAppSidebarTab/NcAppSidebarTab.vue'

const initialConsole = { ...console }

describe('NcAppSidebarTabs.vue', () => {
	'use strict'

	beforeEach((ctx) => {
		ctx.onWarning = vi.fn()
		ctx.onDebug = vi.fn()
		global.console = { ...console, debug: ctx.onDebug, warn: ctx.onWarning }
	})

	afterEach(() => {
		global.console = initialConsole
	})

	describe('when using the component without tabs', () => {
		describe('with only one div', () => {
			beforeEach((ctx) => {
				ctx.wrapper = mount(NcAppSidebarTabs, {
					props: {
						name: 'Sidebar name.',
					},
					slots: {
						default: ['<div />'],
					},
				})
			})

			it('does not display the nav element', ({ wrapper }) => {
				expect(wrapper.find('nav').exists()).toBe(false)
			})
			it('Issues no warning nor logs to console.', ({ onDebug, onWarning }) => {
				expect(onWarning).toHaveBeenCalledTimes(0)
				expect(onDebug).toHaveBeenCalledTimes(0)
			})
			it('does not display the tablist element', ({ wrapper }) => {
				expect(wrapper.find('div[role="tablist"]').exists()).toBe(false)
			})
		})

		describe('with div and secondary action', () => {
			beforeEach((ctx) => {
				ctx.wrapper = mount(NcAppSidebarTabs, {
					props: {
						name: 'Sidebar name.',
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
					attachTo: document.body,
				})
			})
			it('Issues no warning.', ({ onWarning }) => {
				expect(onWarning).toHaveBeenCalledTimes(0)
			})
			it('display the tablist element', ({ wrapper }) => {
				expect(wrapper.find('div[role="tablist"]').exists()).toBe(true)
			})
			it('display all the 3 elements', ({ wrapper }) => {
				const liList = wrapper.findAll('div[role="tablist"]>.checkbox-radio-switch')
				expect(liList.length).toEqual(3)
			})
			it('emit "update:active" event with the selected tab id when clicking on a tab', ({ wrapper }) => {
				const lastLink = wrapper.find('div[role="tablist"]>button.checkbox-radio-switch:last-of-type')
				lastLink.trigger('click')
				expect(wrapper.emitted('update:active')[0]).toEqual(['last'])
			})
			it('emit "update:active" event with the first tab id when keydown pageup is pressed', ({ wrapper }) => {
				const lastLink = wrapper.find('div[role="tablist"]>button.checkbox-radio-switch:last-of-type')
				lastLink.trigger('keydown.page-up')
				expect(wrapper.emitted('update:active')[0]).toEqual(['first'])
			})
			it('emit "update:active" event with the last tab id when keydown pagedown is pressed', ({ wrapper }) => {
				const lastLink = wrapper.find('div[role="tablist"]>button.checkbox-radio-switch:last-of-type')
				lastLink.trigger('keydown.page-down')
				expect(wrapper.emitted('update:active')[0]).toEqual(['last'])
			})
			describe('when we select the first element', () => {
				beforeEach((ctx) => {
					ctx.wrapper.setData({ activeTab: 'first' })
				})
				it('does not emit "update:active" event when keydown left is pressed', ({ wrapper }) => {
					expect(wrapper.emitted('update:active')).toBeFalsy()
					const firstLink = wrapper.find('div[role="tablist"]>button.checkbox-radio-switch')
					firstLink.trigger('keydown.left')
					expect(wrapper.emitted('update:active')).toBeFalsy()
				})
				it('emit "update:active" event with the next tab id when keydown right is pressed', ({ wrapper }) => {
					const firstLink = wrapper.find('div[role="tablist"]>button.checkbox-radio-switch')
					firstLink.trigger('keydown.right')
					expect(wrapper.emitted('update:active')[0]).toEqual(['second'])
				})
			})
			describe('when we select the last element', () => {
				beforeEach((ctx) => {
					ctx.wrapper.setData({ activeTab: 'last' })
				})
				it('emit "update:active" event with the previous tab id when keydown left is pressed', ({ wrapper }) => {
					const lastLink = wrapper.find('div[role="tablist"]>button.checkbox-radio-switch:last-of-type')
					lastLink.trigger('keydown.left')
					expect(wrapper.emitted('update:active')[0]).toEqual(['second'])
				})
				it('does not emit "update:active" event when keydown right is pressed', ({ wrapper }) => {
					expect(wrapper.emitted('update:active')).toBeFalsy()
					const lastLink = wrapper.find('div[role="tablist"]>button.checkbox-radio-switch:last-of-type')
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
			it('does not display the tablist element', ({ wrapper }) => {
				expect(wrapper.find('div[role="tablist"]').exists()).toBe(false)
			})
		})
	})
})
