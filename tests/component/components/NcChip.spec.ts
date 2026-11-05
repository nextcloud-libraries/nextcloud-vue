/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import NcChip from '../../../src/components/NcChip/NcChip.vue'

test('the close button of a small chip can be clicked on 24px without making the chip taller', async ({ mount, page }) => {
	const chip = await mount(NcChip, { props: { text: 'Small', size: 'small' } })
	const button = page.getByRole('button')
	// Rounded, as Firefox measures the 24px button as 23.999996px
	const box = await button.boundingBox()
	expect(Math.round(box!.width)).toBeGreaterThanOrEqual(24)
	expect(Math.round(box!.height)).toBeGreaterThanOrEqual(24)
	await expect(chip).toHaveCSS('height', '20px')
})

test('the close button of a small chip stays round', async ({ mount, page }) => {
	await mount(NcChip, { props: { text: 'Small', size: 'small' } })
	await expect(page.getByRole('button')).toHaveCSS('border-radius', '12px')
})
