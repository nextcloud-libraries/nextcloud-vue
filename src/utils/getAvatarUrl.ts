/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { generateUrl } from '@nextcloud/router'

export const getAvatarUrl = (user: string, size: number | string, isGuest?: boolean): string => {
	const darkTheme = window.getComputedStyle(document.body)
		.getPropertyValue('--background-invert-if-dark') === 'invert(100%)'

	return generateUrl('/avatar' + (isGuest ? '/guest' : '') + '/{user}/{size}' + (darkTheme ? '/dark' : ''), {
		user,
		size,
	})
}
