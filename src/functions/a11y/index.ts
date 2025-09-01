/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Return true if the DOM event is an accessible mouse or keyboard element activation, false otherwise
 *
 * @param event DOM event
 *
 * @return
 */
export function isA11yActivation(event: Event) {
	if (event.type === 'click') {
		return true
	}
	if (event.type === 'keydown' && (event as KeyboardEvent).key === 'Enter') {
		return true
	}
	return false
}
