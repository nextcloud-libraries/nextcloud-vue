/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { loadState } from '@nextcloud/initial-state'
import { inject } from 'vue'
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
 * Get the app name (the Nextcloud app id).
 */
export function useAppName(): string {
	return inject<string>('appName', APP_NAME)
}

/**
 * Get the localized app name.
 */
export const useLocalizedAppName = once(() => {
	const apps = loadState<{ id: string, name: string }[]>('core', 'apps', [])
	const realAppName = useAppName()

	return apps.find(({ id }) => id === realAppName)?.name ?? realAppName
})
