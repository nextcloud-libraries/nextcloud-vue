/**
 * SPDX-FileCopyrightText: Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import UserSelect from './UserSelect.story.vue'

test('has options', async ({ mount, page }) => {
	const component = await mount(UserSelect)

	await expect(component.getByRole('searchbox')).toBeVisible()
	await component.getByRole('searchbox').click()

	expect(await page.getByRole('option').all()).toHaveLength(3)
	await expect(page.getByRole('option', { name: 'Olivia' })).toBeVisible()
	await expect(page.getByRole('option', { name: 'John' })).toBeVisible()
	await expect(page.getByRole('option', { name: 'Emma' })).toBeVisible()
})

test('can filter by name', async ({ mount, page }) => {
	const component = await mount(UserSelect)

	await expect(component.getByRole('searchbox')).toBeVisible()
	await component.getByRole('searchbox').fill('Em')

	await expect(page.getByRole('option', { name: 'Emma' })).toBeVisible()
	expect(await page.getByRole('option').all()).toHaveLength(1)
})

test('can filter by mail', async ({ mount, page }) => {
	const component = await mount(UserSelect)

	await expect(component.getByRole('searchbox')).toBeVisible()
	await component.getByRole('searchbox').fill('olivia@example')

	await expect(page.getByRole('option', { name: 'Olivia' })).toBeVisible()
	expect(await page.getByRole('option').all()).toHaveLength(1)
})

test(
	'can filter by mail in brackets',
	{
		annotation: {
			type: 'issue',
			description: 'https://github.com/nextcloud-libraries/nextcloud-vue/issues/4491',
		},
	},
	async ({ mount, page }) => {
		const component = await mount(UserSelect)

		await expect(component.getByRole('searchbox')).toBeVisible()
		await component.getByRole('searchbox').fill('O. <')

		// should not exist right now as neither Name no email provided
		await expect(page.getByText('No results')).toBeVisible()
		expect(await page.getByRole('option', { name: 'Olivia' }).all()).toHaveLength(0)

		await component.getByRole('searchbox').fill('O. <olivia')
		// now it should match the name
		await expect(page.getByRole('option', { name: 'Olivia' })).toBeVisible()

		await component.getByRole('searchbox').fill('O. <olivia@example.org>')
		// now it should match the email
		await expect(page.getByRole('option', { name: 'Olivia' })).toBeVisible()
		expect(await page.getByRole('option').all()).toHaveLength(1)
	},
)
