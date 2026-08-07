/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import NcDateTimePicker from '../../../../src/components/NcDateTimePicker/NcDateTimePicker.vue'

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
	['date-range', [new Date(2000, 0, 1), new Date(2000, 0, 7)] as [Date, Date], /Jan 1, 2000\s-\sJan 7, 2000/i],
	['time-range', [new Date(2000, 0, 1, 2, 3), new Date(2000, 0, 1, 8, 9)] as [Date, Date], /2:03\s(AM\s)?-\s8:09\sAM/i],
	['datetime-range', [new Date(2000, 0, 1, 2, 3), new Date(2000, 0, 7, 8, 9)] as [Date, Date], /Jan 1, 2000, 2:03\sAM\s-\sJan 7, 2000, 8:09\sAM/i],
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
	['datetime', new Date(2000, 0, 2, 3, 4), 'de-DE', '02.01.2000 03:04'],
	['date', new Date(2000, 0, 2, 3, 4), 'es-ES', '2 ene 2000'],
	['month', new Date(2000, 0, 2, 3, 4), 'en-US', '01/2000'],
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

const customFormatTestcases = [
	['date', 'yyyy MMM dd', new Date(2000, 9, 2), 'de-DE', '2000 Okt. 02'],
	['date-range', 'dd MMM yyyy', [new Date(2000, 0, 1), new Date(2000, 9, 7)] as [Date, Date], 'es-ES', '01 ene 2000 - 07 oct 2000'],
	['date', 'EEEE d MMMM yy', new Date(2026, 9, 2), 'ru', 'пятница 2 октября 26'],
	['month', 'LLLL yy', new Date(2026, 9, 2), 'ru', 'октябрь 26'],
] as const
for (const [type, format, modelValue, locale, expectedValue] of customFormatTestcases) {
	test(`Handle format ${format} for type ${type} with locale ${locale}`, async ({ mount, page }) => {
		page.addScriptTag({ content: `document.getElementsByTagName('html')[0].dataset.locale = "${locale}";` })
		await mount(NcDateTimePicker, {
			props: {
				modelValue,
				format,
				type,
			},
		})

		await expect(page.getByRole('textbox')).toHaveValue(expectedValue)
	})
}

const textInputTestCases = [
	['date', 'de-DE', '01.02.2000', new Date(2000, 1, 1)],
	['date-range', 'en-US', 'Jan 1, 2000 - Jan 7, 2000', [new Date(2000, 0, 1), new Date(2000, 0, 7)]],
	['time', 'en-CA', '3:04 p.m.', new Date(2000, 1, 1, 15, 4)],
	['time-range', 'es', '2:03 - 08:09', [new Date(2000, 0, 7, 2, 3), new Date(2000, 0, 7, 8, 9)]],
	['datetime', 'tr', '2 Oca 2000, 03:04', new Date(2000, 0, 2, 3, 4)],
	['datetime-range', 'lt', '2000-01-01 02:03 - 2000-01-07 08:09', [new Date(2000, 0, 1, 2, 3), new Date(2000, 0, 7, 8, 9)]],
	['month', 'es', '01/2000', new Date(2000, 0, 1)],
	['year', 'en', '2000', new Date(2000, 0, 7)],
	['week', 'de', '2000-31', new Date(2000, 6, 31)],
] as const
for (const [type, locale, textInput, expectedValue] of textInputTestCases) {
	test(`Handle text input for date with type: ${type} and locale ${locale}`, async ({ mount, page }) => {
		page.addScriptTag({ content: `document.getElementsByTagName('html')[0].dataset.locale = "${locale}";` })
		const { promise: emittedValuePromise, resolve: onEmitValue } = Promise.withResolvers<Date | [Date, Date]>()
		await mount(NcDateTimePicker, {
			props: {
				type,
			},
			on: {
				'update:modelValue': onEmitValue,
			},
		})

		await page.getByRole('textbox').fill(textInput)

		const emmitedValue = await emittedValuePromise

		if (type === 'date' || type === 'week') {
			const emmitedDate = emmitedValue as Date
			const expectedDate = expectedValue as Date
			expect.soft(emmitedDate.getUTCFullYear()).toEqual(expectedDate.getUTCFullYear())
			expect.soft(emmitedDate.getUTCMonth()).toEqual(expectedDate.getUTCMonth())
			expect.soft(emmitedDate.getUTCDate()).toEqual(expectedDate.getUTCDate())
		} else if (type === 'date-range') {
			const [emmitedStartDate, emmitedEndDate] = emmitedValue as [Date, Date]
			const [expectedStartDate, expectedEndDate] = expectedValue as [Date, Date]
			expect.soft(emmitedStartDate.getUTCFullYear()).toEqual(expectedStartDate.getUTCFullYear())
			expect.soft(emmitedStartDate.getUTCMonth()).toEqual(expectedStartDate.getUTCMonth())
			expect.soft(emmitedStartDate.getUTCDate()).toEqual(expectedStartDate.getUTCDate())
			expect.soft(emmitedEndDate.getUTCFullYear()).toEqual(expectedEndDate.getUTCFullYear())
			expect.soft(emmitedEndDate.getUTCMonth()).toEqual(expectedEndDate.getUTCMonth())
			expect.soft(emmitedEndDate.getUTCDate()).toEqual(expectedEndDate.getUTCDate())
		} else if (type === 'time') {
			const emmitedDate = emmitedValue as Date
			const expectedDate = expectedValue as Date
			expect.soft(emmitedDate.getUTCHours()).toEqual(expectedDate.getUTCHours())
			expect.soft(emmitedDate.getUTCMinutes()).toEqual(expectedDate.getUTCMinutes())
		} else if (type === 'time-range') {
			const [emmitedStartDate, emmitedEndDate] = emmitedValue as [Date, Date]
			const [expectedStartDate, expectedEndDate] = expectedValue as [Date, Date]
			expect.soft(emmitedStartDate.getUTCHours()).toEqual(expectedStartDate.getUTCHours())
			expect.soft(emmitedStartDate.getUTCMinutes()).toEqual(expectedStartDate.getUTCMinutes())
			expect.soft(emmitedEndDate.getUTCHours()).toEqual(expectedEndDate.getUTCHours())
			expect.soft(emmitedEndDate.getUTCMinutes()).toEqual(expectedEndDate.getUTCMinutes())
		} else if (type.startsWith('datetime')) {
			expect(emmitedValue).toEqual(expectedValue)
		} else if (type === 'month') {
			const emmitedDate = emmitedValue as Date
			const expectedDate = expectedValue as Date
			expect.soft(emmitedDate.getUTCFullYear()).toEqual(expectedDate.getUTCFullYear())
			expect.soft(emmitedDate.getUTCMonth()).toEqual(expectedDate.getUTCMonth())
		} else if (type === 'year') {
			const emmitedDate = emmitedValue as Date
			const expectedDate = expectedValue as Date
			expect.soft(emmitedDate.getUTCFullYear()).toEqual(expectedDate.getUTCFullYear())
		} else {
			throw new Error(`No comparisson for type: ${type}`)
		}
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
	await expect(current).toHaveAttribute('aria-selected', 'true')
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
