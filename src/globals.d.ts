/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ContactsMenuAction } from './functions/contactsMenu/index.ts'

declare global {
	declare const PRODUCTION: boolean
	declare const appName: string
	declare const appVersion: string

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	declare const TRANSLATIONS: { locale: string, translations: any }[]

	interface Window {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		OCP: any
		// internal global variables
		_oc_config?: {
			loglevel?: number
		}
		_nc_vue_element_id?: number
		_nc_contacts_menu_hooks: { [id: string]: ContactsMenuAction },
	}
}

export {}
