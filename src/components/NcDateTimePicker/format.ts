/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Locale } from 'date-fns/locale'

type DateFormat = string

/**
 * Provide the format string for dates.
 *
 * @param locale locale to get the format string for
 */
export function getDateFormat(locale: Locale): DateFormat {
	if (locale.code.split('-')[0] === 'de') {
		// For german 'P' aka. 'short' is similiar to `{ dateStyle: 'medium' }: Intl.DateTimeFormatOptions`
		// See https://github.com/date-fns/date-fns/blob/v4.1.0/src/locale/de/_lib/formatLong/index.ts#L8-L9
		return 'P'
	}
	// Usually 'PP' aka. 'medium' is similiar to `{ dateStyle: 'medium' }: Intl.DateTimeFormatOptions`
	return 'PP'
}

/**
 * Provide the format string for times.
 */
export function getTimeFormat(): DateFormat {
	// 'p' aka. 'medium' is similiar to `{ timeStyle: 'medium' }: Intl.DateTimeFormatOptions`
	return 'p'
}

/**
 * Provide the format string for date times.
 *
 * @param locale locale to get the format string for
 */
export function getDateTimeFormat(locale: Locale): DateFormat {
	return getDateFormat(locale) + getTimeFormat()
}

/**
 * Provide the format string for weeks.
 */
export function getWeekFormat(): DateFormat {
	// cannot format weeks with Intl.
	// Do not use RR (or RRR) because what is formated with RR cannot be parsed with RR.
	// e.g. RR formats "2025" to "2025", but expects "25" when parsing.
	return 'RRRR-II'
}

/**
 * Provide the format string for month.
 *
 * @param locale locale to get the format string for
 */
export function getMonthFormat(locale: Locale): DateFormat {
	return guessFormat(locale.code, true)
}

/**
 * Provide the format string for year.
 *
 * @param locale locale to get the format string for
 */
export function getYearFormat(locale: Locale): DateFormat {
	return guessFormat(locale.code, false)
}

/**
 * Guess the format string for a numeric year with optionally a 2-digit month.
 *
 * @param localeCode locale to guess the format string for
 * @param includeMonth whether to include the month
 */
function guessFormat(localeCode: string, includeMonth: boolean): string {
	const sampleDate = new Date(2026, 0, 1)
	const formatOptions: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		// Specify because other calendar systems are not supported
		calendar: 'gregory',
	}
	if (includeMonth) {
		formatOptions.month = '2-digit'
	}
	// Format extraction using `Intl.DateTime.formatToParts` is inspired from
	// `formatStr` in `@formkit/tempo` and `parseFormatForOpts` in `luxon`.
	const formatter = Intl.DateTimeFormat(localeCode, formatOptions)
	const parts = formatter.formatToParts(sampleDate)
	const partStrings = parts.map((part) => {
		switch (part.type) {
			case 'month':
				return 'MM'
			case 'year':
				return 'yyyy'
			case 'literal':
				return escapeLiteraForFormatString(part.value)
			// Everything else is not expected and supported.
			default:
				return ''
		}
	})
	return partStrings.join('')
}

/**
 * Escape literal value as required for by `date-fns/format`.
 *
 * > The characters wrapped between two single quotes characters (') are escaped.
 * > Two single quotes in a row, whether inside or outside a quoted sequence,
 * > represent a 'real' single quote. (see the last example).
 * https://date-fns.org/v4.4.0/docs/format
 *
 * @param literalValue literal value to be escaped
 */
function escapeLiteraForFormatString(literalValue): string {
	// > The characters wrapped between two single quotes characters (') are escaped.
	// > Two single quotes in a row, whether inside or outside a quoted sequence,
	// > represent a 'real' single quote. (see the last example).
	// https://date-fns.org/v4.1.0/docs/format
	literalValue = literalValue.replaceAll(/'/g, '\'\'')
	return literalValue.replaceAll(/[A-Za-z]+/g, (latinCharSeq) => `'${latinCharSeq}'`)
}
