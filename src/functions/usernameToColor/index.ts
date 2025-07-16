/**
 * SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Color } from '../../utils/colors.ts'

import { generatePalette } from '../../utils/colors.ts'

/**
 * Create a simple hash from a string
 * @param str - The string to hash
 */
function hashCode(str: string): number {
	let hash = 0

	if (str.length === 0) {
		return hash
	}

	for (let i = 0; i < str.length; i++) {
		const chr = str.charCodeAt(i)
		hash = ((hash << 5) - hash) + chr
	}

	return Math.abs(hash)
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

	return finalPalette[hash % finalPalette.length]
}
