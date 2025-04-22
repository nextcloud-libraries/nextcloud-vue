/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { expect, test } from '@playwright/experimental-ct-vue'
import NcSavingIndicatorIcon from '../../../src/components/NcSavingIndicatorIcon/NcSavingIndicatorIcon.vue'

test('Icon has accessible name', async ({ mount, page }) => {
	const component = await mount(NcSavingIndicatorIcon, {
		props: {
			name: 'Saving something',
		},
	})

	await expect(page.getByRole('img', { name: 'Saving something' })).toBeVisible()

	// reactivity
	await component.update({ props: { name: 'Saving nothing' } })
	await expect(page.getByRole('img', { name: 'Saving nothing' })).toBeVisible()
})

test('Can specify size', async ({ mount }) => {
	const component = await mount(NcSavingIndicatorIcon, {
		props: {
			size: 42,
			name: 'Saving something',
		},
	})

	const box = await component.getByRole('img').boundingBox()
	expect(box?.height).toBe(42)
	expect(box?.width).toBe(42)

	// reactive
	await component.update({
		props: {
			size: 24,
		},
	})
	const boxSmall = await component.getByRole('img').boundingBox()
	expect(boxSmall?.height).toBe(24)
	expect(boxSmall?.width).toBe(24)
})

test('Has click event', async ({ mount }) => {
	let clicked = 0
	const component = await mount(NcSavingIndicatorIcon, {
		on: {
			click() {
				clicked++
			},
		},
	})

	expect(clicked).toBe(0)
	await component.click()
	await component.click()
	expect(clicked).toBe(2)
})

test.describe('Icon is rendered with correct color', { tag: '@visual' }, () => {
	// visual tests only run on chromium
	test.skip(({ browserName }) => browserName !== 'chromium')

	// ensure screenshots look consistent
	test.beforeEach(({ page }) => {
		page.addStyleTag({ content: '#app-content { padding: 12px; }\n' })
	})

	for (const [error, saving] of [[false, false], [false, true], [true, false]]) {
		test(`with error (${error}) and saving (${saving}) prop`, async ({ mount }) => {
			const component = await mount(NcSavingIndicatorIcon, {
				props: {
					name: 'Saving something',
					error,
					saving,
				},
			})

			await expect(component).toHaveScreenshot()
		})
	}
})
