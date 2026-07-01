/*
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import { vi } from 'vitest'
import NcUploadPicker from './NcUploadPicker.story.vue'

vi.mock('@nextcloud/auth', () => ({
	getCurrentUser: () => ({ uid: 'testuser' }),
}))

test.describe('UploadPicker: "new"-menu', () => {
	test('without folder-upload enabled no menu is shown', async ({ mount, page }) => {
		mount(NcUploadPicker)

		const button = page.getByRole('button', { name: 'New' })
		await expect(button).toBeVisible()
		await button.click()

		await expect(page.getByRole('menu')).toHaveCount(0)
	})

	test('with folder-upload enabled a menu is shown', async ({ mount, page }) => {
		mount(NcUploadPicker, {
			props: {
				directory: true,
			},
		})

		const button = page.getByRole('button', { name: 'New' })
		await expect(button).toBeVisible()
		await button.click()

		const menu = page.getByRole('menu')
		await expect(menu).toBeVisible()
		await expect(menu.getByRole('menuitem')).toHaveCount(2)
	})

	test('can add custom menu entries', async ({ mount, page }) => {
		let clicked = false
		mount(NcUploadPicker, {
			props: {
				actions: [{
					label: 'Custom action',
					onClick: () => clicked = true,
				}],
			},
		})

		const button = page.getByRole('button', { name: 'New' })
		await expect(button).toBeVisible()
		await button.click()

		const menu = page.getByRole('menu')
		await expect(menu).toBeVisible()
		await expect(menu.getByRole('menuitem')).toHaveCount(2)
		await expect(menu.getByRole('menuitem', { name: 'Custom action' })).toBeVisible()
		await menu.getByRole('menuitem', { name: 'Custom action' }).click()
		expect(clicked).toBeTruthy()
	})
})
