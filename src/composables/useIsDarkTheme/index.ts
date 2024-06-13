/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import { useCssVar, createSharedComposable } from '@vueuse/core'
import type { MaybeRef } from '@vueuse/core'

/**
 * Check whether the dark theme is enabled in Nextcloud on a specific element.
 * If you need to check a whole page, use `useIsDarkTheme` instead.
 *
 * @param el - the element to check for the dark theme enabled on
 * @return {ComputedRef<boolean>} - computed boolean whether the dark theme is enabled
 */
export function useIsDarkThemeElement(el: MaybeRef<HTMLElement> = document.body): ComputedRef<boolean> {
	// Nextcloud uses --background-invert-if-dark for dark theme filters in CSS
	// Values:
	// - 'invert(100%)' for the dark theme
	// - 'no' for the light theme
	const backgroundInvertIfDark = useCssVar('--background-invert-if-dark', el)
	return computed(() => backgroundInvertIfDark.value === 'invert(100%)')
}

/**
 * Shared composable to check whether the dark theme is enabled in Nextcloud
 *
 * @return {ComputedRef<boolean>} - computed boolean whether the dark theme is enabled
 */
export const useIsDarkTheme = createSharedComposable(() => useIsDarkThemeElement())
