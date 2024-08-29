/**
 * SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Generate a random ID with an exact length.
 * The ID is guaranteed to be an valid HTML ID (only letters and digits, starting with an letter)
 *
 * @param length The length of the ID
 */
export function getRandomId(length = 5): string {
	// Get an array of "length" filled with random values
	const array = new Uint8Array(length)
	crypto.getRandomValues(array)
	// Convert each value to a character (0-9a-z) and concat
	return array.reduce((rest, value, index) => {
		// ensure the first one is a letter
		if (index === 0) {
			value = (value % 26) + 10
		} else {
			value = value % 36
		}
		return rest + value.toString(36)
	}, '')
}
