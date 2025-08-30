/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Find the ranges of a substr in a given string
 *
 * @param {string} text The text to search in
 * @param {string} search The text to search for
 * @return {Array} The array of ranges to highlight
 */
function FindRanges(text, search) {
	const ranges = []
	let currentIndex = 0
	let index = text.toLowerCase().indexOf(search.toLowerCase(), currentIndex)
	// Variable to track that we don't iterate more often than the length of the text.
	// Shouldn't happen anyway, but just to be sure to not hang the browser for some reason.
	let i = 0
	while (index > -1 && i < text.length) {
		currentIndex = index + search.length
		ranges.push({ start: index, end: currentIndex })

		index = text.toLowerCase().indexOf(search.toLowerCase(), currentIndex)
		i++
	}
	return ranges
}

export default FindRanges
