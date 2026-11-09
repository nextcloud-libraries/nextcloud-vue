/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import NcDialog from '../../../src/components/NcDialog/NcDialog.vue'

test('Dialog is correctly labelled', async ({ mount, page }) => {
	await mount(NcDialog, {
		props: {
			open: true,
			name: 'My dialog',
		},
		slots: {
			default: 'Text',
		},
	})

	await expect(page.getByRole('dialog', { name: 'My dialog' })).toBeVisible()
})

test('Long dialog name wraps and does not overlap the close button', async ({ mount, page }) => {
	const name = 'Offenen Unterhaltungen beitreten, denen Sie noch nicht beigetreten sind'
	await mount(NcDialog, {
		props: {
			open: true,
			name,
		},
		slots: {
			default: 'Text',
		},
	})

	const heading = await page.getByRole('heading', { name }).boundingBox()
	const close = await page.getByRole('button', { name: 'Close' }).boundingBox()
	expect(heading!.x + heading!.width).toBeLessThanOrEqual(close!.x)
	expect(heading!.height).toBeGreaterThan(close!.height)
})
