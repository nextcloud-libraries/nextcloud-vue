/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import NcUploadPickerStory from './NcUploadPicker.story.vue'
import { createFile, mockDav, pickFiles, skipWithoutFilePicker, UploadStatus } from './upload-helpers.ts'

test.describe('NcUploadPicker: cancelling uploads', () => {
	skipWithoutFilePicker()

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
			.toMatchObject({ status: UploadStatus.CANCELLED })
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
		await dav.expectNoMore('MOVE')
	})

	test('cancels uploads that are queued while paused', async ({ mount, page }) => {
		const dav = await mockDav(page)
		await mount(NcUploadPickerStory, { props: { startPaused: true } })

		await pickFiles(page, createFile('file.txt', 5))
		await expect(page.getByRole('progressbar')).toBeVisible()

		await page.getByRole('button', { name: 'Cancel uploads' }).click()

		// The queue is emptied, so the uploader is neither uploading nor paused anymore
		await expect(page.getByRole('progressbar')).toBeHidden()
		await expect(page.getByText('paused')).toBeHidden()
		await dav.expectNoMore('PUT')
		expect(dav.requests).toHaveLength(0)
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
