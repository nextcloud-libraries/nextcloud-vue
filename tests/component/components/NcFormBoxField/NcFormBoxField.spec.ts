/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import NcFormBoxFieldStory from './NcFormBoxField.story.vue'

test.describe('NcFormBoxField', () => {
	test('edits and saves', async ({ mount, page }) => {
		await mount(NcFormBoxFieldStory)
		await page.getByRole('button', { name: 'Before' }).focus()
		await page.keyboard.press('Tab')
		const row = page.getByRole('button', { name: 'Edit Device name' })
		await expect(row).toBeFocused()

		await page.keyboard.press('Enter')
		const input = page.getByRole('textbox', { name: 'Device name' })
		await expect(input).toBeFocused()
		// Value is selected, so typing replaces it
		await page.keyboard.type('Laptop key')
		await page.keyboard.press('Enter')

		await expect(row).toBeFocused()
		await expect(row).toHaveAccessibleDescription('Laptop key')
	})

	test('Escape restores the value and the focus', async ({ mount, page }) => {
		await mount(NcFormBoxFieldStory)
		const row = page.getByRole('button', { name: 'Edit Device name' })
		await row.focus()
		await page.keyboard.press('Enter')
		await page.keyboard.type('Discarded')
		await page.keyboard.press('Escape')

		await expect(row).toBeFocused()
		await expect(row).toHaveAccessibleDescription('YubiKey')
	})

	test('keeps focus in the input on error', async ({ mount, page }) => {
		await mount(NcFormBoxFieldStory)
		await page.getByRole('button', { name: 'Edit Device name' }).focus()
		await page.keyboard.press('Enter')
		await page.keyboard.press('Backspace')
		await page.keyboard.press('Enter')

		const input = page.getByRole('textbox', { name: 'Device name' })
		await expect(input).toHaveAttribute('aria-invalid', 'true')
		await expect(input).toHaveAccessibleDescription('Name cannot be empty')
		await expect(input).toBeFocused()
	})

	test('leaving a changed field saves it without taking focus back', async ({ mount, page }) => {
		await mount(NcFormBoxFieldStory)
		const row = page.getByRole('button', { name: 'Edit Device name' })
		await row.focus()
		await page.keyboard.press('Enter')
		await page.keyboard.type('Laptop key')
		await page.keyboard.press('Tab')

		await expect(row).toHaveAccessibleDescription('Laptop key')
		await expect(page.getByRole('button', { name: 'Edit Current password' })).toBeFocused()
	})

	test('leaving an unchanged field closes it', async ({ mount, page }) => {
		await mount(NcFormBoxFieldStory)
		await page.getByRole('button', { name: 'Edit Device name' }).click()
		await page.getByRole('button', { name: 'Before' }).click()

		await expect(page.getByRole('button', { name: 'Edit Device name' })).toHaveAccessibleDescription('YubiKey')
	})

	test('clicking the label keeps editing', async ({ mount, page }) => {
		await mount(NcFormBoxFieldStory)
		await page.getByRole('button', { name: 'Edit Device name' }).click()
		await page.keyboard.type('Laptop key')
		await page.getByText('Device name', { exact: true }).click()

		// The counter goes up synchronously on submit, so this can't pass before a late save
		await expect(page.locator('[data-test=name-submits]')).toHaveText('0')
		const input = page.getByRole('textbox', { name: 'Device name' })
		await expect(input).toBeFocused()
		await expect(input).toHaveValue('Laptop key')
	})

	test('leaving after a rejected submit does not send it again', async ({ mount, page }) => {
		await mount(NcFormBoxFieldStory)
		await page.getByRole('button', { name: 'Edit Device name' }).click()
		await page.keyboard.press('Backspace')
		await page.keyboard.press('Enter')
		await expect(page.getByRole('textbox', { name: 'Device name' })).toHaveAccessibleDescription('Name cannot be empty')
		await page.getByRole('button', { name: 'Before' }).click()

		await expect(page.locator('[data-test=name-submits]')).toHaveText('1')
	})

	test('a step change in a text field keeps it open', async ({ mount, page }) => {
		await mount(NcFormBoxFieldStory)
		await page.getByRole('button', { name: 'Edit Step one' }).click()
		await page.keyboard.type('x')
		await page.keyboard.press('Enter')

		await expect(page.getByRole('textbox', { name: 'Step two' })).toBeFocused()
	})

	test('leaving a password field keeps it open', async ({ mount, page }) => {
		await mount(NcFormBoxFieldStory)
		await page.getByRole('button', { name: 'Edit Current password' }).click()
		await page.keyboard.type('half')
		await page.getByRole('button', { name: 'Before' }).click()

		await expect(page.getByLabel('Current password')).toHaveValue('half')
		await expect(page.getByLabel('Current password')).not.toHaveAttribute('aria-invalid')
	})

	test('password: wrong, then next step, then cancel from the toggle', async ({ mount, page }) => {
		await mount(NcFormBoxFieldStory)
		const row = page.getByRole('button', { name: 'Edit Current password' })
		await row.focus()
		await page.keyboard.press('Enter')

		await page.keyboard.type('wrong')
		await page.keyboard.press('Enter')
		await expect(page.getByLabel('Current password')).toHaveAccessibleDescription('Wrong password')
		await expect(page.getByLabel('Current password')).toBeFocused()

		await page.keyboard.press('Control+a')
		await page.keyboard.type('nextcloud')
		await page.keyboard.press('Enter')
		const newPassword = page.getByLabel('New password')
		await expect(newPassword).toBeFocused()
		await expect(newPassword).toHaveValue('')

		await page.keyboard.type('secret')
		await page.keyboard.press('Tab')
		await expect(page.getByRole('button', { name: 'Show password' })).toBeFocused()
		await page.keyboard.press('Enter')
		await expect(newPassword).toHaveAttribute('type', 'text')
		await expect(page.getByRole('button', { name: 'Hide password' })).toBeFocused()

		await page.keyboard.press('Escape')
		await expect(row).toBeFocused()
	})
})
