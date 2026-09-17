/*
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import NcUploadPicker from './NcUploadPicker.story.vue'

const iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" /></svg>'

test.describe('UploadPicker: "new"-menu', () => {
	test('without folder-upload enabled no menu is shown', async ({ mount, page }) => {
		await mount(NcUploadPicker)

		const button = page.getByRole('button', { name: 'New' })
		await expect(button).toBeVisible()
		await button.click()

		await expect(page.getByRole('menu')).toHaveCount(0)
	})

	test('with folder-upload enabled a menu is shown', async ({ mount, page }) => {
		await mount(NcUploadPicker, {
			props: {
				directory: true,
			},
		})

		const button = page.getByRole('button', { name: 'New' })
		await expect(button).toBeVisible()
		await button.click()

		const menu = page.getByRole('menu', { name: 'New' })
		await expect(menu).toBeVisible()
		await expect(menu.getByRole('menuitem')).toHaveCount(2)
		await expect(menu.getByRole('menuitem', { name: 'Upload file' })).toBeVisible()
		await expect(menu.getByRole('menuitem', { name: 'Upload folder' })).toBeVisible()
	})

	test('the entry for uploading files matches the requested mode', async ({ mount, page }) => {
		await mount(NcUploadPicker, {
			props: {
				directory: true,
				multiple: true,
			},
		})

		await page.getByRole('button', { name: 'New' }).click()

		const menu = page.getByRole('menu', { name: 'New' })
		await expect(menu.getByRole('menuitem', { name: 'Upload files' })).toBeVisible()
	})

	test('can add custom menu entries', async ({ mount, page }) => {
		let clicked = false
		await mount(NcUploadPicker, {
			props: {
				actions: [{
					iconSvg,
					label: 'Custom action',
					onClick: () => clicked = true,
				}],
			},
		})

		const button = page.getByRole('button', { name: 'New' })
		await expect(button).toBeVisible()
		await button.click()

		const menu = page.getByRole('menu', { name: 'New' })
		await expect(menu).toBeVisible()
		await expect(menu.getByRole('menuitem')).toHaveCount(2)
		await expect(menu.getByRole('menuitem', { name: 'Custom action' })).toBeVisible()
		await menu.getByRole('menuitem', { name: 'Custom action' }).click()
		expect(clicked).toBeTruthy()
	})

	test('groups custom menu entries by their caption', async ({ mount, page }) => {
		await mount(NcUploadPicker, {
			props: {
				actions: [{
					caption: 'From another app',
					actions: [
						{ iconSvg, label: 'First action', onClick: () => {} },
						{ iconSvg, label: 'Second action', onClick: () => {} },
					],
				}],
			},
		})

		await page.getByRole('button', { name: 'New' }).click()

		const menu = page.getByRole('menu', { name: 'New' })
		// The local file upload is separated from the actions of the app
		await expect(menu.getByText('Upload from device')).toBeVisible()
		await expect(menu.getByText('From another app')).toBeVisible()
		await expect(menu.getByRole('menuitem')).toHaveCount(3)
	})
})
