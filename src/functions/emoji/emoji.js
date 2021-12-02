/**
 * @copyright Copyright (c) 2021 Jonas Meurer <jonas@freesources.org>
 *
 * @author Jonas Meurer <jonas@freesources.org>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

export const allEmojis = EMOJIS

/** later
const DEFAULTS = [
	'heart',
	'+1',
	'-1',
	'joy',
	'cry',
]
 */

/**
 * @param {Array} searchItems Array of emojis
 * @param {string} query Emoji search string
 * @returns {Array} list of found emojis
 */
export const emojiSearch = function(searchItems, query) {
	if (!query) {
		// Return first five emojis for empty searches
		return searchItems.slice(0, 5)
	}

	// First search for exact matches
	let results = searchItems.filter(item => item.short_names
		.filter(name => name.toLowerCase() === query.toLowerCase()).length > 0)

	// Second search for matches that start with query string
	results = [...new Set([...results, ...searchItems.filter(item => item.short_names
		.filter(name => name.toLowerCase().startsWith(query.toLowerCase())).length > 0)])]

	// If we still don't have enough, search for general matches
	if (results.length < 5) {
		results = [...new Set([...results, ...searchItems.filter(item => item.short_names
			.filter(name => name.toLowerCase().includes(query.toLowerCase())).length > 0)])]
	}

	return results.slice(0, 5)
}

export default { allEmojis, emojiSearch }
