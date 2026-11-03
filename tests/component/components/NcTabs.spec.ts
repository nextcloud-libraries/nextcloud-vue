/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import NcTabs from '../../../src/components/NcTabs/NcTabs.vue'

const tabs = [
	{ id: 'details', name: 'Details' },
	{ id: 'comments', name: 'Comments' },
]

test('leaves room in the scrolling row for the focus outline of a tab', async ({ mount, page }) => {
	await mount(NcTabs, { props: { tabs, modelValue: 'details', ariaLabel: 'Document' } })
	await page.keyboard.press('Tab')
	const tab = page.getByRole('tab', { name: 'Details' })
	await expect(tab).toBeFocused()

	const [list, focused] = await Promise.all([
		page.getByRole('tablist').boundingBox(),
		tab.boundingBox(),
	])
	// The outline is 2px wide, 2px away from the tab
	expect(focused!.y - list!.y).toBeGreaterThanOrEqual(4)
	expect(focused!.x - list!.x).toBeGreaterThanOrEqual(4)
})

for (const key of ['Enter', ' ']) {
	test(`selects the focused tab with ${key === ' ' ? 'Space' : key}, not with the arrow keys`, async ({ mount, page }) => {
		const selected: string[] = []
		await mount(NcTabs, {
			props: { tabs, modelValue: 'details', ariaLabel: 'Document' },
			on: { 'update:modelValue': (id: string) => selected.push(id) },
		})
		await page.keyboard.press('Tab')
		await page.keyboard.press('ArrowRight')
		await expect(page.getByRole('tab', { name: 'Comments' })).toBeFocused()
		expect(selected).toEqual([])

		await page.keyboard.press(key)
		await expect.poll(() => selected).toEqual(['comments'])
	})
}

test('reaches a disabled tab with the arrow keys and shows its focus outline in full', async ({ mount, page }) => {
	await mount(NcTabs, {
		props: { tabs: [...tabs, { id: 'history', name: 'History', disabled: true }], modelValue: 'details', ariaLabel: 'Document' },
	})
	await page.keyboard.press('Tab')
	await page.keyboard.press('End')
	const history = page.getByRole('tab', { name: 'History' })
	await expect(history).toBeFocused()
	await expect(history).toHaveCSS('opacity', '1')
	await expect(history).toHaveCSS('outline-style', 'solid')
})

test('marks the selected tab in forced colors', async ({ mount, page }) => {
	await page.emulateMedia({ forcedColors: 'active' })
	await mount(NcTabs, { props: { tabs, modelValue: 'details', ariaLabel: 'Document' } })
	const bar = (name: string) => page.getByRole('tab', { name }).evaluate((element) => getComputedStyle(element, '::after').backgroundColor)
	const canvas = await page.evaluate(() => {
		const probe = document.createElement('div')
		probe.style.backgroundColor = 'Canvas'
		document.body.append(probe)
		return getComputedStyle(probe).backgroundColor
	})
	expect(await bar('Details')).not.toBe(canvas)
	expect(await bar('Details')).not.toBe(await bar('Comments'))
})
