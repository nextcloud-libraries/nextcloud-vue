/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import NcCard from '../../../src/components/NcCard/NcCard.vue'

test('follows the link from the empty space of the content and the footer, but not from their controls', async ({ mount, page }) => {
	const card = await mount(NcCard, {
		props: { name: 'Design', href: '#followed', style: 'width: 400px' },
		slots: {
			default: '<p class="content">Six members</p>',
			footer: '<button type="button" class="footer-button">Join</button>',
		},
	})

	// The end of the content row, right of its text
	const content = (await card.locator('.content').boundingBox())!
	await page.mouse.click(content.x + content.width - 10, content.y + content.height / 2)
	await expect(page).toHaveURL(/#followed$/)

	await page.evaluate(() => history.replaceState(null, '', '#'))
	await card.locator('.footer-button').click()
	await expect(page).not.toHaveURL(/#followed$/)
})

test('marks the active card in forced colors', async ({ mount, page }) => {
	await page.emulateMedia({ forcedColors: 'active' })
	const card = await mount(NcCard, { props: { name: 'Design', active: true } })
	const highlight = await page.evaluate(() => {
		const probe = document.createElement('div')
		probe.style.color = 'Highlight'
		document.body.append(probe)
		return getComputedStyle(probe).color
	})
	await expect(card).toHaveCSS('border-top-color', highlight)
	await expect(card).toHaveCSS('outline-color', highlight)
})

test('rounds the corners of the clickable area like the card', async ({ mount }) => {
	const card = await mount(NcCard, { props: { name: 'Design', href: '#' } })
	const radius = await card.locator('a').evaluate((element) => getComputedStyle(element, '::after').borderTopLeftRadius)
	expect(radius).not.toBe('0px')
	await expect(card).toHaveCSS('border-top-left-radius', radius)
})
