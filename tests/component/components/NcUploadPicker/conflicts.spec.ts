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
		// Both versions are shown, a single conflict is resolved using the dialog actions
		const conflict = dialog.getByRole('group', { name: 'file.txt' })
		await expect(conflict.getByText('Existing version', { exact: true })).toBeAttached()
		await expect(conflict.getByText('New version', { exact: true })).toBeAttached()
		await expect(dialog.getByRole('button', { name: 'Keep both' })).toBeVisible()
		await expect(dialog.getByRole('button', { name: 'Replace' })).toBeVisible()
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

		// Conflicts cannot be resolved without the content of the destination,
		// so nothing is uploaded instead of silently overwriting existing files
		await expect(page.getByRole('dialog')).toBeHidden()
		await expect(page.getByRole('progressbar')).toBeHidden()
		expect(dav.received('PUT')).toHaveLength(0)
	})

	test('failing to check for conflicts does not block later uploads', async ({ mount, page }) => {
		const dav = await mockDav(page)
		const props = { existingFiles: ['file.txt'], failContent: true }
		const component = await mount(NcUploadPickerStory, { props })

		await pickFiles(page, createFile('file.txt', 1))
		// The destination was checked, but nothing was uploaded
		await dav.waitFor('HEAD')
		expect(dav.received('PUT')).toHaveLength(0)

		// The cancelled upload does not keep the uploader busy
		await component.update({ props: { ...props, failContent: false } })
		await pickFiles(page, createFile('other.txt', 1))

		const [upload] = await dav.waitFor('PUT')
		expect(upload.path).toBe('/files/test/Folder/other.txt')
		await expect(page.getByRole('progressbar')).toBeHidden()
	})

	test('replacing the existing file overwrites it', async ({ mount, page }) => {
		const dav = await mockDav(page)
		await mount(NcUploadPickerStory, { props: { existingFiles: ['file.txt'] } })

		await pickFiles(page, createFile('file.txt', 1))
		await conflictDialog(page).getByRole('button', { name: 'Replace' }).click()

		const [upload] = await dav.waitFor('PUT')
		expect(upload.path).toBe('/files/test/Folder/file.txt')
	})

	test('keeping both versions uploads the file with a new name', async ({ mount, page }) => {
		const dav = await mockDav(page)
		await mount(NcUploadPickerStory, { props: { existingFiles: ['file.txt'] } })

		await pickFiles(page, createFile('file.txt', 1))
		await conflictDialog(page).getByRole('button', { name: 'Keep both' }).click()

		// The existing file is kept, the new one is uploaded with a unique name
		const uploads = await dav.waitFor('PUT')
		expect(uploads.map(({ path }) => path)).toEqual(['/files/test/Folder/file (1).txt'])
	})

	test('asks which version to keep for every conflicting file', async ({ mount, page }) => {
		const dav = await mockDav(page)
		await mount(NcUploadPickerStory, {
			props: { existingFiles: ['file.txt', 'other.txt'], multiple: true },
		})

		await pickFiles(page, createFile('file.txt', 1), createFile('other.txt', 1))

		const dialog = conflictDialog(page, 2)
		await expect(dialog).toBeVisible()
		// Every conflict can be resolved on its own, the new versions are preselected
		for (const name of ['file.txt', 'other.txt']) {
			const conflict = dialog.getByRole('group', { name })
			await expect(conflict.getByRole('checkbox', { name: /Existing version$/ })).not.toBeChecked()
			await expect(conflict.getByRole('checkbox', { name: /New version$/ })).toBeChecked()
		}
		// Nothing is uploaded before the conflicts are resolved
		expect(dav.received('PUT')).toHaveLength(0)
	})

	test('keeping the existing version skips the conflicting file', async ({ mount, page }) => {
		const dav = await mockDav(page)
		await mount(NcUploadPickerStory, {
			props: { existingFiles: ['file.txt', 'other.txt'], multiple: true },
		})

		await pickFiles(page, createFile('file.txt', 1), createFile('other.txt', 1))

		// Only keep the existing version of the first file, the second one is replaced
		const dialog = conflictDialog(page, 2)
		await selectVersion(dialog, 'file.txt', 'Existing version', true)
		await selectVersion(dialog, 'file.txt', 'New version', false)
		await dialog.getByRole('button', { name: /Continue/ }).click()

		// Only the file that is not skipped is uploaded
		await dav.waitFor('PUT')
		await expect(page.getByRole('progressbar')).toBeHidden()
		expect(dav.received('PUT').map(({ path }) => path)).toEqual(['/files/test/Folder/other.txt'])
	})

	test('skipping all conflicts uploads nothing', async ({ mount, page }) => {
		const dav = await mockDav(page)
		await mount(NcUploadPickerStory, {
			props: { existingFiles: ['file.txt', 'other.txt'], multiple: true },
		})

		await pickFiles(page, createFile('file.txt', 1), createFile('other.txt', 1))
		await conflictDialog(page, 2).getByRole('button', { name: 'Skip 2 files' }).click()

		await expect(page.getByRole('progressbar')).toBeHidden()
		expect(dav.received('PUT')).toHaveLength(0)
	})
})

/**
 * The conflict dialog shown when uploading files that already exist.
 *
 * @param page - The page of the test
 * @param conflicts - Number of conflicting files, a single conflict is resolved by the dialog actions
 */
function conflictDialog(page: Page, conflicts: number = 1): Locator {
	return page.getByRole('dialog', {
		name: conflicts === 1 ? 'Select file to keep' : 'Select files to keep',
	})
}

/**
 * Select or deselect one of the versions of a conflicting file.
 * This is only possible if there is more than one conflict.
 *
 * @param dialog - The conflict dialog
 * @param name - Name of the conflicting file
 * @param version - The version to select or deselect
 * @param selected - Whether the version should be selected afterwards
 */
async function selectVersion(
	dialog: Locator,
	name: string,
	version: 'New version' | 'Existing version',
	selected: boolean,
) {
	const conflict = dialog.getByRole('group', { name })
	const checkbox = conflict.getByRole('checkbox', { name: new RegExp(`${version}$`) })
	// The checkbox cannot be clicked as it is covered by its label, so it is toggled using the keyboard
	await checkbox.press(' ')
	await expect(checkbox).toBeChecked({ checked: selected })
}
