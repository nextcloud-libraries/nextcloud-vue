/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Locator, Page } from '@playwright/test'

import { expect, test } from '@playwright/experimental-ct-vue'
import NcUploadPickerStory from './NcUploadPicker.story.vue'
import { createFile, mockDav, pickFiles, skipWithoutFilePicker } from './upload-helpers.ts'

test.describe('NcUploadPicker: conflicting files', () => {
	skipWithoutFilePicker()

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

	test('failing to check for conflicts cancels the upload', async ({ mount, page }) => {
		const dav = await mockDav(page)
		await mount(NcUploadPickerStory, { props: { existingFiles: ['file.txt'], failContent: true } })

		await pickFiles(page, createFile('file.txt', 1))

		// The destination was checked, so the uploader got as far as resolving conflicts
		await dav.waitFor('HEAD')

		// Conflicts cannot be resolved without the content of the destination,
		// so nothing is uploaded instead of silently overwriting existing files
		await expect(page.getByRole('dialog')).toBeHidden()
		await expect(page.getByRole('progressbar')).toBeHidden()
		await dav.expectNoMore('PUT')
	})

	test('failing to check for conflicts does not block later uploads', async ({ mount, page }) => {
		const dav = await mockDav(page)
		const props = { existingFiles: ['file.txt'], failContent: true }
		const component = await mount(NcUploadPickerStory, { props })

		await pickFiles(page, createFile('file.txt', 1))
		// The destination was checked, but nothing was uploaded
		await dav.waitFor('HEAD')
		await dav.expectNoMore('PUT')

		// The cancelled upload does not keep the uploader busy
		await component.update({ props: { ...props, failContent: false } })
		await pickFiles(page, createFile('other.txt', 1))

		const [upload] = await dav.waitFor('PUT')
		expect(upload.path).toBe('/files/test/Folder/other.txt')
		await expect(page.getByRole('progressbar')).toBeHidden()
	})

	test('keeping the existing version skips the conflicting file', async ({ mount, page }) => {
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
