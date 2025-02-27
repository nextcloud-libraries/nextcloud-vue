/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { FocusTrap } from 'focus-trap'

declare global {
	interface Window {
		_nc_focus_trap: FocusTrap[]
	}
}

/**
 * Get the default global focus trap stack
 */
export function getTrapStack() {
	// Create global stack if undefined
	window._nc_focus_trap ??= []

	return window._nc_focus_trap
}
