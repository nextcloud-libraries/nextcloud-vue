/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import NcAppSidebar from '../../../../src/components/NcAppSidebar/NcAppSidebar.vue'
import NcAppSidebarTab from '../../../../src/components/NcAppSidebarTab/NcAppSidebarTab.vue'

describe('NcAppSidebar', () => {
	it('renders the name as header', () => {
		const wrapper = mount(NcAppSidebar, {
			props: { name: 'My file' },
		})
		expect(wrapper.find('h2').text()).toBe('My file')
	})

	it('emits close and update:open when the close button is clicked', async () => {
		const wrapper = mount(NcAppSidebar, {
			props: { name: 'My file' },
		})
		await wrapper.find('.app-sidebar__close').trigger('click')
		expect(wrapper.emitted('close')).toHaveLength(1)
		expect(wrapper.emitted('update:open')).toEqual([[false]])
	})

	it('emits closed when unmounted', () => {
		const wrapper = mount(NcAppSidebar, {
			props: { name: 'My file' },
		})
		wrapper.unmount()
		expect(wrapper.emitted('closed')).toHaveLength(1)
	})

	describe('starred', () => {
		it('does not show the favorite button by default', () => {
			const wrapper = mount(NcAppSidebar, {
				props: { name: 'My file' },
			})
			expect(wrapper.find('.app-sidebar-header__star').exists()).toBe(false)
		})

		it('toggles the starred state locally and emits it', async () => {
			const wrapper = mount(NcAppSidebar, {
				props: { name: 'My file', starred: false },
			})
			const star = wrapper.find('.app-sidebar-header__star')
			expect(star.attributes('aria-pressed')).toBe('false')

			await star.trigger('click')
			expect(wrapper.emitted('update:starred')).toEqual([[true]])
			expect(star.attributes('aria-pressed')).toBe('true')
		})

		it('follows the starred prop', async () => {
			const wrapper = mount(NcAppSidebar, {
				props: { name: 'My file', starred: false },
			})
			await wrapper.setProps({ starred: true })
			expect(wrapper.find('.app-sidebar-header__star').attributes('aria-pressed')).toBe('true')
		})
	})

	describe('figure', () => {
		it('is not marked as clickable without a figure-click listener', () => {
			const wrapper = mount(NcAppSidebar, {
				props: { name: 'My file', background: 'https://example.com/image.png' },
			})
			const figure = wrapper.find('.app-sidebar-header__figure')
			expect(figure.exists()).toBe(true)
			expect(figure.classes()).not.toContain('app-sidebar-header__figure--with-action')
		})

		it('is marked as clickable and calls the figure-click listener', async () => {
			const onFigureClick = vi.fn()
			const wrapper = mount(NcAppSidebar, {
				props: { name: 'My file', background: 'https://example.com/image.png', onFigureClick },
			})
			const figure = wrapper.find('.app-sidebar-header__figure')
			expect(figure.classes()).toContain('app-sidebar-header__figure--with-action')

			await figure.trigger('click')
			await figure.trigger('keydown', { key: 'Enter' })
			expect(onFigureClick).toHaveBeenCalledTimes(2)
		})
	})

	describe('editable name', () => {
		it('requests to edit the name when clicking the name', async () => {
			const wrapper = mount(NcAppSidebar, {
				props: { name: 'My file' },
			})
			await wrapper.find('h2').trigger('click')
			expect(wrapper.emitted('update:nameEditable')).toEqual([[true]])
		})

		it('emits the new name on input and submits it', async () => {
			const wrapper = mount(NcAppSidebar, {
				props: { name: 'My file', nameEditable: true },
			})
			const input = wrapper.find('input')
			await input.setValue('New name')
			expect(wrapper.emitted('update:name')).toEqual([['New name']])

			await wrapper.find('form').trigger('submit')
			expect(wrapper.emitted('update:nameEditable')).toEqual([[false]])
			expect(wrapper.emitted('submitName')).toHaveLength(1)
		})

		it('dismisses editing on escape', async () => {
			const wrapper = mount(NcAppSidebar, {
				props: { name: 'My file', nameEditable: true },
			})
			await wrapper.find('input').trigger('keydown', { key: 'Escape' })
			expect(wrapper.emitted('update:nameEditable')).toEqual([[false]])
			expect(wrapper.emitted('dismissEditing')).toHaveLength(1)
		})
	})

	describe('tabs', () => {
		it('forwards the active tab', async () => {
			const wrapper = mount(NcAppSidebar, {
				props: { name: 'My file', active: 'first' },
				slots: {
					default: [
						'<NcAppSidebarTab id="first" name="Tab1">Tab1</NcAppSidebarTab>',
						'<NcAppSidebarTab id="second" name="Tab2">Tab2</NcAppSidebarTab>',
					].join(''),
				},
				global: {
					components: { NcAppSidebarTab },
				},
			})
			await nextTick()

			await wrapper.findAll('[role="tab"]')[1]!.trigger('click')
			expect(wrapper.emitted('update:active')).toEqual([['second']])
		})

		it('exposes a method to focus the active tab content', async () => {
			const wrapper = mount(NcAppSidebar, {
				props: { name: 'My file', active: 'second' },
				slots: {
					default: [
						'<NcAppSidebarTab id="first" name="Tab1">Tab1</NcAppSidebarTab>',
						'<NcAppSidebarTab id="second" name="Tab2">Tab2</NcAppSidebarTab>',
					].join(''),
				},
				global: {
					components: { NcAppSidebarTab },
				},
				attachTo: document.body,
			})
			await nextTick()

			wrapper.vm.focusActiveTabContent()
			expect(document.activeElement?.id).toBe('tab-second')
			wrapper.unmount()
		})
	})

	it('exposes a method to focus the header', () => {
		const wrapper = mount(NcAppSidebar, {
			props: { name: 'My file' },
			attachTo: document.body,
		})
		wrapper.vm.focus()
		expect(document.activeElement).toBe(wrapper.find('h2').element)
		wrapper.unmount()
	})
})
