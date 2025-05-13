/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { type InjectionKey, type ComputedRef, type Ref, computed, toValue } from 'vue'

export const NC_ACTIONS_IS_SEMANTIC_MENU: InjectionKey<ComputedRef<boolean>> = Symbol.for('NcActions:isSemanticMenu')
export const NC_ACTIONS_CLOSE_MENU: InjectionKey<(returnFocus: boolean) => void> = Symbol.for('NcActions:closeMenu')

// TODO: once NcActions migrated from mixins - add composables to created and use NcAction provider/context

/**
 * Check if icon prop is an URL.
 *
 * @param icon - The icon prop to check
 */
export function useIsIconUrl(icon: Ref<string>): ComputedRef<boolean> {
	return computed(() => {
		try {
			return !!(new URL(toValue(icon), toValue(icon).startsWith('/') ? window.location.origin : undefined))
		} catch (error) {
			return false
		}
	})
}
export interface NcActionTextProps {
	/**
	 * Aria label for the button. Not needed if the button has text.
	 */
	ariaLabel?: string

	/**
	 * The main text content of the entry.
	 */
	name?: string

	/**
	 * The title attribute of the element.
	 */
	title?: string

	/**
	 * Whether we close the Actions menu after the click
	 */
	closeAfterClick?: false

	/**
	 * Icon to show with the action, can be either a CSS class or an URL
	 */
	icon?: string
}
