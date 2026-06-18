/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

type DateFormat = ((date: Date) => string)
type DateRangeFormat = ((dates: Date[]) => string)
type LocaleCode = string

export function getDateFormat(locale: LocaleCode): DateFormat {
	const formatter = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' })
	return (date) => {
		return formatter.format(date)
	}
}

export function getDateRangeFormat(locale: LocaleCode): DateRangeFormat {
	const formatter = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' })
	return (dates) => {
		return formatter.formatRange(dates[0], dates[1])
	}
}

export function getTimeFormat(locale: LocaleCode): DateFormat {
	const formatter = new Intl.DateTimeFormat(locale, { timeStyle: 'short' })
	return (date) => {
		return formatter.format(date)
	}
}

export function getTimeRangeFormat(locale: LocaleCode): DateRangeFormat {
	const formatter = new Intl.DateTimeFormat(locale, { timeStyle: 'short' })
	return (dates) => {
		return formatter.formatRange(dates[0], dates[1])
	}
}

export function getDateTimeFormat(locale: LocaleCode): DateFormat {
	const formatter = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' })
	return (date) => {
		return formatter.format(date)
	}
}

export function getDateTimeRangeFormat(locale: LocaleCode): DateRangeFormat {
	const formatter = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' })
	return (dates) => {
		return formatter.formatRange(dates[0], dates[1])
	}
}

export function getMonthFormat(locale: LocaleCode): DateFormat {
	const formatter = new Intl.DateTimeFormat(locale, { year: 'numeric', month: '2-digit' })
	return (date) => {
		return formatter.format(date)
	}
}

export function getYearFormat(locale: LocaleCode): DateFormat {
	const formatter = new Intl.DateTimeFormat(locale, { year: 'numeric' })
	return (date) => {
		return formatter.format(date)
	}
}
