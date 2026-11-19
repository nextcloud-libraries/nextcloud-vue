/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { de, enGB, enUS, uz } from 'date-fns/locale'
import { describe, expect, it } from 'vitest'
import { uses24HourClock } from '../../../../src/components/NcDateTimePicker/format.ts'

describe('uses24HourClock', () => {
	it.for([
		[enUS, false],
		[enGB, true],
		[de, true],
		[uz, false],
	] as const)('uses the time format of the locale for a format without hour tokens (%#)', ([locale, is24]) => {
		expect(uses24HourClock('p', locale)).toBe(is24)
		expect(uses24HourClock(undefined, locale)).toBe(is24)
	})

	it.for([
		['HH:mm', true],
		['kk:mm', true],
		['h:mm a', false],
		['KK:mm a', false],
		["HH 'h' mm", true],
		["h 'o''clock'", false],
	] as const)('uses the hour token of %s regardless of the locale', ([format, is24]) => {
		const localeWithOtherClock = is24 ? enUS : enGB

		expect(uses24HourClock(format, localeWithOtherClock)).toBe(is24)
	})
})
