/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import logger from './logger.ts'

let realAppName = 'missing-app-name'

try {
	realAppName = appName
} catch {
	logger.error('The `@nextcloud/vue` library was used without setting / replacing the `appName`.')
}

export const APP_NAME = realAppName
