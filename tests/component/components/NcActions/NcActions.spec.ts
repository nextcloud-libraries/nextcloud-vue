/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import NcActions from './NcActions.story.vue'
import NcActionsEvents from './NcActionsEvents.story.vue'

test('menu uses the container radius and its items the element radius', async ({ mount, page }) => {
	await mount(NcActions)
	await page.getByRole('button', { name: 'Actions' }).click()

	const menu = page.getByRole('menu')
	await expect(menu).toBeVisible()
	await expect(page.locator('.action-item__popper .v-popper__wrapper')).toHaveCSS('border-radius', '12px')
	await expect(page.locator('.action-item__popper .v-popper__inner')).toHaveCSS('border-radius', '12px')

	const item = menu.locator('li.action').filter({ hasText: 'Edit' })
	await item.hover()
	await expect(item).toHaveCSS('border-radius', '8px')
})

test.describe('opened and closed events', () => {
	for (const duration of ['0s', '100ms', '1s']) {
		test(`are emitted with a ${duration} transition`, async ({ mount, page }) => {
			await page.addStyleTag({ content: `:root { --animation-quick: ${duration} }` })
			await mount(NcActionsEvents)
			const toggle = page.getByRole('button', { name: 'Actions' })

			await toggle.click()
			await expect(page.getByRole('menu')).toBeVisible()
			await expect(page.getByTestId('opened')).toHaveText('1')

			await page.keyboard.press('Escape')
			await expect(page.getByRole('menu')).toBeHidden()
			// floating-vue detaches the menu after 150ms, which cancels a longer transition
			await expect(page.getByTestId('closed')).toHaveText('1')
			await expect(page.getByTestId('opened')).toHaveText('1')
		})
	}

	test('closed is not emitted when reopened before the closing transition ended', async ({ mount, page }) => {
		await page.addStyleTag({ content: ':root { --animation-quick: 1s }' })
		await mount(NcActionsEvents)
		const toggle = page.getByRole('button', { name: 'Actions' })

		await toggle.click()
		await expect(page.getByTestId('opened')).toHaveText('1')

		await page.keyboard.press('Escape')
		await toggle.evaluate(async (button) => {
			const popper = document.querySelector('.action-item__popper')!
			await new Promise<void>((resolve) => {
				const waitForHideTransition = () => {
					if (popper.classList.contains('v-popper__popper--hidden') && popper.getAnimations().length > 0) {
						resolve()
					} else {
						requestAnimationFrame(waitForHideTransition)
					}
				}
				waitForHideTransition()
			})
			// Reopen and end the closing transition before floating-vue applies the show
			button.click()
			popper.getAnimations().forEach((animation) => animation.finish())
		})

		await expect(page.getByTestId('opened')).toHaveText('2')
		await expect(page.getByRole('menu')).toBeVisible()
		await expect(page.getByTestId('closed')).toHaveText('0')
	})
})
