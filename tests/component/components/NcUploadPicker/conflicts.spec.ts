/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Locator, Page } from '@playwright/test'

import { expect, test } from '@playwright/experimental-ct-vue'
import NcUploadPickerStory from './NcUploadPicker.story.vue'
import { createFile, mockDav, pickFiles } from './upload-helpers.ts'

test.describe('NcUploadPicker: conflicting files', () => {
	test.skip(({ browserName }) => browserName === 'webkit', 'WebKit does not support file pickers in Playwright yet')

	test('asks which version of a conflicting file to keep', async ({ mount, page }) => {
		const dav = await mockDav(page)
		await mount(NcUploadPickerStory, { props: { existingFiles: ['file.txt'] } })

		await pickFiles(page, createFile('file.txt', 1))

		const dialog = conflictDialog(page)
		await expect(dialog).toBeVisible()
		const conflict = dialog.getByRole('group', { name: 'file.txt' })
		await expect(conflict.getByRole('checkbox', { name: /^New version/ })).toBeVisible()
		await expect(conflict.getByRole('checkbox', { name: /^Existing version/ })).toBeVisible()
		// Nothing is uploaded before the conflict is resolved
		expect(dav.received('PUT')).toHaveLength(0)
	})

	test('cancelling the conflict dialog cancels the upload', async ({ mount, page }) => {
		const dav = await mockDav(page)
		await mount(NcUploadPickerStory, { props: { existingFiles: ['file.txt'] } })

		await pickFiles(page, createFile('file.txt', 1))
		await conflictDialog(page).getByRole('button', { name: 'Cancel' }).click()

		await expect(page.getByRole('progressbar')).toBeHidden()
		expect(dav.received('PUT')).toHaveLength(0)
	})

	test('keeping the existing version skips the conflicting file', async ({ mount, page }) => {
		// FIXME: Skipped files are currently uploaded anyway: https://github.com/nextcloud-libraries/nextcloud-files/pull/1722
		test.fail()

		// Hold back the uploads and only upload one file at a time,
		// so the first upload is the first picked file that is not skipped
		const dav = await mockDav(page, { hold: ({ method }) => method === 'PUT' })
		await mount(NcUploadPickerStory, {
			props: { existingFiles: ['file.txt'], maxParallelUploads: 1, multiple: true },
		})

		await pickFiles(page, createFile('file.txt', 1), createFile('other.txt', 1))

		const dialog = conflictDialog(page)
		await keepVersion(dialog, 'file.txt', 'Existing version')
		await dialog.getByRole('button', { name: /Continue/ }).click()

		// Only the file without a conflict is uploaded
		const [upload] = await dav.waitFor('PUT')
		expect(upload.path).toBe('/files/test/Folder/other.txt')
	})

	test('keeping the new version overwrites the existing file', async ({ mount, page }) => {
		const dav = await mockDav(page)
		await mount(NcUploadPickerStory, { props: { existingFiles: ['file.txt'] } })

		await pickFiles(page, createFile('file.txt', 1))

		const dialog = conflictDialog(page)
		await keepVersion(dialog, 'file.txt', 'New version')
		await dialog.getByRole('button', { name: /Continue/ }).click()

		const [upload] = await dav.waitFor('PUT')
		expect(upload.path).toBe('/files/test/Folder/file.txt')
	})

	test('keeping both versions uploads the file with a new name', async ({ mount, page }) => {
		const dav = await mockDav(page)
		await mount(NcUploadPickerStory, { props: { existingFiles: ['file.txt'] } })

		await pickFiles(page, createFile('file.txt', 1))

		const dialog = conflictDialog(page)
		await keepVersion(dialog, 'file.txt', 'New version')
		await keepVersion(dialog, 'file.txt', 'Existing version')
		await dialog.getByRole('button', { name: /Continue/ }).click()

		// The existing file is kept, the new one is uploaded with a unique name
		const uploads = await dav.waitFor('PUT')
		expect(uploads.map(({ path }) => path)).toEqual(['/files/test/Folder/file (1).txt'])
	})
})

/**
 * The conflict dialog shown when uploading a file that already exists.
 *
 * @param page - The page of the test
 */
function conflictDialog(page: Page): Locator {
	return page.getByRole('dialog', { name: '1 file conflict' })
}

/**
 * Select one of the versions of a conflicting file.
 *
 * @param dialog - The conflict dialog
 * @param name - Name of the conflicting file
 * @param version - The version to keep
 */
async function keepVersion(dialog: Locator, name: string, version: 'New version' | 'Existing version') {
	const conflict = dialog.getByRole('group', { name })
	// The checkbox itself is not clickable as it is covered by its label
	await conflict.getByText(version, { exact: true }).click()
	await expect(conflict.getByRole('checkbox', { name: new RegExp(`^${version}`) })).toBeChecked()
}
