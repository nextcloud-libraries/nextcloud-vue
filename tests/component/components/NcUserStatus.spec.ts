/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import NcUserStatusIcon from '../../../src/components/NcUserStatusIcon/NcUserStatusIcon.vue'

test('fetches the user status', async ({ mount, page }) => {
	await page.addScriptTag({ content: 'window._oc_capabilities = { user_status: { enabled: true } };' })
	await page.route('**/ocs/v2.php/apps/user_status/api/v1/statuses/jdoe', (route) => {
		route.fulfill({ status: 200, json: { ocs: { data: { status: 'online' } } } })
	})

	const component = await mount(NcUserStatusIcon, {
		props: {
			user: 'jdoe',
		},
	})

	await expect(page.getByRole('img', { name: 'User status: online' })).toBeVisible()
	await expect(component).not.toHaveAttribute('aria-hidden')
})

test('does not fetch the user status if preloaded', async ({ mount, page }) => {
	await page.addScriptTag({ content: 'window._oc_capabilities = { user_status: { enabled: true } };' })
	await page.route('**/ocs/v2.php/apps/user_status/api/v1/statuses/jdoe', (route) => {
		route.abort()
		throw new Error('Should not be accessed')
	})

	const component = await mount(NcUserStatusIcon, {
		props: {
			user: 'jdoe',
			status: 'dnd',
		},
	})

	await expect(page.getByRole('img', { name: 'User status: do not disturb' })).toBeVisible()
	await expect(component).not.toHaveAttribute('aria-hidden')
})

test('explicitily make element visible for accessibility', async ({ mount, page }) => {
	await page.addScriptTag({ content: 'window._oc_capabilities = { user_status: { enabled: true } };' })
	await page.route('**/ocs/v2.php/apps/user_status/api/v1/statuses/jdoe', (route) => {
		route.abort()
		throw new Error('Should not be accessed')
	})

	const component = await mount(NcUserStatusIcon, {
		props: {
			user: 'jdoe',
			status: 'dnd',
			ariaHidden: false,
		},
	})

	await expect(page.getByRole('img', { name: 'User status: do not disturb' })).toBeVisible()
	await expect(component).not.toHaveAttribute('aria-hidden')
})

test('explicitily make element visible for accessibility (legacy)', async ({ mount, page }) => {
	await page.addScriptTag({ content: 'window._oc_capabilities = { user_status: { enabled: true } };' })
	await page.route('**/ocs/v2.php/apps/user_status/api/v1/statuses/jdoe', (route) => {
		route.abort()
		throw new Error('Should not be accessed')
	})

	const component = await mount(NcUserStatusIcon, {
		props: {
			user: 'jdoe',
			status: 'dnd',
			ariaHidden: 'false',
		},
	})

	await expect(page.getByRole('img', { name: 'User status: do not disturb' })).toBeVisible()
	await expect(component).not.toHaveAttribute('aria-hidden')
})

test('can hide the element from accessibility tree', async ({ mount, page }) => {
	const component = await mount(NcUserStatusIcon, {
		props: {
			user: 'jdoe',
			status: 'dnd',
			ariaHidden: true,
		},
	})

	await expect(page.locator('svg')).toBeVisible()
	await expect(component).not.toHaveAttribute('aria-label')
	await expect(component).toHaveAttribute('aria-hidden', 'true')
})

test('can hide the element from accessibility tree (legacy)', async ({ mount, page }) => {
	const component = await mount(NcUserStatusIcon, {
		props: {
			user: 'jdoe',
			status: 'dnd',
			ariaHidden: 'true',
		},
	})

	await expect(page.locator('svg')).toBeVisible()
	await expect(component).not.toHaveAttribute('aria-label')
	await expect(component).toHaveAttribute('aria-hidden', 'true')
})
