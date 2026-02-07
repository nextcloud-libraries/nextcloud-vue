/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import { join } from 'node:path'
import NcFilePicker from '../../../../src/components/NcFilePicker/NcFilePicker.vue'
import NcFilePickerEmitStory from './NcFilePickerEmit.story.vue'

test('mounting with default props', async ({ mount, page }) => {
	await mount(NcFilePicker, {
		props: {},
	})

	const button = page.getByRole('button', { name: 'Pick file' })
	await expect(button).toBeVisible()
	// check that the input is hidden
	const input = page.locator('input[type="file"]')
	await expect(input).toHaveAttribute('aria-hidden', 'true')
})

test('setting the variant prop', { tag: '@visual' }, async ({ mount, page, browserName }) => {
	if (browserName !== 'chromium') {
		test.skip()
	}

	const component = await mount(NcFilePicker, {
		props: {},
	})

	const button = page.getByRole('button', { name: 'Pick file' })
	await expect(button).toHaveScreenshot()

	await component.update({ props: { variant: 'primary' } })
	await expect(button).toHaveScreenshot()

	await component.update({ props: { variant: 'secondary' } })
	await expect(button).toHaveScreenshot()

	await component.update({ props: { variant: 'tertiary' } })
	await expect(button).toHaveScreenshot()
})

test('label is adjusted to match requested mode', async ({ mount, page }) => {
	const component = await mount(NcFilePicker, {
		props: {},
	})

	await expect(page.getByRole('button', { name: 'Pick file' })).toBeVisible()

	await component.update({ props: { multiple: true } })
	await expect(page.getByRole('button', { name: 'Pick files' })).toBeVisible()

	await component.update({ props: { directory: true, multiple: false } })
	await expect(page.getByRole('button', { name: 'Pick file' })).toBeVisible()

	await component.update({ props: { directory: true, multiple: true } })
	await expect(page.getByRole('button', { name: 'Pick files' })).toBeVisible()

	await component.update({ props: { directory: true, directoryOnly: true, multiple: false } })
	await expect(page.getByRole('button', { name: 'Pick folder' })).toBeVisible()

	await component.update({ props: { directory: true, directoryOnly: true, multiple: true } })
	await expect(page.getByRole('button', { name: 'Pick folder' })).toBeVisible() // ignored because browsers only support single folder picking
})

test('can override labels', async ({ mount, page }) => {
	const label = 'Custom label'
	const component = await mount(NcFilePicker, {
		props: {
			label,
		},
	})

	await expect(page.getByRole('button', { name: label })).toBeVisible()

	await component.update({ props: { label, multiple: true } })
	await expect(page.getByRole('button', { name: label })).toBeVisible()

	await component.update({ props: { label, directory: true } })
	await expect(page.getByRole('button', { name: label })).toBeVisible()

	await component.update({ props: { label, directory: true, multiple: true } })
	await expect(page.getByRole('button', { name: label })).toBeVisible()

	await component.update({ props: { label, directory: true, directoryOnly: true } })
	await expect(page.getByRole('button', { name: label })).toBeVisible()
})

test('Shows the menu when picking directories is allowed', async ({ mount, page }) => {
	await mount(NcFilePicker, {
		props: {
			directory: true,
		},
	})

	const button = page.getByRole('button', { name: 'Pick file' })
	await expect(button).toBeVisible()
	await button.click()

	await expect(page.getByRole('menu', { name: 'Pick file' })).toBeVisible()
	await expect(page.getByRole('menuitem', { name: 'Upload file' })).toBeVisible()
	await expect(page.getByRole('menuitem', { name: 'Upload folder' })).toBeVisible()
})

test.describe('file picking', () => {
	test.skip(({ browserName }) => browserName === 'webkit', 'WebKit does not support file pickers in Playwright yet')

	test('picking a single file', async ({ mount, page }) => {
		page.on('filechooser', async (fileChooser) => {
			expect(fileChooser.isMultiple()).toBe(false)
			await fileChooser.setFiles({ name: 'testfile.txt', mimeType: 'text/plain', buffer: Buffer.from('Hello World') })
		})

		const { promise, resolve } = Promise.withResolvers<string[]>()
		await mount(NcFilePickerEmitStory, { // we need this story as PlayWright can only proxy simple structures like strings but not complex ones like File objects
			props: {},
			on: {
				pick: resolve,
			},
		})

		const button = page.getByRole('button', { name: 'Pick file' })
		await button.click()

		expect(await promise).toEqual(['testfile.txt'])
	})

	test('picking multiple files', async ({ mount, page }) => {
		page.on('filechooser', async (fileChooser) => {
			expect(fileChooser.isMultiple()).toBe(true)
			await fileChooser.setFiles([
				{ name: 'a.txt', mimeType: 'text/plain', buffer: Buffer.from('Hello') },
				{ name: 'b.txt', mimeType: 'text/plain', buffer: Buffer.from('Hallo') },
				{ name: 'c.txt', mimeType: 'text/plain', buffer: Buffer.from('Hola') },
			])
		})

		const { promise, resolve } = Promise.withResolvers<string[]>()
		await mount(NcFilePickerEmitStory, {
			props: {
				multiple: true,
			},
			on: {
				pick: resolve,
			},
		})

		const button = page.getByRole('button', { name: 'Pick files' })
		await button.click()

		expect(await promise).toEqual(['a.txt', 'b.txt', 'c.txt'])
	})

	test('picking a directory', async ({ mount, page }) => {
		page.on('filechooser', async (fileChooser) => {
			expect(fileChooser.isMultiple()).toBe(false)
			await fileChooser.setFiles(join(import.meta.dirname, 'folder'))
		})

		const { promise, resolve } = Promise.withResolvers<string[]>()
		await mount(NcFilePickerEmitStory, {
			props: {
				directory: true,
				directoryOnly: true,
			},
			on: {
				pick: resolve,
			},
		})

		await page.getByRole('button', { name: 'Pick folder' })
			.click()
		expect(await promise).toEqual(['folder/.gitkeep'])
	})

	test('picking a directory when having the menu', async ({ mount, page }) => {
		page.on('filechooser', async (fileChooser) => {
			expect(fileChooser.isMultiple()).toBe(false)
			await fileChooser.setFiles(join(import.meta.dirname, 'folder'))
		})

		const { promise, resolve } = Promise.withResolvers<string[]>()
		await mount(NcFilePickerEmitStory, {
			props: {
				directory: true,
			},
			on: {
				pick: resolve,
			},
		})

		await page.getByRole('button', { name: 'Pick file' })
			.click()
		await page.getByRole('menuitem', { name: 'Upload folder' })
			.click()

		expect(await promise).toEqual(['folder/.gitkeep'])
	})
})
