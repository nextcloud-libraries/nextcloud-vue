/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mergeProps, nextTick } from 'vue'
import NcAppSidebar from '../../../../src/components/NcAppSidebar/NcAppSidebar.vue'
import NcAppSidebarTab from '../../../../src/components/NcAppSidebarTab/NcAppSidebarTab.vue'

/**
 * Mount the sidebar with the real transition so the opened and closed events are emitted
 *
 * @param props - Additional props
 * @param attachTo - Element to attach the sidebar to
 */
function mountWithTransition(props: Record<string, unknown> = {}, attachTo?: HTMLElement) {
	return mount(NcAppSidebar, {
		props: { name: 'My file', noToggle: true, ...props },
		global: { stubs: { transition: false } },
		attachTo,
	})
}

describe('NcAppSidebar', () => {
	afterEach(() => {
		document.body.innerHTML = ''
	})

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

	describe('opened and closed events', () => {
		it('does not emit closed when unmounted without being opened', () => {
			const onClosed = vi.fn()
			const wrapper = mountWithTransition({ open: false, onClosed })
			wrapper.unmount()
			expect(onClosed).not.toHaveBeenCalled()
		})

		it('emits closed when unmounted while opened', async () => {
			const onClosed = vi.fn()
			const wrapper = mountWithTransition({ onClosed })
			await vi.waitFor(() => expect(wrapper.emitted('opened')).toHaveLength(1))
			wrapper.unmount()
			expect(onClosed).toHaveBeenCalledExactlyOnceWith()
		})

		it('does not emit closed again when unmounted after closing', async () => {
			const onClosed = vi.fn()
			const wrapper = mountWithTransition({ onClosed })
			await vi.waitFor(() => expect(wrapper.emitted('opened')).toHaveLength(1))
			await wrapper.setProps({ open: false })
			await vi.waitFor(() => expect(onClosed).toHaveBeenCalledOnce())
			wrapper.unmount()
			expect(onClosed).toHaveBeenCalledOnce()
		})
	})

	describe('focus return', () => {
		/**
		 * Render a menu with a focused menu item and return the sidebar container
		 *
		 * @param menuId - The id of the menu
		 */
		function setupMenu(menuId: string) {
			document.body.innerHTML = '<button id="trigger">Menu</button><div role="menu"><button id="item" role="menuitem">Open</button></div><div id="sidebar"></div>'
			document.getElementById('trigger')!.setAttribute('aria-controls', menuId)
			if (menuId) {
				document.querySelector('[role="menu"]')!.id = menuId
			}
			document.getElementById('item')!.focus()
			return document.getElementById('sidebar')!
		}

		it.each([
			['menu-1', 'trigger'],
			['menu"1', 'trigger'],
			['', 'item'],
		])('returns focus to the menu trigger (menu id: %j, focused: %s)', async (menuId, expectedFocus) => {
			const wrapper = mountWithTransition({}, setupMenu(menuId))
			await vi.waitFor(() => expect(wrapper.emitted('opened')).toHaveLength(1))
			await wrapper.setProps({ open: false })
			await vi.waitFor(() => expect(wrapper.emitted('closed')).toHaveLength(1))
			expect(document.activeElement?.id).toBe(expectedFocus)
			wrapper.unmount()
		})
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

		it('keeps the starred prop if the parent does not accept the change', async () => {
			const onUpdateStarred = vi.fn()
			const wrapper = mount(NcAppSidebar, {
				props: { name: 'My file', starred: false, 'onUpdate:starred': onUpdateStarred },
			})
			const star = wrapper.find('.app-sidebar-header__star')
			await star.trigger('click')
			expect(onUpdateStarred).toHaveBeenCalledExactlyOnceWith(true)
			expect(star.attributes('aria-pressed')).toBe('false')
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
			expect(wrapper.emitted('figureClick')).toHaveLength(2)
		})

		it('calls all merged figure-click listeners', async () => {
			const first = vi.fn()
			const second = vi.fn()
			const wrapper = mount(NcAppSidebar, {
				props: {
					name: 'My file',
					background: 'https://example.com/image.png',
					// listeners passed through a wrapper component are merged into an array
					...mergeProps({ onFigureClick: first }, { onFigureClick: second }),
				},
			})
			const figure = wrapper.find('.app-sidebar-header__figure')
			expect(figure.classes()).toContain('app-sidebar-header__figure--with-action')

			await figure.trigger('click')
			expect(first).toHaveBeenCalledOnce()
			expect(second).toHaveBeenCalledOnce()
		})

		it('supports a figure-click listener with the once modifier', async () => {
			const onFigureClickOnce = vi.fn()
			const wrapper = mount(NcAppSidebar, {
				props: { name: 'My file', background: 'https://example.com/image.png', onFigureClickOnce },
			})
			const figure = wrapper.find('.app-sidebar-header__figure')
			expect(figure.classes()).toContain('app-sidebar-header__figure--with-action')

			await figure.trigger('click')
			await figure.trigger('click')
			expect(onFigureClickOnce).toHaveBeenCalledOnce()
		})

		it('is marked as clickable when a figure-click listener is added later', async () => {
			const wrapper = mount(NcAppSidebar, {
				props: { name: 'My file', background: 'https://example.com/image.png' },
			})
			await wrapper.setProps({ onFigureClick: vi.fn() })
			expect(wrapper.find('.app-sidebar-header__figure').classes()).toContain('app-sidebar-header__figure--with-action')
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

		it('focuses the name input when it becomes editable', async () => {
			const wrapper = mount(NcAppSidebar, {
				props: { name: 'My file' },
				attachTo: document.body,
			})
			await wrapper.find('h2').trigger('click')
			await wrapper.setProps({ nameEditable: true })
			expect(document.activeElement).toBe(wrapper.find('input').element)
			wrapper.unmount()
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

		it('focuses tabs with ids that are not valid CSS identifiers', async () => {
			const wrapper = mount(NcAppSidebar, {
				props: { name: 'My file', active: 'files.versions' },
				slots: {
					default: [
						'<NcAppSidebarTab id="files.versions" name="Tab1" :order="1">Tab1</NcAppSidebarTab>',
						'<NcAppSidebarTab id="a:b" name="Tab2" :order="2">Tab2</NcAppSidebarTab>',
					].join(''),
				},
				global: {
					components: { NcAppSidebarTab },
				},
				attachTo: document.body,
			})
			await nextTick()

			wrapper.vm.focusActiveTabContent()
			expect(document.activeElement?.id).toBe('tab-files.versions')

			await wrapper.find('[role="tablist"]').trigger('keydown', { key: 'ArrowRight' })
			expect(document.activeElement?.id).toBe('tab-button-a:b')
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
