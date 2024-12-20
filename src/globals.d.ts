/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ContactsMenuAction } from './functions/contactsMenu/index.ts'

declare const PRODUCTION: boolean

declare const SCOPE_VERSION: string

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const TRANSLATIONS: { locale: string, translations: any }[]

declare module '*?raw' {
	const content: string
	export default content
}

declare global {
	interface Window {
		_nc_contacts_menu_hooks: { [id: string]: ContactsMenuAction },
	}
}
