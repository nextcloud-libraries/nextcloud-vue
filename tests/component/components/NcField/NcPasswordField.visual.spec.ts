/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import NcPasswordField from './NcPassword.story.vue'

test.skip(({ browserName }) => browserName !== 'chromium')

test.describe('NcPasswordField', () => {
	test('password is hidden', { tag: '@visual' }, async ({ mount, page }) => {
		await mount(NcPasswordField)

		await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible()
		await expect(page.locator('.story-wrapper')).toHaveScreenshot()
	})

	test('password can be shown', { tag: '@visual' }, async ({ mount, page }) => {
		await mount(NcPasswordField, {
			props: {
				visible: true,
			},
		})

		await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible()
		await expect(page.locator('.story-wrapper')).toHaveScreenshot()
	})

	test('password can be shown by trailing button click', { tag: '@visual' }, async ({ mount, page }) => {
		await mount(NcPasswordField)

		const el = page.getByRole('textbox', { name: 'Password' })
		await expect(el).toBeVisible()
		await expect(el).toHaveAttribute('type', 'password')

		await page.getByRole('button', { name: 'Show password' }).click()
		await expect(el).toHaveAttribute('type', 'text')
		await expect(page.locator('.story-wrapper')).toHaveScreenshot()
	})

	test('password as-text is hidden', { tag: '@visual' }, async ({ mount, page }) => {
		await mount(NcPasswordField, {
			props: {
				asText: true,
			},
		})

		await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible()
		await expect(page.locator('.story-wrapper')).toHaveScreenshot()
	})

	test('password as-text can be shown', { tag: '@visual' }, async ({ mount, page }) => {
		await mount(NcPasswordField, {
			props: {
				asText: true,
				visible: true,
			},
		})

		await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible()
		await expect(page.locator('.story-wrapper')).toHaveScreenshot()
	})

	test('password as-text can be shown by trailing button click', { tag: '@visual' }, async ({ mount, page }) => {
		await mount(NcPasswordField, {
			props: {
				asText: true,
			},
		})

		const el = page.getByRole('textbox', { name: 'Password' })
		await expect(el).toBeVisible()

		await page.getByRole('button', { name: 'Show password' }).click()
		await expect(page.locator('.story-wrapper')).toHaveScreenshot()
	})
})
