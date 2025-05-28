/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import FocusSelectTest from './FocusSelectTest.story.vue'

// shared behavior between all components
test.describe('Nc*Field public API', () => {
	test('NcInputField: focus the input field', async ({ mount, page }) => {
		await mount(FocusSelectTest)
		await page.getByRole('button', { name: 'Focus input' }).click()

		await expect(page.getByLabel('input field')).toBeFocused()
	})

	test('NcPasswordField: focus the input field', async ({ mount, page }) => {
		await mount(FocusSelectTest)
		await page.getByRole('button', { name: 'Focus password' }).click()

		await expect(page.getByLabel('password field')).toBeFocused()
	})

	test('NcTextField: focus the input field', async ({ mount, page }) => {
		await mount(FocusSelectTest)
		await page.getByRole('button', { name: 'Focus text' }).click()

		await expect(page.getByLabel('text field')).toBeFocused()
	})

	test('NcInputField: select all text', async ({ mount, page }) => {
		await mount(FocusSelectTest)

		await page.getByLabel('input field').fill('Hello ')
		// see that pressSequentially appends if nothing is selected
		await page.getByLabel('input field').pressSequentially('world')
		await expect(page.getByLabel('input field')).toHaveValue('Hello world')

		await page.getByRole('button', { name: 'Select input' }).click()
		await expect(page.getByLabel('input field')).toBeFocused()

		// now everything is selected to pressSequentially will overwrite the existing text
		await page.getByLabel('input field').pressSequentially('Hola')
		await expect(page.getByLabel('input field')).toHaveValue('Hola')
	})

	test('NcPasswordField: select all text', async ({ mount, page }) => {
		await mount(FocusSelectTest)

		await page.getByLabel('password field').fill('Hello world')
		await expect(page.getByLabel('password field')).toHaveValue('Hello world')

		await page.getByRole('button', { name: 'Select password' }).click()
		await expect(page.getByLabel('password field')).toBeFocused()

		await page.getByLabel('password field').pressSequentially('Hola')
		await expect(page.getByLabel('password field')).toHaveValue('Hola')
	})

	test('NcTextField: select all text', async ({ mount, page }) => {
		await mount(FocusSelectTest)

		await page.getByLabel('text field')
			.fill('Hello world')
		await expect(page.getByLabel('text field')).toHaveValue('Hello world')

		await page.getByRole('button', { name: 'Select text' }).click()
		await expect(page.getByLabel('text field')).toBeFocused()

		await page.getByLabel('text field').pressSequentially('Hola')
		await expect(page.getByLabel('text field')).toHaveValue('Hola')
	})
})
