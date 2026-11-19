/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { NcIconPickerIcon } from '../../../../src/components/NcIconPicker/NcIconPicker.vue'

import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import NcIconPicker from '../../../../src/components/NcIconPicker/NcIconPicker.vue'

const icons: NcIconPickerIcon[] = [
	{ name: 'account-group', path: 'M1 1h22v22H1z', label: 'Team', aliases: ['people'] },
	{ name: 'calendar', path: 'M2 2h20v20H2z' },
	{ name: 'email', path: 'M3 3h18v18H3z', label: 'Email', aliases: ['mail'] },
	{ name: 'folder', path: 'M4 4h16v16H4z', label: 'Folder' },
	{ name: 'home', path: 'M5 5h14v14H5z', label: 'Home' },
	{ name: 'star', path: 'M6 6h12v12H6z', label: 'Star' },
	{ name: 'tag', path: 'M7 7h10v10H7z', label: 'Tag' },
]

let wrapper: ReturnType<typeof mount<typeof NcIconPicker>> | undefined

/**
 * Mount the picker open, with working models, and wait for its popover.
 *
 * @param props - More props
 */
async function mountOpen(props: Record<string, unknown> = {}) {
	const mounted = mount(NcIconPicker, {
		props: {
			icons,
			open: true,
			'onUpdate:open': (open: unknown) => mounted.setProps({ open: open as boolean }),
			'onUpdate:modelValue': (name: unknown) => mounted.setProps({ modelValue: name as string }),
			...props,
		},
		slots: { default: () => h('button', { type: 'button' }, 'Pick an icon') },
		attachTo: document.body,
	})
	wrapper = mounted
	await vi.waitUntil(() => document.querySelector('input[type="search"]'))
	await flushPromises()
	return mounted
}

const options = () => [...document.querySelectorAll<HTMLElement>('[role="option"]')]
const search = () => document.querySelector<HTMLInputElement>('input[type="search"]')!

/**
 * Press a key on an element.
 *
 * @param element - The element
 * @param key - The key
 */
async function press(element: Element, key: string) {
	element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
	await nextTick()
	await nextTick()
}

/**
 * Type into the search field.
 *
 * @param text - The text
 */
async function type(text: string) {
	search().value = text
	search().dispatchEvent(new Event('input'))
	await nextTick()
}

