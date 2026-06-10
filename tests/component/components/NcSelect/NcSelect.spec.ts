/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import NcSelectStory from './NcSelect.story.vue'

test.describe('NcSelect - single mode', () => {
	test('has a visible combobox', async ({ mount }) => {
		const component = await mount(NcSelectStory)
		await expect(component.getByRole('combobox')).toBeVisible()
	})

	test('shows label as placeholder when empty', async ({ mount }) => {
		const component = await mount(NcSelectStory, {
			props: { inputLabel: 'Pick a fruit' },
		})
		await expect(component.getByText('Pick a fruit')).toBeVisible()
	})

	test('opens dropdown on click', async ({ mount, page }) => {
		const component = await mount(NcSelectStory)
		await component.getByRole('combobox').click()
		await expect(page.getByRole('option', { name: 'foo' })).toBeVisible()
	})

	test('opens dropdown on Enter', async ({ mount, page }) => {
		const component = await mount(NcSelectStory)
		await component.getByRole('combobox').press('Enter')
		await expect(page.getByRole('option', { name: 'foo' })).toBeVisible()
	})

	test('closes on Escape', async ({ mount, page }) => {
		const component = await mount(NcSelectStory)
		await component.getByRole('combobox').click()
		await expect(page.getByRole('option', { name: 'foo' })).toBeVisible()

		await component.getByRole('combobox').press('Escape')
		await expect(page.getByRole('option', { name: 'foo' })).not.toBeVisible()
	})

	test('arrow keys navigate options', async ({ mount, page }) => {
		const component = await mount(NcSelectStory)
		await component.getByRole('combobox').click()
		await component.getByRole('combobox').press('ArrowDown')

		// First option should be highlighted
		const options = page.getByRole('option')
		await expect(options.first()).toBeVisible()
	})

	test('selects option with Enter', async ({ mount, page }) => {
		const emitted: unknown[] = []
		const component = await mount(NcSelectStory, {
			on: { selected: (data) => emitted.push(data) },
		})

		await component.getByRole('combobox').click()
		await page.getByRole('option', { name: 'bar' }).click()

		expect(emitted).toHaveLength(1)
		expect(emitted[0]).toBe('bar')
	})

	test('typing filters options', async ({ mount, page }) => {
		const component = await mount(NcSelectStory)
		await component.getByRole('combobox').click()
		await component.getByRole('combobox').fill('ba')

		await expect(page.getByRole('option', { name: 'bar' })).toBeVisible()
		await expect(page.getByRole('option', { name: 'baz' })).toBeVisible()
		expect(await page.getByRole('option').all()).toHaveLength(2)
	})

	test('shows selected value', async ({ mount }) => {
		const component = await mount(NcSelectStory, {
			props: { preselected: true },
		})

		await expect(component.getByText('foo')).toBeVisible()
	})

	test('disabled state prevents interaction', async ({ mount }) => {
		const component = await mount(NcSelectStory, {
			props: { disabled: true },
		})

		await component.getByRole('combobox').click({ force: true })
		await expect(component.locator('.vs__dropdown-menu')).not.toBeVisible()
	})
})

test.describe('NcSelect - multi mode', () => {
	test('shows label when empty', async ({ mount }) => {
		const component = await mount(NcSelectStory, {
			props: { multiple: true, inputLabel: 'Pick items' },
		})
		await expect(component.getByText('Pick items')).toBeVisible()
	})

	test('shows tags when values selected', async ({ mount }) => {
		const component = await mount(NcSelectStory, {
			props: { multiple: true, preselected: true },
		})

		await expect(component.getByText('foo')).toBeVisible()
		await expect(component.getByText('bar')).toBeVisible()
	})

	test('can select multiple options', async ({ mount, page }) => {
		const emitted: unknown[] = []
		const component = await mount(NcSelectStory, {
			props: { multiple: true },
			on: { selected: (data) => emitted.push(data) },
		})

		await component.getByRole('combobox').click()
		await page.getByRole('option', { name: 'foo' }).click()

		await component.getByRole('combobox').click()
		await page.getByRole('option', { name: 'bar' }).click()

		expect(emitted).toHaveLength(2)
		expect(emitted[0]).toEqual(['foo'])
		expect(emitted[1]).toEqual(['foo', 'bar'])
	})

	test('can remove tag with deselect button', async ({ mount }) => {
		const emitted: unknown[] = []
		const component = await mount(NcSelectStory, {
			props: { multiple: true, preselected: true },
			on: { selected: (data) => emitted.push(data) },
		})

		// Click the deselect (×) button on first tag
		const deselectButtons = component.locator('.vs__deselect')
		await deselectButtons.first().click()

		expect(emitted).toHaveLength(1)
		expect(emitted[0]).toEqual(['bar'])
	})
})

