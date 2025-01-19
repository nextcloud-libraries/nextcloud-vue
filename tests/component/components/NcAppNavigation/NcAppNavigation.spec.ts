/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { HooksConfig } from '../../setup/index'
import { expect, test } from '@playwright/experimental-ct-vue'

import AppNavigation from './NcAppNavigation.story.vue'

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

test('opens on n keyboard press', async ({ page }) => {
	await expect(page.getByText('First')).toBeVisible();

	// cy.get('nav').then(($nav) => {
	// 	const id = $nav.attr('id')
	// 	cy.get(`[aria-controls="${id}"`).as('appNavigationToggle')
	// 	cy.get('@appNavigationToggle').should('have.attr', 'aria-expanded', 'true')
	// 	cy.get('nav').should('have.attr', 'aria-hidden', 'false')
	// 	cy.get('nav').should('not.have.attr', 'inert')

	// 	// close the sidebar
	// 	cy.get('@appNavigationToggle').click()

	// 	cy.get('@appNavigationToggle').should('have.attr', 'aria-expanded', 'false')
	// 	cy.get('nav').should('have.attr', 'aria-hidden', 'true')
	// 	cy.get('nav').should('have.attr', 'inert')

	// 	// open the sidebar with the keyboard
	// 	cy.get('body').type('n')

	// 	cy.get('@appNavigationToggle').should('have.attr', 'aria-expanded', 'true')
	// 	cy.get('nav').should('have.attr', 'aria-hidden', 'false')
	// 	cy.get('nav').should('not.have.attr', 'inert')

	// 	// make sure we auto-focus the first item
	// 	cy.document().then((doc) => {
	// 		const activeElement = doc.activeElement
	// 		const navigation = doc.querySelector('nav')
	// 		// eslint-disable-next-line no-unused-expressions
	// 		expect(navigation?.contains(activeElement)).to.be.true
	// 	})
	// })
})

test('closes on n keyboard press', async ({ page }) => {
	await expect(page.getByText('First')).toBeVisible()
	const navigation = page.getByRole('navigation')

	await expect(navigation).toHaveAttribute('aria-hidden', 'false')
	await expect(navigation).not.toHaveAttribute('inert')

	// pressing n does nothing until we focus something within
	page.locator('body').press('n')
	await expect(navigation).toHaveAttribute('aria-hidden', 'false')
	await expect(navigation).not.toHaveAttribute('inert')

	// focus something within
	navigation.getByRole('link').first().focus()

	// pressing n closes the sidebar
	page.locator('body').press('n')
	await expect(navigation).toHaveAttribute('aria-hidden', 'true')
	await expect(navigation).toHaveAttribute('inert')
})
