/**
 * SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Get a (non secure) random id
 * @param length The length of the ID (defaults to 5)
 */
export function getRandomId(length = 5) {
	if (length <= 0) {
		throw new Error('Invalid argument to `getRandomId`: Length must be positive')
	}

	let id = ''
	do {
		id += (Math.PI - Math.random())
			.toString(36)
			.replace(/^\d\./g, '')
	} while (id.length < length)
	return 'nc-' + id.slice(0, length)
}
