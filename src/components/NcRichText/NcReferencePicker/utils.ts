/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

let timerId: number | undefined

/**
 * @param callback - The callback to call after the delay
 * @param ms - The delay in milliseconds
 */
export function delay<P extends Array<unknown>, R>(callback: (...args: P) => R, ms: number): (...args: P) => void {
	return (...args) => {
		window.clearTimeout(timerId)
		timerId = window.setTimeout(() => {
			callback(...args)
		}, ms)
	}
}

/**
 * Check wether a given string is a valid URL.
 *
 * @param str - The potential URL
 */
export function isUrl(str: string): boolean {
	try {
		return Boolean(new URL(str))
	} catch (error) {
		return false
	}
}
