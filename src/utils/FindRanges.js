/**
 * @copyright Copyright (c) 2020 Raimund Schlüßler <raimund.schluessler@mailbox.org>
 *
 * @author Raimund Schlüßler <raimund.schluessler@mailbox.org>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

/**
 * Find the ranges of a substr in a given string
 *
 * @param {String} text The text to search in
 * @param {String} search The text to search for
 * @returns {Array} The array of ranges to highlight
 */
const FindRanges = (text, search) => {
	const ranges = []
	let currentIndex = 0
	let index = text.toLowerCase().indexOf(search.toLowerCase(), currentIndex)
	// Variable to track that we don't iterate more often than the length of the text.
	// Shouldn't happen anyway, but just to be sure to not hang the browser for some reason.
	let i = 0
	while (index > -1 && i < text.length) {
		currentIndex = index + search.length
		ranges.push({ start: index, end: currentIndex })

		index = text.toLowerCase().indexOf(search.toLowerCase(), index + 1)
		i++
	}
	return ranges
}

export default FindRanges
