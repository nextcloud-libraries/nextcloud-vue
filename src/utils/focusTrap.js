/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Return the default global focus trap stack
 *
 * @return {import('focus-trap').FocusTrap[]}
 */
export const getTrapStack = function() {
	// Create global stack if undefined
	Object.assign(window, { _nc_focus_trap: window._nc_focus_trap || [] })

	return window._nc_focus_trap
}
