/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { HooksConfig } from '../../setup/index'
import { expect, test } from '@playwright/experimental-ct-vue'

import AppNavigation from './AppNavigation.story.vue'

test.skip(({ browserName }) => browserName !== 'chromium')

// A little bit hacky but we test a wrapper element so we need to use the real NcContent and NcAppNavigation
test.beforeEach(async ({ mount, page }) => {
	const handle = await page.locator('#app-content').elementHandle()
	expect(handle).not.toBeNull()
	await handle!.evaluate((node) => { node.innerHTML = ''; node.id = 'root' })

	await mount<HooksConfig>(AppNavigation, {
		hooksConfig: {
			routes: [
				{ path: '/', component: AppNavigation },
				{ path: '/foo', component: AppNavigation },
			],
		},
	})
})

test('has primary styling on active route', { tag: '@visual' }, async ({ page }) => {
	const navigation = page.getByRole('navigation', { name: 'In-app navigation' })

	await expect(navigation).toBeVisible()
	await expect(navigation.getByRole('listitem').filter({ hasText: 'Home' })).toHaveScreenshot()
})

test('has primary button styling on active route with editing=true', { tag: '@visual' }, async ({ page }) => {
	const navigation = page.getByRole('navigation', { name: 'In-app navigation' })
	const item = navigation.getByRole('listitem').filter({ hasText: 'Home' })

	await expect(navigation).toBeVisible()
	await expect(item).toBeVisible()

	await item.getByRole('button', { name: 'Edit item' }).click()
	await expect(item.getByRole('textbox')).toBeVisible()

	await expect(item).toHaveScreenshot()
})

test('has tertiary styling on non active route', { tag: '@visual' }, async ({ page }) => {
	const navigation = page.getByRole('navigation', { name: 'In-app navigation' })
	const item = navigation.getByRole('listitem').filter({ hasText: 'Foo' })

	await expect(navigation).toBeVisible()
	await expect(item).toHaveScreenshot()
})

test('has primary styling on active entry', { tag: '@visual' }, async ({ page }) => {
	const navigation = page.getByRole('navigation', { name: 'In-app navigation' })
	const item = navigation.getByRole('listitem').filter({ hasText: 'Back' })

	await expect(navigation).toBeVisible()
	await expect(item).toHaveScreenshot()
})

test('has primary button styling on active entry with editing=true', { tag: '@visual' }, async ({ page }) => {
	const navigation = page.getByRole('navigation', { name: 'In-app navigation' })
	const item = navigation.getByRole('listitem').filter({ hasText: 'Back' })

	await expect(navigation).toBeVisible()
	await expect(item).toBeVisible()

	await item.getByRole('button', { name: 'Edit item' }).click()
	await expect(item.getByRole('textbox')).toBeVisible()

	await expect(item).toHaveScreenshot()
})

test('has tertiary styling on non active entry', { tag: '@visual' }, async ({ page }) => {
	const navigation = page.getByRole('navigation', { name: 'In-app navigation' })
	const item = navigation.getByRole('listitem').filter({ hasText: 'Bar' })

	await expect(navigation).toBeVisible()
	await expect(item).toHaveScreenshot()
})
