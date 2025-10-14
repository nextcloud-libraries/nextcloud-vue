/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { InjectionKey, VNode } from 'vue'

import { inject } from 'vue'

interface AppSettingsRegistrationContext {
	/**
	 * Register a new section on the app settings dialog
	 *
	 * @param id - The section ID
	 * @param name - The section name
	 * @param icon - Optional icon component
	 */
	registerSection(id: string, name: string, icon?: VNode[]): void

	/**
	 * Unregistered from the app settings dialog to remove it from dialog
	 *
	 * @param id - The section ID
	 */
	unregisterSection(id: string): void
}

export const APP_SETTINGS_REGISTRATION_KEY: InjectionKey<AppSettingsRegistrationContext> = Symbol.for('NcAppSettingsDialog:registration')

/**
 * Get the provided methods from the app settings dialog.
 * This is to be used in the app settings sections.
 */
export function useAppSettingsDialog() {
	return inject(APP_SETTINGS_REGISTRATION_KEY)!
}
