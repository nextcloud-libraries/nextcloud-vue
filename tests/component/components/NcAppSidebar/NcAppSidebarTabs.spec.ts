/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import NcAppSidebarTabsStory from './NcAppSidebarTabs.story.vue'
import NcAppSidebarTabsIconsStory from './NcAppSidebarTabsIcons.story.vue'
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

	test('sliding highlight follows the hovered tab', async ({ page }) => {
		const tablist = page.getByRole('tablist')
		const highlight = tablist.locator('.app-sidebar-tabs__highlight')
		const tab1 = tablist.getByRole('tab', { name: /Tab1/ })
		const activeTab = tablist.getByRole('tab', { selected: true })

		// Hidden until a tab is hovered
		await expect(highlight).not.toHaveClass(/highlight--visible/)

		// Over a non-active tab it shows
		await tab1.hover()
		await expect(highlight).toHaveClass(/highlight--visible/)
		await expect(highlight).not.toHaveClass(/highlight--over-active/)

		// Over the active tab it turns transparent so the tab's own background shows
		await activeTab.hover()
		await expect(highlight).toHaveClass(/highlight--over-active/)

		// Hidden again once the pointer leaves the tablist
		await page.mouse.move(0, 0)
		await expect(highlight).not.toHaveClass(/highlight--visible/)
	})

	test('keyboard focus moves the highlight and hides it when focus leaves', async ({ page }) => {
		const tablist = page.getByRole('tablist')
		const highlight = tablist.locator('.app-sidebar-tabs__highlight')

		await expect(highlight).not.toHaveClass(/highlight--visible/)

		// Focusing a tab shows the highlight on it, without any pointer involved
		await tablist.getByRole('tab', { selected: true }).focus()
		await expect(highlight).toHaveClass(/highlight--visible/)

		// It covers the focused tab
		const coversFocusedTab = async () => {
			const [hl, tab] = await Promise.all([
				highlight.boundingBox(),
				tablist.locator('[role="tab"]:focus').boundingBox(),
			])
			return hl && tab ? Math.abs(hl.x - tab.x) <= 1 && Math.abs(hl.width - tab.width) <= 1 : false
		}
		await expect.poll(coversFocusedTab).toBe(true)

		// Arrow keys move the focus, and the highlight follows it
		await page.keyboard.press('ArrowLeft')
		await expect(highlight).toHaveClass(/highlight--visible/)
		await expect.poll(coversFocusedTab).toBe(true)

		// Moving focus out of the tablist hides it again
		await page.locator('body').evaluate((body) => {
			const outside = document.createElement('button')
			outside.textContent = 'outside'
			body.append(outside)
			outside.focus()
		})
		await expect(highlight).not.toHaveClass(/highlight--visible/)
	})
})

test.describe('sidebar tab click feedback', () => {
	test('clicking a tab plays the icon pop animation', async ({ mount, page }) => {
		await mount(NcAppSidebarTabsStory)
		const tablist = page.getByRole('tablist')
		const tab1 = tablist.getByRole('tab', { name: /Tab1/ })
		// The icon wrapper is the first child element of the button
		const icon = tab1.locator('> span').first()

		// No animation until the tab is clicked
		await expect
			.poll(async () => icon.evaluate((el) => getComputedStyle(el).animationName))
			.toBe('none')

		await tab1.click()

		// The pop keyframes run as click feedback
		await expect
			.poll(async () => icon.evaluate((el) => getComputedStyle(el).animationName))
			.toContain('sidebar-tab-icon-pop')
	})
})

test.describe('sidebar tab icons', () => {
	test('active tab crossfades to the filled icon variant, others show the outline', async ({ mount, page }) => {
		await mount(NcAppSidebarTabsIconsStory)

		// Both variants are always rendered (stacked) so they can crossfade; the
		// active one is opaque and the other is transparent. The layer is the
		// marker's parent element.
		const layer = (testid: string) => page.locator(`[data-testid="${testid}"]`).locator('xpath=..')

		// Tab2 is active: filled visible, outline hidden. Tab1 is the opposite.
		await expect(layer('second-filled')).toHaveCSS('opacity', '1')
		await expect(layer('second-outline')).toHaveCSS('opacity', '0')
		await expect(layer('first-outline')).toHaveCSS('opacity', '1')
		await expect(layer('first-filled')).toHaveCSS('opacity', '0')

		// Switching crossfades the newly active tab to filled and the old one back
		await page.getByRole('tab', { name: /Tab1/ }).click()
		await expect(layer('first-filled')).toHaveCSS('opacity', '1')
		await expect(layer('first-outline')).toHaveCSS('opacity', '0')
		await expect(layer('second-outline')).toHaveCSS('opacity', '1')
		await expect(layer('second-filled')).toHaveCSS('opacity', '0')
	})
})
