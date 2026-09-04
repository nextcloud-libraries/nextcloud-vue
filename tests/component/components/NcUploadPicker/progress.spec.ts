/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import NcUploadPickerStory from './NcUploadPicker.story.vue'
import { createFile, mockDav, pickFiles, skipWithoutFilePicker } from './upload-helpers.ts'

test.describe('NcUploadPicker: progress', () => {
	skipWithoutFilePicker()

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

	test('shows the assembling state only when nothing is uploaded anymore', async ({ mount, page }) => {
		const dav = await mockDav(page, {
			// Hold back the small file uploads and the assembling of the chunks
			hold: ({ method, path }) => method === 'MOVE' || (method === 'PUT' && path.startsWith('/files/')),
		})
		const finished: string[] = []
		await mount(NcUploadPickerStory, {
			props: { multiple: true },
			on: { 'upload:finished': ({ source }: { source: string }) => finished.push(source) },
		})

		await pickFiles(page, createFile('file.txt', 1), createFile('other.txt', 1), createFile('big-file.txt', 25))

		// All chunks were uploaded, so the assembling started
		await dav.waitFor('MOVE')
		// Finish one of the small uploads, the other one is still uploading
		const [upload] = dav.received('PUT', /\/file\.txt$/)
		upload.respond()
		await expect.poll(() => finished.some((source) => source.endsWith('/file.txt'))).toBe(true)

		// The chunks are assembled, but there is still an upload running
		await expect(page.getByText('assembling')).toBeHidden()
		// So the remaining upload can still be cancelled
		await expect(page.getByRole('button', { name: 'Cancel uploads' })).toBeVisible()

		dav.releaseAll()
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

	test('shows uploads queued while paused, but does not start them', async ({ mount, page }) => {
		const dav = await mockDav(page)
		await mount(NcUploadPickerStory, { props: { startPaused: true } })

		await pickFiles(page, createFile('file.txt', 5))

		// The upload is queued, so there is progress to show, but nothing is uploaded yet
		const progress = page.getByRole('progressbar')
		await expect(progress).toBeVisible()
		await expect(progress).toHaveAttribute('value', '0')
		await expect(page.getByText('paused')).toBeVisible()
		expect(dav.requests).toHaveLength(0)

		await page.getByRole('button', { name: 'Resume uploads' }).click()

		await expect(page.getByText('paused')).toBeHidden()
		expect((await dav.waitFor('PUT'))[0].path).toBe('/files/test/Folder/file.txt')
		await expect(progress).toBeHidden()
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
		await dav.expectNoMore('PUT')
		expect(dav.received('MOVE')).toHaveLength(0)

		await page.getByRole('button', { name: 'Resume uploads' }).click()

		await expect.poll(() => events).toEqual(['paused:2', 'resumed:2'])
		await dav.waitFor('MOVE')
		await expect(progress).toBeHidden()
	})

	test('does not lose the progress of finished uploads when an upload is retried', async ({ mount, page }) => {
		let failUpload = true
		const dav = await mockDav(page, {
			// Hold back the second file, so its retry can be observed while it is still running
			hold: ({ method, path }) => method === 'PUT' && path.endsWith('/second.txt'),
			status: ({ method, path }) => {
				if (method === 'PUT' && path.endsWith('/second.txt') && failUpload) {
					failUpload = false
					return 423
				}
				return method === 'MOVE' ? 204 : 201
			},
		})
		// Upload one file after the other to have a deterministic progress
		await mount(NcUploadPickerStory, { props: { multiple: true, maxParallelUploads: 1 } })

		await pickFiles(page, createFile('first.txt', 1), createFile('second.txt', 1))

		// The first of the two equally sized files is done
		const progress = page.getByRole('progressbar')
		await expect(progress).toHaveAttribute('value', '50')

		// Let the second upload fail, so it gets retried
		const [attempt] = await dav.waitFor('PUT', { path: /\/second\.txt$/ })
		attempt.respond()

		// While the retry is running the progress of the finished file is kept instead of starting over
		const attempts = await dav.waitFor('PUT', { count: 2, path: /\/second\.txt$/, timeout: 30000 })
		await expect(progress).toHaveAttribute('value', '50')

		attempts[1].respond()
		await expect(progress).toBeHidden()
	})
})
