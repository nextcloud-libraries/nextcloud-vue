/**
 * SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { GenColors } from '../../utils/GenColors.js'

import md5 from 'md5'

/**
 * Generate a color from a username
 * Originally taken from https://github.com/nextcloud/server/blob/master/core/js/placeholder.js
 *
 * @param {string} username Display name or user id to generate from
 * @return {{ r: number, g: number, b: number }} the RGB color
 */
export function usernameToColor(username) {
	// Normalize hash
	let hash = username.toLowerCase()

	// Already a md5 hash?
	if (hash.match(/^([0-9a-f]{4}-?){8}$/) === null) {
		hash = md5(hash)
	}

	hash = hash.replace(/[^0-9a-f]/g, '')

	const steps = 6
	const finalPalette = GenColors(steps)

	/**
	 * Convert a string to an integer evenly
	 *
	 * @param {string} hash The hash to convert
	 * @param {number} maximum Largest number allowed
	 */
	function hashToInt(hash, maximum) {
		let finalInt = 0
		const result = []

		// Splitting evenly the string
		for (let i = 0; i < hash.length; i++) {
			// chars in md5 goes up to f, hex:16
			result.push(parseInt(hash.charAt(i), 16) % 16)
		}

		// Adds up all results
		for (const j in result) {
			finalInt += result[j]
		}

		// chars in md5 goes up to f, hex:16
		// make sure we're always using int in our operation
		return parseInt(parseInt(finalInt, 10) % maximum, 10)
	}
	return finalPalette[hashToInt(hash, steps * 3)]
}

/**
 * @deprecated use the named export of `usernameToColor` instead
 */
export default usernameToColor
