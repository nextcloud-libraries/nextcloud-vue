/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { loadState } from '@nextcloud/initial-state'
import { logger } from './logger.ts'
import { once } from './utils.ts'

let realAppName = 'missing-app-name'
try {
	realAppName = appName
} catch {
	logger.error('The `@nextcloud/vue` library was used without setting / replacing the `appName`.')
}
export const APP_NAME = realAppName

let realAppVersion = ''
try {
	realAppVersion = appVersion
} catch {
	logger.error('The `@nextcloud/vue` library was used without setting / replacing the `appVersion`.')
}
export const APP_VERSION = realAppVersion

/**
 * Get localized app name from the initial state
 */
export const getLocalizedAppName = once(() => {
	const activeApp = loadState<string>('core', 'active-app', APP_NAME)
	return loadState<{ id: string, name: string }[]>('core', 'apps', []).find(({ id }) => id === activeApp)?.name ?? APP_NAME
})
