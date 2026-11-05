/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import NcActions from './NcActions.story.vue'

test('menu uses the container radius and its items the element radius', async ({ mount, page }) => {
	await mount(NcActions)
	await page.getByRole('button', { name: 'Actions' }).click()

	const menu = page.getByRole('menu')
	await expect(menu).toBeVisible()
	await expect(page.locator('.action-item__popper .v-popper__wrapper')).toHaveCSS('border-radius', '12px')
	await expect(page.locator('.action-item__popper .v-popper__inner')).toHaveCSS('border-radius', '12px')

	const item = menu.locator('li.action').filter({ hasText: 'Edit' })
	await item.hover()
	await expect(item).toHaveCSS('border-radius', '8px')
})
