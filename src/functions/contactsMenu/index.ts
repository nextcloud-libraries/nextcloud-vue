/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

// Taken from \OC\Contacts\ContactsMenu\Entry::jsonSerialize
interface ContactsMenuEntry {
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

type ContactsMenuCallback = (entry: ContactsMenuEntry) => void

interface ContactsMenuHookProps {
	id: string;
	callback: ContactsMenuCallback;
}

declare global {
	interface Window {
		_vue_contacts_menu_hooks: Record<string, ContactsMenuHookProps>;
	}
}

if (!window._vue_contacts_menu_hooks) {
	window._vue_contacts_menu_hooks = {}
}

const registerContactsMenuHook = (id: string, callback: ContactsMenuCallback) => {
	if (window._vue_contacts_menu_hooks[id]) {
		console.error(`Hook for id ${id} already registered`)
		return
	}

	window._vue_contacts_menu_hooks[id] = {
		id,
		callback,
	}
}

const callContactsMenuHook = (id: string, entry: ContactsMenuEntry) => {
	window._vue_contacts_menu_hooks[id]?.callback(entry)
}

const hasContactsMenuHook = (id: string) => {
	return !!window._vue_contacts_menu_hooks[id]
}

export {
	registerContactsMenuHook,
	callContactsMenuHook,
	hasContactsMenuHook,
}
