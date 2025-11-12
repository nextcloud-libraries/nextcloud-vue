/*
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { getLanguage } from '@nextcloud/l10n'
import { memoize } from '../../utils/utils.ts'

const now = new Date()

/**
 * Convert timezone ID in IANA format (e.g. "Europe/Berlin") to specified format via Intl.DateTimeFormat
 *
 * @param timeZone - IANA timezone ID (e.g. "Europe/Berlin")
 * @param timeZoneName - Intl.DateTimeFormatOptions['timeZoneName']
 * @param lang - Language code (e.g. 'en'), defaults to the current user's language
 */
export function formatTimezone(timeZone: string, timeZoneName: NonNullable<Intl.DateTimeFormatOptions['timeZoneName']>, lang: string = getLanguage()): string | undefined {
	return new Intl.DateTimeFormat(lang, { timeZone, timeZoneName })
		.formatToParts(now)
		.find((part) => part.type === 'timeZoneName')
		?.value
}

/**
 * Get offset in ms for a given timezone ID in IANA format (e.g. "Europe/Berlin")
 *
 * @param timeZone - IANA timezone ID (e.g. "Europe/Berlin")
 * @return - Offset in milliseconds (e.g. 3600000 for GMT+01:00)
 */
const getTimezoneOffset = memoize((timeZone: string): number => {
	// 'en-US' gives predictable GMT+00:00 or GMT+00:00:00 format
	const gmt = formatTimezone(timeZone, 'longOffset', 'en-US')
	const [isMatched, sign, h = '0', m = '0', s = '0'] = gmt?.match(/GMT([+-])(\d+):(\d+)(?::(\d+))?/) ?? []
	if (!isMatched) {
		return 0
	}
	return (sign === '+' ? 1 : -1) * (parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s)) * 1000
})

/**
 * Get a list of supported IANA timezone IDs (e.g. "Europe/Berlin") with human-readable labels,
 * excluding Etc/* administrative zones not used by users (see: https://en.wikipedia.org/wiki/Tz_database#Areas)
 */
export const getTimezones = memoize(() => {
	const zones = Intl.supportedValuesOf('timeZone')
		.filter((tz) => !tz.startsWith('Etc/'))
	console.time('Adding formatted timezone labels')
	const result = zones.map((timezoneId) => ({
		timezoneId,
		label: formatTimezone(timezoneId, 'shortGeneric'), // Alternative: longGeneric, but too long our select design..
		offset: getTimezoneOffset(timezoneId),
		localeOffset: formatTimezone(timezoneId, 'shortOffset'),
	}))
	console.timeEnd('Adding formatted timezone labels')
	// Sort by offset first, then by name
	result.sort((a, b) => a.offset - b.offset || a.timezoneId.localeCompare(b.timezoneId))
	return result
})

// See:
// https://play.vuejs.org/#eNqdVdtO20AQ/ZWpX+yoiRNEpaooCWoLregDoIa2EnUfjD1ODOu1tbsOl5B/78xu7IQQqFQpsnZnzlzOXDYL72NVhfMavQNvqBOVVwY0mroaRzIvqlIZWIDCDJaQqbIAn6B+JCOZlFIbELGcahjBbx+l3wU/Rf6i5q+q+Zsp/88mmsDkLmB8h/1ktUxMXkqYopnUFUfE9CIv8KGUqIMOLAhlFKWkJJxII0LdoH7GokZ9Rs4M4S8Jb12ayIRZLgyqwDzAaAxvzEOoTayM/pWbWeAfm6TvdxqoJl9BEHfhqsNgSqOJfpZlVIog7kBvh5jgj48Qh6JMYoGfy6KKFZKU/C63iW2ZNumuyLniTAtDtclKVcQtvkVSIUUpp87ellj2fkwcXWdeWtXEqNzWmLwdhlrkCQb7NlH/ktvWFFLiLRzFBoNBJ5xzGamKTLOV+3sf3g96gz36XQwGB/YXDgYDH94+CbVhvs37RSrN6TQu6MZD8bTLnITtNGfC9l+sp4CRXRrH3Z5g2TbfBS7PueXBBtX1dMg0CKhfxracD6G5rxBGoxG0w8ROm4E6dDRXFF3F7YByqXcPbiSHfbdQtEp0MVhUgvKgG8BQo8DEwLxXlCmKUeQxucizSlKXlS3hvEdcSJmTMeTSrVuLAlgswKqWlJa16ztDF6PvgriLia8Ex2Y2Q6NaF0MzG+sZJe9ma9inu0MxbjZuGMHJ0TOdtfuKElWePFPyvO4UPjegIye0Sm3NOmXOtpyRBwc3eG+FG/yHJh1TDbYmLU9pQTY40b64IVsuKVK6kZC1pjC7FS+6XTH4h99d5sz/P81eDdpWkA6rRtNpPXFe1zOaxjbLp+G1LiW99rRxAJGX0MOVC1RndnCo0Ae8i1zcyIuFKG+/WZlRNXYbeTLD5GaH/FrfsSzyzhVqVHOMvFZH7y8tilMfT07xjs6tkpagFoR+RfkddSlqztHBPtUypbQ3cDbbE/ufRQ/ThT6+Myh1Q4oTZeTS4iOP/sf4zX6J+jrd/fCdtaPd95Z/AZWWeP8=
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
