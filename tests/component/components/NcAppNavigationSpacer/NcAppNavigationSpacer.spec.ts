/**
 * SPDX-FileCopyrightText: Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import SpacedAppNaviation from './SpacedAppNavigation.story.vue'

test('it correctly spaces two elements', async ({ mount, page }) => {
	await mount(SpacedAppNaviation)

	const first = page.getByRole('link', { name: 'First' })
	const second = page.getByRole('link', { name: 'Second' })

	await expect(first).toBeVisible()
	await expect(second).toBeVisible()

	const firstRect = await first.boundingBox()
	const secondRect = await second.boundingBox()

	// Check that the second element is at least 17px below the first one (thats our spacer)
	expect(secondRect!.y - 17).toBeGreaterThanOrEqual(firstRect!.y + firstRect!.height)
})
