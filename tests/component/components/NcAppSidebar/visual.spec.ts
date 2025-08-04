/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { expect, test } from '@playwright/experimental-ct-vue'
import AppSidebar from './AppSidebar.story.vue'

test.skip(({ browserName }) => browserName !== 'chromium')

// A little bit hacky but we test a wrapper element so we need to use the real NcContent and NcAppNavigation
test.beforeEach(async ({ page }) => {
	const handle = await page.locator('#content').elementHandle()
	expect(handle).not.toBeNull()
	await handle!.evaluate((node) => {
		node.innerHTML = ''
		node.id = 'root'
	})
})

new Array(2 ** 5)
	.fill('')
	.map((_, index) => ({
		compact: Boolean(index & 16),
		subname: Boolean(index & 8),
		nameEditable: Boolean(index & 4),
		header: Boolean(index & 2),
		secondaryActions: Boolean(index & 1),
	}))
	.forEach((props, index) => {
		test(
			`Sidebar header${props.compact ? ': compact ' : (index > 0 ? ': ' : '')}${props.subname ? 'subname ' : ''}${props.nameEditable ? 'editable ' : ''}${props.header ? 'header ' : ''}${props.secondaryActions ? 'actions' : ''}`,
			{ tag: '@visual' },
			async ({ mount }) => {
				const component = await mount(AppSidebar, {
					props,
				})
				await expect(component).toBeVisible()
				await expect(component.locator('header')).toHaveScreenshot({ caret: 'hide' })
			},
		)
	})
