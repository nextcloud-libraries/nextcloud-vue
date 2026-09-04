/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import { join } from 'node:path'
import NcUploadPickerStory from './NcUploadPicker.story.vue'
import { createFile, mockDav, pickFiles, skipWithoutFilePicker, UploadStatus } from './upload-helpers.ts'

test.describe('NcUploadPicker: rendering', () => {
	test('shows a button with the default label', async ({ mount, page }) => {
		await mount(NcUploadPickerStory)

		await expect(page.getByRole('button', { name: 'New' })).toBeVisible()
	})

	test('shows a button with a custom label', async ({ mount, page }) => {
		await mount(NcUploadPickerStory, { props: { label: 'Add attachment' } })

		await expect(page.getByRole('button', { name: 'Add attachment' })).toBeVisible()
	})

	test('keeps the accessible name when only showing the icon', async ({ mount, page }) => {
		await mount(NcUploadPickerStory, { props: { iconOnly: true } })

		const button = page.getByRole('button', { name: 'New' })
		await expect(button).toBeVisible()
		await expect(button).toHaveText('')
	})

	test('can be disabled', async ({ mount, page }) => {
		await mount(NcUploadPickerStory, { props: { disabled: true } })

		await expect(page.getByRole('button', { name: 'New' })).toBeDisabled()
	})

	test('has no progress bar and no cancel button while idle', async ({ mount, page }) => {
		await mount(NcUploadPickerStory)

		await expect(page.getByRole('progressbar')).toBeHidden()
		await expect(page.getByRole('button', { name: 'Cancel uploads' })).toBeHidden()
	})
})

