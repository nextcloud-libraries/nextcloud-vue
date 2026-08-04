/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { InjectionKey } from 'vue'

/**
 * Lets navigation entries ask the list to move its shared hover highlight onto
 * them, so the list never has to read the DOM to find out what is hovered.
 */
export interface AppNavigationHighlight {
	/** Move the highlight onto the given entry element */
	show(entry: HTMLElement): void
	/** Hide the highlight if it is currently on the given entry element */
	hide(entry: HTMLElement): void
}

export const APP_NAVIGATION_HIGHLIGHT = Symbol('nc:app-navigation-highlight') as InjectionKey<AppNavigationHighlight>
