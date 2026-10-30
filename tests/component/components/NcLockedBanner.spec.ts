/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import NcLockedBanner from '../../../src/components/NcLockedBanner/NcLockedBanner.vue'

test('shows the expiry of someone else\'s lock in the text color of the banner', async ({ mount, page }) => {
	const banner = await mount(NcLockedBanner, { props: { lockedBy: 'Jane Doe', expiresAt: Date.now() + 20 * 60 * 1000 } })
	const color = await banner.evaluate((element) => getComputedStyle(element).color)
	await expect(page.getByText('The lock expires in 20 minutes')).toHaveCSS('color', color)
})

test('shows the expiry of the user\'s own lock in the softer grey', async ({ mount, page }) => {
	const banner = await mount(NcLockedBanner, { props: { lockedByMe: true, expiresAt: Date.now() + 20 * 60 * 1000 } })
	const color = await banner.evaluate((element) => getComputedStyle(element).color)
	await expect(page.getByText('The lock expires in 20 minutes')).not.toHaveCSS('color', color)
})
