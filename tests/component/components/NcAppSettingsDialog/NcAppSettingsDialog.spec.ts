/*!
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import AppSettings from './AppSettings.story.vue'

test('Dialog has visible headline', async ({ mount, page }) => {
	await mount(AppSettings)

	const dialog = page.getByRole('dialog')
	await expect(dialog).toBeVisible()
	await expect(dialog.getByRole('heading', { level: 2 })).toBeVisible()
	await expect(dialog.getByRole('heading', { level: 2 })).toHaveText('Settings dialog')
})

test('Dialog is correctly labelled', async ({ mount, page }) => {
	await mount(AppSettings)

	const dialog = page.getByRole('dialog')
	await expect(dialog).toBeVisible()
	await expect(dialog).toHaveAccessibleName('Settings dialog')
})

test('Dialog sections have navigation entries', async ({ mount, page }) => {
	await mount(AppSettings)

	const dialog = page.getByRole('dialog')
	await expect(dialog).toBeVisible()

	const navigation = dialog.getByRole('navigation')
	await expect(navigation).toBeVisible()
	await expect(navigation.getByRole('link', { name: 'First section' })).toBeVisible()
	await expect(navigation.getByRole('link', { name: 'Second section' })).toBeVisible()
})

test('Dialog sections are correctly labelled', async ({ mount, page }) => {
	await mount(AppSettings)

	const dialog = page.getByRole('dialog')
	await expect(dialog).toBeVisible()

	const firstSection = dialog.getByRole('region', { name: 'First section' })
	await expect(firstSection).toHaveCount(1)
	await expect(firstSection).toContainText('First content')
	await expect(firstSection.getByRole('heading')).toHaveText('First section')

	const secondSection = dialog.getByRole('region', { name: 'Second section' })
	await expect(secondSection).toHaveCount(1)
	await expect(secondSection).toContainText('Second content')
	await expect(secondSection.getByRole('heading')).toHaveText('Second section')
})
