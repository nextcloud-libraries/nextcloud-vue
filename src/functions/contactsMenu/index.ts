/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { logger } from '../../utils/logger.ts'

// Taken from \OC\Contacts\ContactsMenu\Entry::jsonSerialize
export interface ContactsMenuEntry {
	id: number|string|null,
	fullName: string,
	avatar: string|null,
	topAction: object|null,
	actions: object[],
	lastMessage: '',
	emailAddresses: string[],
	profileTitle: string|null,
	profileUrl: string|null,
	status: string|null,
	statusMessage: null|string,
	statusMessageTimestamp: null|number,
	statusIcon: null|string,
	isUser: boolean,
	uid: null|string,
}

export interface ContactsMenuAction {
	id: string,
	displayName: (entry: ContactsMenuEntry) => string,
	enabled: (entry: ContactsMenuEntry) => boolean,
	iconSvg: (entry: ContactsMenuEntry) => string,
	callback: (entry: ContactsMenuEntry) => void,
}

/**
 * Register a contacts and avatar menu action that will invoke the given callback on click.
 *
 * @param {ContactsMenuAction} action The action to register
 */
export function registerContactsMenuAction(action: ContactsMenuAction): void {
	window._nc_contacts_menu_hooks ??= {}

	if (window._nc_contacts_menu_hooks[action.id]) {
		logger.error(`ContactsMenu action for id ${action.id} has already been registered`, {
			action,
		})
		return
	}

	window._nc_contacts_menu_hooks[action.id] = action
}

/**
 * Get all registered and enabled contacts menu actions for the given menu entry.
 *
 * @param {ContactsMenuEntry} entry The contacts menu entry object as returned by the backend
 */
export function getEnabledContactsMenuActions(entry: ContactsMenuEntry): ContactsMenuAction[] {
	if (!window._nc_contacts_menu_hooks) {
		return []
	}

	return Object.values(window._nc_contacts_menu_hooks).filter((action) => action.enabled(entry))
}
