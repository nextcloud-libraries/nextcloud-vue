/*
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Convert timezone ID in IANA format (e.g. "Europe/Berlin") to a more human-readable format
 *
 * @param timezoneId - IANA timezone ID (e.g. "America/Argentina/San_Juan")
 * @return Formatted timezone string (e.g. "Argentina - San Juan")
 */
function formatTimezoneId(timezoneId: string) {
	return timezoneId
		// 'America/Argentina/San_Juan' -> 'Argentina/San_Juan'
		.slice(timezoneId.indexOf('/') + 1)
		// 'Argentina/San_Juan' -> 'Argentina - San_Juan'
		.replaceAll('/', ' - ')
		// 'San_Juan' -> 'San Juan'
		.replaceAll('_', ' ')
}

/**
 * Get a list of supported IANA timezone IDs (e.g. "Europe/Berlin") with human-readable labels,
 * excluding Etc/* administrative zones not used by users (see: https://en.wikipedia.org/wiki/Tz_database#Areas)
 */
export function getTimezones() {
	return Intl.supportedValuesOf('timeZone')
		.filter((tz) => !tz.startsWith('Etc/'))
		.map((timezoneId) => ({
			timezoneId,
			label: formatTimezoneId(timezoneId),
		}))
		.sort((a, b) => a.timezoneId.localeCompare(b.timezoneId))
}