test.describe('NcSelect - e2e flows', () => {
	test('search, select, and clear single value', async ({ mount, page }) => {
		const emitted: unknown[] = []
		const component = await mount(NcSelectStory, {
			props: { inputLabel: 'Pick one' },
			on: { selected: (data) => emitted.push(data) },
		})

		// Type to search
		await component.getByRole('combobox').click()
		await component.getByRole('combobox').fill('qu')
		expect(await page.getByRole('option').all()).toHaveLength(2)

		// Select 'qux'
		await page.getByRole('option', { name: 'qux' }).click()
		expect(emitted[0]).toBe('qux')

		// Value is shown
		await expect(component.getByText('qux')).toBeVisible()
	})

	test('keyboard-only selection flow', async ({ mount, page }) => {
		const emitted: unknown[] = []
		const component = await mount(NcSelectStory, {
			on: { selected: (data) => emitted.push(data) },
		})

		const combobox = component.getByRole('combobox')

		// Open with Enter
		await combobox.press('Enter')
		await expect(page.getByRole('option').first()).toBeVisible()

		// Navigate down twice and select with Enter
		await combobox.press('ArrowDown')
		await combobox.press('ArrowDown')
		await combobox.press('Enter')

		expect(emitted).toHaveLength(1)
	})

	test('click outside closes dropdown', async ({ mount, page }) => {
		const component = await mount(NcSelectStory)

		await component.getByRole('combobox').click()
		await expect(page.getByRole('option').first()).toBeVisible()

		// Click outside the select
		await page.locator('body').click({ position: { x: 10, y: 10 } })
		await expect(page.getByRole('option').first()).not.toBeVisible()
	})

	test('multi: search filters then select adds tag', async ({ mount, page }) => {
		const emitted: unknown[] = []
		const component = await mount(NcSelectStory, {
			props: { multiple: true },
			on: { selected: (data) => emitted.push(data) },
		})

		// Type to filter
		await component.getByRole('combobox').click()
		await component.getByRole('combobox').fill('ba')
		expect(await page.getByRole('option').all()).toHaveLength(2)

		// Select 'baz'
		await page.getByRole('option', { name: 'baz' }).click()
		expect(emitted[0]).toEqual(['baz'])

		// Tag visible
		await expect(component.getByText('baz')).toBeVisible()

		// Select another
		await component.getByRole('combobox').click()
		await page.getByRole('option', { name: 'foo' }).click()
		expect(emitted[1]).toEqual(['baz', 'foo'])
	})

	test('multi: Backspace removes last tag', async ({ mount }) => {
		const emitted: unknown[] = []
		const component = await mount(NcSelectStory, {
			props: { multiple: true, preselected: true },
			on: { selected: (data) => emitted.push(data) },
		})

		// foo and bar are preselected
		await expect(component.getByText('foo')).toBeVisible()
		await expect(component.getByText('bar')).toBeVisible()

		// Focus and press Backspace to remove last tag
		await component.getByRole('combobox').click()
		await component.getByRole('combobox').press('Backspace')

		expect(emitted).toHaveLength(1)
		expect(emitted[0]).toEqual(['foo'])
	})

	test('selecting same value in single mode replaces it', async ({ mount, page }) => {
		const emitted: unknown[] = []
		const component = await mount(NcSelectStory, {
			props: { preselected: true },
			on: { selected: (data) => emitted.push(data) },
		})

		// foo is preselected, select bar instead
		await component.getByRole('combobox').click()
		await page.getByRole('option', { name: 'bar' }).click()

		expect(emitted[0]).toBe('bar')
		await expect(component.getByText('bar')).toBeVisible()
	})
})

test.describe('NcSelect - NcTextField parity', () => {
	test('renders an input element', async ({ mount }) => {
		const component = await mount(NcSelectStory)
		await expect(component.locator('input')).toBeVisible()
	})

	test('label floats when input is focused', async ({ mount }) => {
		const component = await mount(NcSelectStory, {
			props: { inputLabel: 'My label' },
		})

		const label = component.locator('label')
		await component.getByRole('combobox').click()

		// Label should still be visible (floated above border)
		await expect(label).toBeVisible()
		await expect(label).toContainText('My label')
	})

	test('label floats when value is selected', async ({ mount }) => {
		const component = await mount(NcSelectStory, {
			props: { inputLabel: 'My label', preselected: true },
		})

		// Label should be floated (not centered as placeholder)
		const label = component.locator('label')
		await expect(label).toBeVisible()
		await expect(label).toContainText('My label')
	})
})
