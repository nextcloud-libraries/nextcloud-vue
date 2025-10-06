/**
 * SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Color } from '../../utils/colors.ts'

import { Md5 } from 'ts-md5'
import { generatePalette } from '../../utils/colors.ts'

/**
 * Create a simple hash from a string
 *
 * @param str - The string to hash
 */
function hashCode(str: string): number {
	let hash = str

	// Hash a given string, if it is not md5 hash already
	if (str.match(/^([0-9a-f]{4}-?){8}$/) === null) {
		hash = Md5.hashStr(str)
	}

	hash = hash.replace(/[^0-9a-f]/g, '')

	let finalInt = 0

	for (let i = 0; i < hash.length; i++) {
		// chars in md5 are [0-9a-f] (base-16)
		finalInt += parseInt(hash.charAt(i), 16)
	}

	return finalInt
}

/**
 * Generate a color from a username
 *
 * @param username - Display name or user id to generate from
 * @return The RGB color
 */
export function usernameToColor(username: string): Color {
	const steps = 6
	const finalPalette = generatePalette(steps)
	const hash = hashCode(username.toLocaleLowerCase())

	return finalPalette[hash % finalPalette.length]!
}
