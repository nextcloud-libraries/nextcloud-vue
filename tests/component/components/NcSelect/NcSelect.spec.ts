/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import NcSelectStory from './NcSelect.story.vue'

test('selected option has visually-hidden selected marker in dropdown', async ({ mount, page }) => {
	const component = await mount(NcSelectStory, {
		props: { initialValue: 'Banana' },
	})

	await component.getByRole('searchbox').click()

	// The selected option should contain ", selected" text (visually hidden)
	await expect(page.getByRole('option', { name: 'Banana' })).toContainText('(selected)')
	// Non-selected options should not
	await expect(page.getByRole('option', { name: 'Cherry' })).not.toContainText('(selected)')
})

test('selected marker stays on correct option during keyboard navigation', async ({ mount, page }) => {
	const component = await mount(NcSelectStory, {
		props: { initialValue: 'Banana' },
	})

	await component.getByRole('searchbox').click()
	// Navigate away from the selected option
	await page.keyboard.press('ArrowDown')

	// Banana is still the selected value — marker stays
	await expect(page.getByRole('option', { name: 'Banana' })).toContainText('(selected)')
	// Cherry is only keyboard-focused, not selected — no marker
	await expect(page.getByRole('option', { name: 'Cherry' })).not.toContainText('(selected)')
})

test('selected marker updates after selecting a different option', async ({ mount, page }) => {
	const component = await mount(NcSelectStory, {
		props: { initialValue: 'Banana' },
	})

	await component.getByRole('searchbox').click()
	await page.getByRole('option', { name: 'Cherry' }).click()

	// Re-open dropdown
	await component.getByRole('searchbox').click()

	await expect(page.getByRole('option', { name: 'Cherry' })).toContainText('(selected)')
	await expect(page.getByRole('option', { name: 'Banana' })).not.toContainText('(selected)')
})

test('multiple selected options have selected marker in dropdown', async ({ mount, page }) => {
	const component = await mount(NcSelectStory, {
		props: { multiple: true, keepOpen: true, initialValue: ['Apple', 'Cherry'] },
	})

	await component.getByRole('searchbox').click()

	await expect(page.getByRole('option', { name: 'Apple' })).toContainText('(selected)')
	await expect(page.getByRole('option', { name: 'Cherry' })).toContainText('(selected)')
	await expect(page.getByRole('option', { name: 'Banana' })).not.toContainText('(selected)')
})

test('selected marker updates in keepOpen mode without closing dropdown', async ({ mount, page }) => {
	const component = await mount(NcSelectStory, {
		props: { initialValue: 'Apple', keepOpen: true },
	})

	await component.getByRole('searchbox').click()
	await page.getByRole('option', { name: 'Cherry' }).click()

	await expect(page.getByRole('option', { name: 'Cherry' })).toContainText('(selected)')
	await expect(page.getByRole('option', { name: 'Apple' })).not.toContainText('(selected)')
})

test('search input describes the selected value', async ({ mount }) => {
	const component = await mount(NcSelectStory, {
		props: { initialValue: 'Banana' },
	})

	const searchbox = component.getByRole('searchbox')
	const describedBy = await searchbox.getAttribute('aria-describedby')
	expect(describedBy).toBeTruthy()

	const descriptionEl = component.locator(`#${describedBy}`)
	await expect(descriptionEl).toContainText('Banana')
})

test('selected value description is empty when nothing selected', async ({ mount }) => {
	const component = await mount(NcSelectStory)

	const searchbox = component.getByRole('searchbox')
	const describedBy = await searchbox.getAttribute('aria-describedby')
	expect(describedBy).toBeTruthy()

	const descriptionEl = component.locator(`#${describedBy}`)
	await expect(descriptionEl).toHaveText('')
})

test('search input describes multiple selected values', async ({ mount }) => {
	const component = await mount(NcSelectStory, {
		props: { multiple: true, initialValue: ['Apple', 'Cherry'] },
	})

	const searchbox = component.getByRole('searchbox')
	const describedBy = await searchbox.getAttribute('aria-describedby')
	expect(describedBy).toBeTruthy()

	const descriptionEl = component.locator(`#${describedBy}`)
	await expect(descriptionEl).toContainText('Apple')
	await expect(descriptionEl).toContainText('Cherry')
})
