/*!
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

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
