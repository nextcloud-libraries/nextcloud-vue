/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { t } from '../../l10n.js'

/**
 *
 * @param {string[]} timezoneList List of Olsen timezones
 * @param {Array} additionalTimezones List of additional timezones
 * @return {Array}
 */
export function getSortedTimezoneList(timezoneList = [], additionalTimezones = []) {
	const sortedByContinent = {}
	const sortedList = []

	for (const timezoneId of timezoneList) {
		const components = timezoneId.split('/')
		let [continent, name] = [components.shift(), components.join('/')]
		if (!name) {
			name = continent
			// TRANSLATORS This refers to global timezones in the timezone picker
			continent = t('Global')
		}

		sortedByContinent[continent] = sortedByContinent[continent] || {
			continent,
			regions: [],
		}

		sortedByContinent[continent].regions.push({
			label: getReadableTimezoneName(name),
			cities: [],
			timezoneId,
		})
	}

	for (const additionalTimezone of additionalTimezones) {
		const { continent, label, timezoneId } = additionalTimezone

		sortedByContinent[continent] = sortedByContinent[continent] || {
			continent,
			regions: [],
		}

		sortedByContinent[continent].regions.push({
			label,
			cities: [],
			timezoneId,
		})
	}

	for (const continent in sortedByContinent) {
		if (!Object.prototype.hasOwnProperty.call(sortedByContinent, continent)) {
			continue
		}

		sortedByContinent[continent].regions.sort((a, b) => {
			if (a.label < b.label) {
				return -1
			}

			return 1
		})
		sortedList.push(sortedByContinent[continent])
	}

	// Sort continents by name
	sortedList.sort((a, b) => {
		if (a.continent < b.continent) {
			return -1
		}

		return 1
	})

	return sortedList
}

/**
 * Get human-readable name for timezoneId
 *
 * @param {string} timezoneId TimezoneId to turn human-readable
 * @return {string}
 */
export function getReadableTimezoneName(timezoneId) {
	return timezoneId
		.split('_')
		.join(' ')
		.replace('St ', 'St. ')
		.split('/')
		.join(' - ')
}
