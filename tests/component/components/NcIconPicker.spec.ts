/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mdiAccountGroupOutline, mdiCalendarOutline, mdiEmailOutline, mdiFolderOutline, mdiHomeOutline, mdiStarOutline, mdiTagOutline } from '@mdi/js'
import { expect, test } from '@playwright/experimental-ct-vue'
import NcIconPicker from '../../../src/components/NcIconPicker/NcIconPicker.vue'

const icons = [
	{ name: 'account-group', path: mdiAccountGroupOutline, label: 'Team', aliases: ['people'] },
	{ name: 'calendar', path: mdiCalendarOutline, label: 'Calendar' },
	{ name: 'email', path: mdiEmailOutline, label: 'Email', aliases: ['mail'] },
	{ name: 'folder', path: mdiFolderOutline, label: 'Folder' },
	{ name: 'home', path: mdiHomeOutline, label: 'Home' },
	{ name: 'star', path: mdiStarOutline, label: 'Star', aliases: ['favorite'] },
	{ name: 'tag', path: mdiTagOutline, label: 'Tag' },
]

/**
 * Mount the picker with a trigger button and open it.
 *
 * @param mount - The mount fixture
 * @param page - The page
 * @param props - More props
 */
async function openPicker(mount, page, props = {}) {
	const picked: string[] = []
	await mount(NcIconPicker, {
		props: { icons, ...props },
		slots: { default: '<button type="button">Pick an icon</button>' },
		on: { select: (name: string) => picked.push(name) },
	})
	await page.getByRole('button', { name: 'Pick an icon' }).click()
	await expect(page.getByRole('dialog', { name: 'Icon picker' })).toBeVisible()
	return picked
}

test('shows the icons as options and picks one on click, then closes', async ({ mount, page }) => {
	const picked = await openPicker(mount, page)
	const options = page.getByRole('option')
	await expect(options).toHaveCount(icons.length)
	await page.getByRole('option', { name: 'Email' }).click()
	expect(picked).toEqual(['email'])
	await expect(page.getByRole('dialog', { name: 'Icon picker' })).toBeHidden()
})

test('stays open after a pick with keepOpen', async ({ mount, page }) => {
	const picked = await openPicker(mount, page, { keepOpen: true })
	await page.getByRole('option', { name: 'Star' }).click()
	expect(picked).toEqual(['star'])
	await expect(page.getByRole('dialog', { name: 'Icon picker' })).toBeVisible()
})

test('marks the picked icon as selected', async ({ mount, page }) => {
	await openPicker(mount, page, { modelValue: 'folder' })
	await expect(page.getByRole('option', { name: 'Folder' })).toHaveAttribute('aria-selected', 'true')
	await expect(page.getByRole('option', { name: 'Home' })).toHaveAttribute('aria-selected', 'false')
})

test('finds icons by name, label and alias', async ({ mount, page }) => {
	await openPicker(mount, page)
	const search = page.getByRole('searchbox', { name: 'Search icons' })

	for (const [text, name] of [['account', 'Team'], ['MAIL', 'Email'], ['favorite', 'Star']]) {
		await search.fill(text)
		await expect(page.getByRole('option')).toHaveCount(1)
		await expect(page.getByRole('option')).toHaveAccessibleName(name)
	}

	await search.fill('nothing like this')
	await expect(page.getByRole('option')).toHaveCount(0)
	// The visible message, besides the announcement for assistive technology
	await expect(page.locator('.empty-content')).toContainText('No icons found')
})

test('moves through the icons with the keyboard and picks one with Enter', async ({ mount, page }) => {
	const picked = await openPicker(mount, page, { modelValue: 'calendar' })
	await page.getByRole('searchbox', { name: 'Search icons' }).focus()

	// Into the icons, onto the picked one
	await page.keyboard.press('ArrowDown')
	await expect(page.getByRole('option', { name: 'Calendar' })).toBeFocused()

	await page.keyboard.press('ArrowRight')
	await expect(page.getByRole('option', { name: 'Email' })).toBeFocused()

	// Six icons in a row
	await page.keyboard.press('ArrowDown')
	await expect(page.getByRole('option', { name: 'Tag' })).toBeFocused()
	await page.keyboard.press('ArrowUp')
	await expect(page.getByRole('option', { name: 'Team' })).toBeFocused()

	await page.keyboard.press('End')
	await expect(page.getByRole('option', { name: 'Tag' })).toBeFocused()
	await page.keyboard.press('Home')
	await expect(page.getByRole('option', { name: 'Team' })).toBeFocused()
	expect(picked).toEqual([])

	await page.keyboard.press('Enter')
	expect(picked).toEqual(['account-group'])
})

test('picks the focused icon with Space', async ({ mount, page }) => {
	const picked = await openPicker(mount, page)
	await page.getByRole('searchbox', { name: 'Search icons' }).focus()
	await page.keyboard.press('ArrowDown')
	await page.keyboard.press(' ')
	expect(picked).toEqual(['account-group'])
})

test('has a single tab stop in the icons', async ({ mount, page }) => {
	await openPicker(mount, page, { modelValue: 'home' })
	await page.getByRole('searchbox', { name: 'Search icons' }).focus()
	await page.keyboard.press('Tab')
	await expect(page.getByRole('option', { name: 'Home' })).toBeFocused()
})