describe('NcIconPicker', () => {
	afterEach(() => {
		wrapper?.unmount()
		wrapper = undefined
		document.body.innerHTML = ''
	})

	it('renders a labeled option per icon, named by the label or else the name', async () => {
		await mountOpen()
		expect(document.querySelector('[role="listbox"]')?.getAttribute('aria-label')).toBe('Icons')
		expect(options().map((option) => option.getAttribute('aria-label'))).toEqual(['Team', 'calendar', 'Email', 'Folder', 'Home', 'Star', 'Tag'])
		expect(options()[0].querySelector('path')?.getAttribute('d')).toBe('M1 1h22v22H1z')
	})

	it('marks the picked icon and only lets it be reached with Tab', async () => {
		await mountOpen({ modelValue: 'folder' })
		expect(options().map((option) => option.getAttribute('aria-selected'))).toEqual(['false', 'false', 'false', 'true', 'false', 'false', 'false'])
		expect(options().map((option) => option.tabIndex)).toEqual([-1, -1, -1, 0, -1, -1, -1])
	})

	it('lets the first icon be reached with Tab when none is picked', async () => {
		await mountOpen()
		expect(options()[0].tabIndex).toBe(0)
	})

	it('picks an icon on click, emits it and closes', async () => {
		const wrapper = await mountOpen()
		options()[2].click()
		await nextTick()
		expect(wrapper.emitted('select')).toEqual([['email']])
		expect(wrapper.emitted('update:modelValue')).toEqual([['email']])
		expect(wrapper.emitted('update:open')).toEqual([[false]])
	})

	it('stays open after a pick with keepOpen', async () => {
		const wrapper = await mountOpen({ keepOpen: true })
		options()[2].click()
		await nextTick()
		expect(wrapper.emitted('select')).toEqual([['email']])
		expect(wrapper.emitted('update:open')).toBeUndefined()
	})

	it('finds icons by every word of the search, in the name, label and aliases', async () => {
		await mountOpen()
		await type('account')
		expect(options().map((option) => option.getAttribute('aria-label'))).toEqual(['Team'])

		await type('MAIL')
		expect(options().map((option) => option.getAttribute('aria-label'))).toEqual(['Email'])

		await type('account people')
		expect(options().map((option) => option.getAttribute('aria-label'))).toEqual(['Team'])

		await type('  ')
		expect(options()).toHaveLength(icons.length)
	})

	it('shows that no icons were found', async () => {
		await mountOpen()
		await type('nothing like this')
		expect(options()).toHaveLength(0)
		expect(document.body.textContent).toContain('No icons found')

		// The arrow down key has nothing to move to
		await press(search(), 'ArrowDown')
		expect(document.activeElement).not.toBe(null)
	})

	it('announces the number of icons found while searching', async () => {
		await mountOpen()
		const live = () => document.querySelector('[role="dialog"] p[aria-live="polite"]')!.textContent!.trim()
		expect(live()).toBe('')

		await type('mail')
		expect(live()).toBe('1 icon found')

		// Team (by its name and alias), folder and home
		await type('o')
		expect(live()).toBe('3 icons found')

		await type('nothing like this')
		expect(live()).toBe('No icons found')
	})

	it('only points the search field at the icons while they are shown', async () => {
		await mountOpen()
		const listId = document.querySelector('[role="listbox"]')!.id
		expect(search().getAttribute('aria-controls')).toBe(listId)

		await type('nothing like this')
		expect(search().hasAttribute('aria-controls')).toBe(false)
	})

	it('moves from the first row of icons back up to the search field', async () => {
		await mountOpen()
		options()[2].focus()
		await press(options()[2], 'ArrowUp')
		expect(document.activeElement).toBe(search())
	})

	it('moves from the search into the icons, onto the picked one', async () => {
		await mountOpen({ modelValue: 'home' })
		search().focus()
		await press(search(), 'ArrowDown')
		expect(document.activeElement?.getAttribute('aria-label')).toBe('Home')
	})

	it('moves between the icons with the arrow keys, Home and End, and stops at the edges', async () => {
		await mountOpen()
		const focused = () => document.activeElement?.getAttribute('aria-label')
		options()[0].focus()

		await press(options()[0], 'ArrowLeft')
		expect(focused()).toBe('Team')
		await press(options()[0], 'ArrowRight')
		expect(focused()).toBe('calendar')
		await press(options()[1], 'ArrowDown')
		expect(focused()).toBe('Tag')
		await press(options()[6], 'ArrowDown')
		expect(focused()).toBe('Tag')
		await press(options()[6], 'ArrowUp')
		expect(focused()).toBe('Team')
		await press(options()[0], 'End')
		expect(focused()).toBe('Tag')
		await press(options()[6], 'Home')
		expect(focused()).toBe('Team')
		expect(options()[0].tabIndex).toBe(0)
	})

	it('picks the focused icon with Enter or Space and ignores keys with a modifier', async () => {
		const wrapper = await mountOpen({ keepOpen: true })
		options()[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true, bubbles: true }))
		expect(wrapper.emitted('select')).toBeUndefined()

		await press(options()[1], 'Enter')
		await press(options()[3], ' ')
		expect(wrapper.emitted('select')).toEqual([['calendar'], ['folder']])
	})

	it('starts with an empty search each time it opens', async () => {
		const wrapper = await mountOpen()
		await type('mail')
		await wrapper.setProps({ open: false })
		await wrapper.setProps({ open: true })
		await flushPromises()
		expect(search().value).toBe('')
		expect(options()).toHaveLength(icons.length)
	})
})
