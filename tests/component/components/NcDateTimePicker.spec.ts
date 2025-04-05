/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import NcDateTimePicker from '../../../src/components/NcDateTimePicker/NcDateTimePicker.vue'

test('aria-label set on input element', async ({ mount, page }) => {
	await mount(NcDateTimePicker, {
		props: {
			ariaLabel: 'my date picker',
			modelValue: new Date(2022, 1, 22, 22, 22),
		},
	})

	await expect(page.getByRole('textbox')).toHaveAccessibleName('my date picker')
})

const testcases = [
	['datetime', new Date(2000, 0, 2, 3, 4), 'Jan 2, 2000, 3:04 AM'],
	['date', new Date(2000, 0, 2, 3, 4), 'Jan 2, 2000'],
	['week', new Date(2000, 0, 2, 3, 4), '1999-52'],
	['month', new Date(2000, 0, 2, 3, 4), '01/2000'],
	['year', new Date(2000, 0, 2, 3, 4), '2000'],
	['range', [new Date(2000, 0, 1), new Date(2000, 0, 7)] as [Date, Date], /Jan 1\s–\s7, 2000/i],
	['range-datetime', [new Date(2000, 0, 1, 2, 3), new Date(2000, 0, 7, 8, 9)] as [Date, Date], /Jan 1, 2000, 2:03\sAM\s–\sJan 7, 2000, 8:09\sAM/i],
] as const

for (const [type, modelValue, expectedValue] of testcases) {
	test(`Handle intially specified date with type: ${type}`, async ({ mount, page }) => {
		await mount(NcDateTimePicker, {
			props: {
				modelValue,
				type,
			},
		})

		await expect(page.getByRole('textbox')).toHaveValue(expectedValue)
	})
}

const l10nTestcases = [
	['datetime', new Date(2000, 0, 2, 3, 4), 'en-GB', '2 Jan 2000, 03:04'],
	['date', new Date(2000, 0, 2, 3, 4), 'es-ES', '2 ene 2000'],
	['month', new Date(2000, 0, 2, 3, 4), 'de-DE', '01.2000'],
] as const

for (const [type, modelValue, locale, expectedValue] of l10nTestcases) {
	test(`Handle localized formatting for date with type: ${type} formatted in locale ${locale}`, async ({ mount, page }) => {
		page.addScriptTag({ content: `document.getElementsByTagName('html')[0].dataset.locale = "${locale}";` })
		await mount(NcDateTimePicker, {
			props: {
				modelValue,
				type,
			},
		})

		await expect(page.getByRole('textbox')).toHaveValue(expectedValue)
	})
}

test('Today is selected by default', async ({ mount, page }) => {
	await page.clock.setSystemTime(new Date(2000, 0, 22))

	await mount(NcDateTimePicker, {
		props: {
			type: 'date',
		},
	})

	await expect(page.getByRole('textbox')).toHaveValue('Jan 22, 2000')

	// see also menu is checked
	await page.getByRole('textbox').click()
	await expect(page.getByRole('dialog', { name: 'Datepicker menu' })).toBeVisible()

	const current = page.getByRole('dialog', { name: 'Datepicker menu' })
		.getByRole('gridcell', { name: '22' })
	await expect(current).toHaveText('22')
	await expect(current).toHaveAttribute('aria-pressed', 'true')
})

test('Pick a date', async ({ mount, page }) => {
	let value: Date | undefined

	await page.clock.setSystemTime(new Date(2000, 0, 22))

	await mount(NcDateTimePicker, {
		props: {
			type: 'date',
		},
		on: {
			'update:modelValue': (v) => { value = v },
		},
	})

	await page.getByRole('textbox').click()
	await expect(page.getByRole('dialog', { name: 'Datepicker menu' })).toBeVisible()

	page.getByRole('dialog', { name: 'Datepicker menu' })
		.getByRole('gridcell', { name: '13' })
		.click()

	// closed by default
	await expect(page.getByRole('dialog', { name: 'Datepicker menu' })).not.toBeVisible()
	expect(value).not.toBeUndefined()
	expect((value as Date).getDate()).toBe(13)
})
