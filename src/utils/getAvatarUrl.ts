/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { generateUrl } from '@nextcloud/router'
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
	version?: string | number | null
}

/**
 * Get the avatar URL for a given user.
 *
 * @param user - The user id
 * @param options - Adjustments for the avatar format
 */
export function getAvatarUrl(user: string, options?: AvatarUrlOptions): string {
	// backend only supports 64 and 512px
	// so we only request the needed size for better caching of the request.
	const size = (options?.size || 64) <= 64
		? 64
		: 512

	const guestUrl = options?.isGuest
		? '/guest'
		: ''
	const themeUrl = options?.isDarkTheme ?? checkIfDarkTheme(document.body)
		? '/dark'
		: ''

	// Coalesced rather than checked for truthiness: 0 is a real version, held by
	// everyone who never changed their avatar.
	const version = options?.version ?? null
	const versionUrl = version === null
		? ''
		: '&v={version}'

	return generateUrl(`/avatar${guestUrl}/{user}/{size}${themeUrl}?guestFallback=true${versionUrl}`, {
		user,
		size,
		version,
	})
}
