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

test('keeps its height while loading', async ({ mount }) => {
	const style = 'width: 300px'
	const loaded = await mount(NcStatsBlock, { props: { name: 'Documents', value: 12, style } })
	const height = (await loaded.boundingBox())!.height
	await loaded.unmount()

	const loading = await mount(NcStatsBlock, { props: { name: 'Documents', value: 12, loading: true, style } })
	expect((await loading.boundingBox())!.height).toBeCloseTo(height, 0)
})
