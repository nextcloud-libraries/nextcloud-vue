/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import { vi } from 'vitest'
import NcUploadPickerStory from './NcUploadPicker.story.vue'

vi.mock('@nextcloud/auth', () => ({
	getCurrentUser: () => ({ uid: 'testuser' }),
}))

test('UploadPicker rendering', async ({ mount, page }) => {
	await mount(NcUploadPickerStory)
	await expect(page.getByRole('button', { name: 'New' })).toBeVisible()
})

test('UploadPicker: uploads a file', async ({ mount, page }) => {
	const promiseFilepicker = Promise.withResolvers<void>()
	const promiseUpload = Promise.withResolvers<void>()

	page.route('**/remote.php/dav/files/**', async (route) => {
		promiseFilepicker.resolve()
		await promiseUpload.promise
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

	await promiseFilepicker.promise
	const progress = page.getByRole('progressbar')
	await expect(progress).toBeVisible()
	await expect(button).not.toBeVisible()
	promiseUpload.resolve()
})
