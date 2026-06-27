/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import NcUploadPickerStory from './NcUploadPicker.story.vue'
import { createFile, mockDav, pickFiles } from './upload-helpers.ts'

test.describe('NcUploadPicker: progress', () => {
	test.skip(({ browserName }) => browserName === 'webkit', 'WebKit does not support file pickers in Playwright yet')

	test('shows that the remaining time is unknown when the upload starts', async ({ mount, page }) => {
		const dav = await mockDav(page, { hold: ({ method }) => method === 'PUT' })
		await mount(NcUploadPickerStory)

		await pickFiles(page, createFile('file.txt', 5))
		await dav.waitFor('PUT')

		await expect(page.getByText('Estimating …')).toBeVisible()

		dav.releaseAll()
		await expect(page.getByRole('progressbar')).toBeHidden()
	})

	test('increases the progress with every uploaded file', async ({ mount, page }) => {
		const dav = await mockDav(page, { hold: ({ method }) => method === 'PUT' })
		// Upload one file after the other to have a deterministic progress
		await mount(NcUploadPickerStory, { props: { multiple: true, maxParallelUploads: 1 } })

		await pickFiles(page, createFile('first.txt', 1), createFile('second.txt', 1))

		const progress = page.getByRole('progressbar')
		await expect(progress).toBeVisible()
		await expect(progress).toHaveAttribute('value', '0')

		// Finish the first of the two equally sized files
		const [first] = await dav.waitFor('PUT')
		first.respond()

		await expect(progress).toHaveAttribute('value', '50')

		dav.releaseAll()
		await expect(progress).toBeHidden()
	})

	test('shows the assembling state while the chunks are put together', async ({ mount, page }) => {
		const dav = await mockDav(page, {
			// Hold back the small file upload and the assembling of the chunks
			hold: ({ method, path }) => method === 'MOVE' || (method === 'PUT' && path.startsWith('/files/')),
		})
		await mount(NcUploadPickerStory, { props: { multiple: true } })

		await pickFiles(page, createFile('file.txt', 1), createFile('big-file.txt', 25))

		// All chunks were uploaded, so the assembling started
		const [assembly] = await dav.waitFor('MOVE')
		// Finish the other upload, so only the assembling is left
		const [upload] = dav.received('PUT', /^\/files\//)
		upload.respond()

		await expect(page.getByText('assembling')).toBeVisible()
		// There is nothing to cancel anymore while assembling
		await expect(page.getByRole('button', { name: 'Cancel uploads' })).toBeHidden()

		assembly.respond()
		await expect(page.getByRole('progressbar')).toBeHidden()
	})

	test('retries a failed chunk without uploading the other chunks again', async ({ mount, page }) => {
		let failChunk = true
		const dav = await mockDav(page, {
			status: ({ method, path }) => {
				if (method === 'PUT' && path.endsWith('/1') && failChunk) {
					failChunk = false
					return 504
				}
				return method === 'MOVE' ? 204 : 201
			},
		})
		await mount(NcUploadPickerStory)

		// 25 MiB with a chunk size of 10 MiB results in three chunks
		await pickFiles(page, createFile('big-file.txt', 25))

		// The upload succeeds, so all chunks were uploaded
		await dav.waitFor('MOVE', { timeout: 30000 })
		await expect(page.getByRole('progressbar')).toBeHidden()

		// The failed chunk was uploaded again, the other chunks were not
		expect(dav.received('PUT').map(({ path }) => path.split('/').at(-1)).sort())
			.toEqual(['0', '1', '1', '2'])
	})

	test('shows the paused state and stops uploading until resumed', async ({ mount, page }) => {
		const events: string[] = []
		// Hold back the first chunk so the uploader can be paused while it is uploading
		const dav = await mockDav(page, { hold: ({ method, path }) => method === 'PUT' && path.endsWith('/0') })
		await mount(NcUploadPickerStory, {
			// Upload one chunk after the other, so pausing stops the upload of the remaining chunks
			props: { maxParallelUploads: 1 },
			on: {
				paused: (queueLength: number) => events.push(`paused:${queueLength}`),
				resumed: (queueLength: number) => events.push(`resumed:${queueLength}`),
			},
		})

		// 15 MiB with a chunk size of 10 MiB results in two chunks
		await pickFiles(page, createFile('big-file.txt', 15))

		const progress = page.getByRole('progressbar')
		const [chunk] = await dav.waitFor('PUT')
		await expect(progress).toBeVisible()

		await page.getByRole('button', { name: 'Pause uploads' }).click()
		chunk.respond()

		// The upload of the file and of the destination folder are still queued
		await expect.poll(() => events).toEqual(['paused:2'])
		await expect(page.getByText('paused')).toBeVisible()
		await expect(progress).toBeVisible()
		// The remaining chunk is not uploaded and the chunks are not assembled
		expect(dav.received('PUT')).toHaveLength(1)
		expect(dav.received('MOVE')).toHaveLength(0)

		await page.getByRole('button', { name: 'Resume uploads' }).click()

		await expect.poll(() => events).toEqual(['paused:2', 'resumed:2'])
		await dav.waitFor('MOVE')
		await expect(progress).toBeHidden()
	})
})