test.describe('NcUploadPicker: uploading', () => {
	skipWithoutFilePicker()

	test('shows the progress while uploading and hides it afterwards', async ({ mount, page }) => {
		const dav = await mockDav(page, { hold: ({ method }) => method === 'PUT' })
		await mount(NcUploadPickerStory)

		await pickFiles(page, createFile('file.txt', 5))
		await dav.waitFor('PUT')

		// While uploading the progress and the cancel button are shown, but the picker keeps its label
		await expect(page.getByRole('progressbar')).toBeVisible()
		await expect(page.getByRole('button', { name: 'Cancel uploads' })).toBeVisible()
		await expect(page.getByRole('button', { name: 'New' })).toBeVisible()

		dav.releaseAll()

		// Once done the progress and the cancel button are hidden again
		await expect(page.getByRole('progressbar')).toBeHidden()
		await expect(page.getByRole('button', { name: 'Cancel uploads' })).toBeHidden()
	})

	test('uploads a file to the destination', async ({ mount, page }) => {
		const dav = await mockDav(page)
		const finished: { source: string, status: number }[] = []
		await mount(NcUploadPickerStory, {
			on: { 'upload:finished': (upload) => finished.push(upload) },
		})

		await pickFiles(page, createFile('file.txt', 1))

		const [upload] = await dav.waitFor('PUT')
		expect(upload.path).toBe('/files/test/Folder/file.txt')

		// the file upload and the upload of the destination folder itself are both reported
		await expect.poll(() => finished.length).toBe(2)
		expect(finished.find(({ source }) => source.endsWith('/file.txt')))
			.toMatchObject({ status: UploadStatus.FINISHED })
	})

	test('uploads multiple files', async ({ mount, page }) => {
		const dav = await mockDav(page)
		await mount(NcUploadPickerStory, { props: { multiple: true } })

		await pickFiles(page, createFile('first.txt', 1), createFile('second.txt', 1))

		const uploads = await dav.waitFor('PUT', { count: 2 })
		expect(uploads.map(({ path }) => path).sort()).toEqual([
			'/files/test/Folder/first.txt',
			'/files/test/Folder/second.txt',
		])
	})

	test('uploads big files in chunks', async ({ mount, page }) => {
		const dav = await mockDav(page)
		await mount(NcUploadPickerStory)

		// 25 MiB with a chunk size of 10 MiB results in three chunks
		await pickFiles(page, createFile('big-file.txt', 25))

		// the chunks are uploaded to a temporary workspace
		const [workspace] = await dav.waitFor('MKCOL', { path: /^\/uploads\/test\/web-file-upload-/ })
		const chunks = await dav.waitFor('PUT', { count: 3 })
		expect(chunks.map(({ path }) => path).sort()).toEqual([0, 1, 2].map((index) => `${workspace.path}/${index}`))

		// which is then assembled into the destination file
		const [assembly] = await dav.waitFor('MOVE')
		expect(assembly.path).toBe(`${workspace.path}/.file`)

		await expect(page.getByRole('progressbar')).toBeHidden()
		// the file itself was never uploaded directly
		expect(dav.received('PUT', /^\/files\//)).toHaveLength(0)
	})

	test('reports failed uploads', async ({ mount, page }) => {
		await mockDav(page, { status: ({ method }) => method === 'PUT' ? 403 : 201 })
		const finished: { source: string, status: number }[] = []
		await mount(NcUploadPickerStory, {
			on: { 'upload:finished': (upload) => finished.push(upload) },
		})

		await pickFiles(page, createFile('file.txt', 1))

		await expect.poll(() => finished.length).toBe(2)
		expect(finished.find(({ source }) => source.endsWith('/file.txt')))
			.toMatchObject({ status: UploadStatus.FAILED })
		await expect(page.getByRole('progressbar')).toBeHidden()
	})

	test('uploads a directory', async ({ mount, page }) => {
		const dav = await mockDav(page)
		await mount(NcUploadPickerStory, { props: { directory: true } })

		const fileChooser = page.waitForEvent('filechooser')
		await page.getByRole('button', { name: 'New' }).click()
		await page.getByRole('menuitem', { name: 'Upload folder' }).click()
		await (await fileChooser).setFiles(join(import.meta.dirname, 'upload-folder'))

		// The directory is created before its content is uploaded
		const [directory] = await dav.waitFor('MKCOL')
		expect(directory.path).toBe('/files/test/Folder/upload-folder')
		const [upload] = await dav.waitFor('PUT')
		expect(upload.path).toBe('/files/test/Folder/upload-folder/file.txt')

		await expect(page.getByRole('progressbar')).toBeHidden()
	})

	test('can upload the same file again after resetting the picker', async ({ mount, page }) => {
		const dav = await mockDav(page)
		await mount(NcUploadPickerStory)

		await pickFiles(page, createFile('file.txt', 1))
		await dav.waitFor('PUT')

		await page.getByRole('button', { name: 'Reset picker' }).click()
		await pickFiles(page, createFile('file.txt', 1))

		const uploads = await dav.waitFor('PUT', { count: 2 })
		expect(uploads.map(({ path }) => path)).toEqual([
			'/files/test/Folder/file.txt',
			'/files/test/Folder/file.txt',
		])
	})
})

test.describe('NcUploadPicker: destination handling', () => {
	skipWithoutFilePicker()

	test('uploads to the destination of the current props', async ({ mount, page }) => {
		const dav = await mockDav(page)
		const component = await mount(NcUploadPickerStory)

		await pickFiles(page, createFile('file.txt', 1))
		expect((await dav.waitFor('PUT'))[0].path).toBe('/files/test/Folder/file.txt')

		await component.update({ props: { destinationPath: 'files/test/Photos' } })
		await pickFiles(page, createFile('file.txt', 1))

		const uploads = await dav.waitFor('PUT', { count: 2 })
		expect(uploads[1].path).toBe('/files/test/Photos/file.txt')
	})

	test('uploads to a destination that needs to be encoded', async ({ mount, page }) => {
		const dav = await mockDav(page)
		await mount(NcUploadPickerStory, {
			props: { destinationPath: 'photos/test/albums/2022 Summer Vacations' },
		})

		await pickFiles(page, createFile('file.txt', 1))

		const [upload] = await dav.waitFor('PUT')
		expect(upload.path).toBe('/photos/test/albums/2022 Summer Vacations/file.txt')
		expect(upload.url).toContain('/photos/test/albums/2022%20Summer%20Vacations/file.txt')
	})
})
