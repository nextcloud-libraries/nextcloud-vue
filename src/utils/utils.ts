/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Single tone function decorator
 *
 * @param func - Function
 */
export function once<T extends unknown[], K>(func: (...args: T) => K): ((...args: T) => K) {
	let wasCalled = false
	let result: K

	return (...args: T): K => {
		if (!wasCalled) {
			wasCalled = true
			result = func(...args)
		}
		return result
	}
}
