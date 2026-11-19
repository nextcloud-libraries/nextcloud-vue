/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { generateAvatarUrl } from '@nextcloud/router'
import { checkIfDarkTheme } from '../functions/isDarkTheme/index.ts'

interface AvatarUrlOptions {
	/**
	 * Should the dark theme variant be used.
	 */
	isDarkTheme?: boolean

	/**
	 * Is the user a guest user.
	 */
	isGuest?: boolean

	/**
	 * Size of the avatar.
	 *
	 * @default 64
	 */
	size?: 64 | 512

	/**
	 * The user's avatar version. Including it earns a much longer cache lifetime.
	 */
	version?: string | number
}

/**
 * Get the avatar URL for a given user.
 *
 * @param user - The user id
 * @param options - Adjustments for the avatar format
 */
export function getAvatarUrl(user: string, options?: AvatarUrlOptions): string {
	return generateAvatarUrl(user, {
		size: options?.size,
		isGuestUser: options?.isGuest,
		isDarkTheme: options?.isDarkTheme ?? checkIfDarkTheme(document.body),
		guestFallback: true,
		version: options?.version,
	})
}
