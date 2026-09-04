/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import NcUploadPickerStory from './NcUploadPicker.story.vue'
import { createFile, mockDav, pickFiles, skipWithoutFilePicker, UploadStatus } from './upload-helpers.ts'

const FILE = /\/file\.txt$/

test.describe('NcUploadPicker: retrying failed requests', () => {
	skipWithoutFilePicker()

	test('retries an upload that failed with a network error', async ({ mount, page }) => {
		let failRequest = true
		const dav = await mockDav(page, {
			fail: (request) => {
				if (request.method === 'PUT' && failRequest) {
					failRequest = false
					return true
				}
				return false
			},
		})
		await mount(NcUploadPickerStory)

		await pickFiles(page, createFile('file.txt', 1))

		// The upload is retried and succeeds the second time
		const uploads = await dav.waitFor('PUT', { count: 2, path: FILE, timeout: 30000 })
		expect(uploads).toHaveLength(2)
		await expect(page.getByRole('progressbar')).toBeHidden()
	})

	test('retries an upload of a locked file', async ({ mount, page }) => {
		// A locked file is often just a preview being generated, so the upload is retried
		let failRequest = true
		const dav = await mockDav(page, {
			status: (request) => {
				if (request.method === 'PUT' && failRequest) {
					failRequest = false
					return 423
				}
				return request.method === 'MOVE' ? 204 : 201
			},
		})
		await mount(NcUploadPickerStory)

		await pickFiles(page, createFile('file.txt', 1))

		const uploads = await dav.waitFor('PUT', { count: 2, path: FILE, timeout: 30000 })
		expect(uploads).toHaveLength(2)
		await expect(page.getByRole('progressbar')).toBeHidden()
	})

	test('does not retry an upload that exceeded the quota', async ({ mount, page }) => {
		// Insufficient storage is permanent, so retrying would only delay the failure
		const dav = await mockDav(page, {
			status: (request) => request.method === 'PUT' ? 507 : 201,
		})
		const finished: { source: string, status: number }[] = []
		await mount(NcUploadPickerStory, {
			on: { 'upload:finished': (upload) => finished.push(upload) },
		})

		await pickFiles(page, createFile('file.txt', 1))

		// The upload is reported as failed
		await expect
			.poll(() => finished.find(({ source }) => source.endsWith('/file.txt')))
			.toMatchObject({ status: UploadStatus.FAILED })
		// and it is not attempted again
		expect(dav.received('PUT', FILE)).toHaveLength(1)
		await dav.expectNoMore('PUT', { path: FILE })
		await expect(page.getByRole('progressbar')).toBeHidden()
	})
})
