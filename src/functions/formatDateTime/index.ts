/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { getLanguage } from '@nextcloud/l10n'
import { t } from '../../l10n.js'

const FEW_SECONDS_AGO = {
	long: t('a few seconds ago'),
	short: t('seconds ago'), // FOR TRANSLATORS: Shorter version of 'a few seconds ago'
	narrow: t('sec. ago'), // FOR TRANSLATORS: If possible in your language an even shorter version of 'a few seconds ago'
}

export interface FormatDateOptions {
	/**
	 * Ignore seconds when displaying the relative time and just show `a few seconds ago`
	 * @default false
	 */
	ignoreSeconds?: boolean
	/**
	 * The relative time formatting option to use
	 * @default 'long
	 */
	relativeTime?: 'long' | 'short' | 'narrow'
	/**
	 * Language to use
	 * @default 'current language'
	 */
	language?: string
}

/**
 * Format a given time as "relative time" also called "humanizing".
 *
 * @param timestamp Timestamp or Date object
 * @param opts Options for the formatting
 */
export function formatDateTime(
	timestamp: Date|number = Date.now(),
	opts: FormatDateOptions = {},
): string {
	const options = {
		relativeTime: 'long' as const,
		ignoreSeconds: false,
		...opts,
	}

	/** ECMA Date object of the timestamp */
	const date = new Date(timestamp)

	const formatter = new Intl.RelativeTimeFormat(options.language ? [options.language, getLanguage()] : getLanguage(), { numeric: 'auto', style: options.relativeTime })
	const diff = date.getTime() - Date.now()
	const seconds = diff / 1000

	if (Math.abs(seconds) < 59.5) {
		if (options.ignoreSeconds) {
			return FEW_SECONDS_AGO[options.relativeTime]
		} else {
			return formatter.format(Math.round(seconds), 'second')
		}
	}
	const minutes = seconds / 60
	if (Math.abs(minutes) <= 59) {
		return formatter.format(Math.round(minutes), 'minute')
	}
	const hours = minutes / 60
	if (Math.abs(hours) < 23.5) {
		return formatter.format(Math.round(hours), 'hour')
	}
	const days = hours / 24
	if (Math.abs(days) < 6.5) {
		return formatter.format(Math.round(days), 'day')
	}
	if (Math.abs(days) < 27.5) {
		const weeks = days / 7
		return formatter.format(Math.round(weeks), 'week')
	}
	const months = days / 30
	if (Math.abs(months) < 11.5) {
		return formatter.format(Math.round(months), 'month')
	}
	return formatter.format(Math.round(days / 365), 'year')
}
