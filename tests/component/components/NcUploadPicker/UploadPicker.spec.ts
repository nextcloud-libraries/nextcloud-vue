/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import NcUploadPickerStory from './NcUploadPicker.story.vue'

test('UploadPicker rendering', async ({ mount, page }) => {
	await mount(NcUploadPickerStory)
	await expect(page.getByRole('button', { name: 'New' })).toBeVisible()
})

test('UploadPicker: uploads a file', async ({ mount, page }) => {
	page.route('**/remote.php/dav/files/**', async (route) => {
		await route.fulfill({ status: 201 })
	})

	page.on('filechooser', async (fileChooser) => {
		await fileChooser.setFiles({
			name: 'image.jpg',
			mimeType: 'image/jpeg',
			buffer: Buffer.alloc(5 * 1024 * 1024), // 5 MB
		})
	})

	await mount(NcUploadPickerStory)
	const button = page.getByRole('button', { name: 'New' })
	await expect(button).toBeVisible()
	await button.click()

	const progress = page.getByRole('progressbar')
	await expect(progress).toBeVisible()
	await expect(button).not.toBeVisible()
})
