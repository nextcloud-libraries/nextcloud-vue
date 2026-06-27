/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import NcUploadPickerStory from './NcUploadPicker.story.vue'
import { createFile, mockDav, pickFiles } from './upload-helpers.ts'

/** The upload of a file was cancelled */
const UPLOAD_CANCELLED = 5

test.describe('NcUploadPicker: cancelling uploads', () => {
	test.skip(({ browserName }) => browserName === 'webkit', 'WebKit does not support file pickers in Playwright yet')

	test('cancels a running upload', async ({ mount, page }) => {
		const finished: { source: string, status: number }[] = []
		const dav = await mockDav(page, { hold: ({ method }) => method === 'PUT' })
		await mount(NcUploadPickerStory, {
			on: { 'upload:finished': (upload) => finished.push(upload) },
		})

		await pickFiles(page, createFile('file.txt', 5))
		await dav.waitFor('PUT')

		await page.getByRole('button', { name: 'Cancel uploads' }).click()

		await expect(page.getByRole('progressbar')).toBeHidden()
		await expect(page.getByRole('button', { name: 'Cancel uploads' })).toBeHidden()
		await expect.poll(() => finished.find(({ source }) => source.endsWith('/file.txt')))
			.toMatchObject({ status: UPLOAD_CANCELLED })
	})

	test('cancels a chunked upload before the chunks are assembled', async ({ mount, page }) => {
		const dav = await mockDav(page, { hold: ({ method, path }) => method === 'PUT' && path.startsWith('/uploads/') })
		await mount(NcUploadPickerStory)

		// 15 MiB with a chunk size of 10 MiB results in two chunks
		await pickFiles(page, createFile('big-file.txt', 15))
		await dav.waitFor('PUT', { count: 2 })

		await page.getByRole('button', { name: 'Cancel uploads' }).click()

		await expect(page.getByRole('progressbar')).toBeHidden()
		// The chunks are never assembled into the destination file
		expect(dav.received('MOVE')).toHaveLength(0)
	})

	test('can upload again after cancelling', async ({ mount, page }) => {
		const dav = await mockDav(page, { hold: ({ method }) => method === 'PUT' })
		await mount(NcUploadPickerStory)

		await pickFiles(page, createFile('file.txt', 5))
		await dav.waitFor('PUT')
		await page.getByRole('button', { name: 'Cancel uploads' }).click()
		await expect(page.getByRole('progressbar')).toBeHidden()

		dav.releaseAll()
		await pickFiles(page, createFile('file.txt', 5))

		const uploads = await dav.waitFor('PUT', { count: 2 })
		expect(uploads.at(-1)!.path).toBe('/files/test/Folder/file.txt')
		await expect(page.getByRole('progressbar')).toBeHidden()
	})
})
