/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mdiFileDocumentOutline } from '@mdi/js'
import { expect, test } from '@playwright/experimental-ct-vue'
import NcStatsBlock from '../../../src/components/NcStatsBlock/NcStatsBlock.vue'

for (const value of [42, 1234567]) {
	test(`shows the whole name and keeps ${value} inside a narrow cell`, async ({ mount, page }) => {
		const block = await mount(NcStatsBlock, {
			props: {
				name: 'Open cases past deadline',
				value,
				label: 'this year',
				iconPath: mdiFileDocumentOutline,
				style: 'width: 180px',
			},
		})
		const cell = (await block.boundingBox())!
		const name = page.getByText('Open cases past deadline')
		expect(await name.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true)

		for (const part of [name, page.getByText(new Intl.NumberFormat('en').format(value))]) {
			const box = (await part.boundingBox())!
			expect(box.x + box.width).toBeLessThanOrEqual(cell.x + cell.width)
		}
	})
}

test('keeps a name with a long word next to the icon', async ({ mount, page }) => {
	const block = await mount(NcStatsBlock, {
		props: {
			name: 'Documentsandattachments of this year',
			value: 12,
			iconPath: mdiFileDocumentOutline,
			style: 'width: 220px',
		},
	})
	const icon = (await block.locator('svg').boundingBox())!
	const name = (await page.getByText('Documentsandattachments of this year').boundingBox())!
	expect(name.x).toBeGreaterThan(icon.x + icon.width)
})

test('hyphenates a long word in the name and the label by the rules of the language', async ({ mount, page }) => {
	await mount(NcStatsBlock, {
		props: { name: 'Donaudampfschifffahrtsgesellschaft', value: 7, label: 'Schifffahrtsgesellschaften', lang: 'de', style: 'width: 160px' },
	})
	for (const text of ['Donaudampfschifffahrtsgesellschaft', 'Schifffahrtsgesellschaften']) {
		await expect(page.getByText(text)).toHaveCSS('hyphens', 'auto')
	}
})

test('wraps a long label instead of cutting it off', async ({ mount, page }) => {
	const block = await mount(NcStatsBlock, {
		props: {
			name: 'Documents',
			value: 12,
			label: 'added since the start of this year',
			iconPath: mdiFileDocumentOutline,
			style: 'width: 180px',
		},
	})
	const cell = (await block.boundingBox())!
	const label = page.getByText('added since the start of this year')
	expect(await label.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true)
	const box = (await label.boundingBox())!
	expect(box.x + box.width).toBeLessThanOrEqual(cell.x + cell.width)
})

test('keeps its height while loading', async ({ mount }) => {
	const style = 'width: 300px'
	const loaded = await mount(NcStatsBlock, { props: { name: 'Documents', value: 12, style } })
	const height = (await loaded.boundingBox())!.height
	await loaded.unmount()

	const loading = await mount(NcStatsBlock, { props: { name: 'Documents', value: 12, loading: true, style } })
	expect((await loading.boundingBox())!.height).toBeCloseTo(height, 0)
})
