/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import NcAppSidebarTabsStory from './NcAppSidebarTabs.story.vue'
import NcAppSidebarTabsSingleStory from './NcAppSidebarTabsSingle.story.vue'

test('single sidebar tab', async ({ mount, page }) => {
	await mount(NcAppSidebarTabsSingleStory)

	// does not show tablist and tab
	await expect(page.getByRole('tablist')).not.toBeVisible()
	await expect(page.getByRole('tab')).toHaveCount(0)
	await expect(page.getByRole('heading').filter({ hasText: 'tab name' })).toBeVisible()
})

test.describe('multiple sidebar tabs', () => {
	test.beforeEach(async ({ mount }) => {
		await mount(NcAppSidebarTabsStory)
	})

	test('has tablist', async ({ page }) => {
		await expect(page.getByRole('tablist')).toBeVisible()
	})

	test('displays all 3 tabs', async ({ page }) => {
		const tablist = page.getByRole('tablist')
		await expect(tablist.getByRole('tab')).toHaveCount(3)
	})

	test('updates active tab on click', async ({ page }) => {
		const tablist = page.getByRole('tablist')
		const selectedTab = tablist.getByRole('tab', { selected: true })
		const tab1 = tablist.getByRole('tab', { name: /Tab1/ })

		await expect(selectedTab).toContainText('Tab2')
		await expect(tab1).toBeVisible()
		await tab1.click()
		await expect(selectedTab).toContainText('Tab1')
	})

	test('updates active tab when pressing arrow left', async ({ page }) => {
		const tablist = page.getByRole('tablist')
		const selectedTab = tablist.getByRole('tab', { selected: true })

		await expect(selectedTab).toContainText('Tab2')
		await selectedTab.press('ArrowLeft')
		await expect(selectedTab).toContainText('Tab1')
	})

	test('updates active tab when pressing arrow right', async ({ page }) => {
		const tablist = page.getByRole('tablist')
		const selectedTab = tablist.getByRole('tab', { selected: true })

		await expect(selectedTab).toContainText('Tab2')
		await selectedTab.press('ArrowRight')
		await expect(selectedTab).toContainText('Tab3')
	})

	test('updates active tab to first one when pressing page-up', async ({ page }) => {
		const tablist = page.getByRole('tablist')
		const selectedTab = tablist.getByRole('tab', { selected: true })

		await selectedTab.press('ArrowRight')
		await expect(selectedTab).toContainText('Tab3')
		await selectedTab.press('PageUp')
		await expect(selectedTab).toContainText('Tab1')
	})

	test('updates active tab to last one when pressing page-down', async ({ page }) => {
		const tablist = page.getByRole('tablist')
		const selectedTab = tablist.getByRole('tab', { selected: true })

		await selectedTab.press('ArrowLeft')
		await expect(selectedTab).toContainText('Tab1')
		await selectedTab.press('PageDown')
		await expect(selectedTab).toContainText('Tab3')
	})
})
