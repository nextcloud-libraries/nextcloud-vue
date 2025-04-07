/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { DeepReadonly, MaybeRef, Ref } from 'vue'
import { ref, readonly, watch, toValue, computed } from 'vue'
import { createSharedComposable, usePreferredDark, useMutationObserver } from '@vueuse/core'
import { checkIfDarkTheme } from '../../functions/isDarkTheme/index.ts'

/**
 * Check whether the dark theme is enabled on a specific element.
 * If you need to check an entire page, use `useIsDarkTheme` instead for better performance.
 * Reacts on element attributes change and system theme change.
 * @param el - The element to check for the dark theme enabled on (default is `document.body`)
 * @return {DeepReadonly<Ref<boolean>>} - computed boolean whether the dark theme is enabled
 */
export function useIsDarkThemeElement(el: MaybeRef<HTMLElement> = document.body): DeepReadonly<Ref<boolean>> {
	const element = computed(() => toValue(el))
	const isDarkTheme = ref(checkIfDarkTheme(toValue(el)))
	const isDarkSystemTheme = usePreferredDark()

	/** Update the isDarkTheme */
	function updateIsDarkTheme() {
		isDarkTheme.value = checkIfDarkTheme(element.value)
	}

	// Watch for element change to handle data-theme* attributes change
	useMutationObserver(element, updateIsDarkTheme, { attributes: true })
	// Watch for system theme change for the default theme
	watch(isDarkSystemTheme, updateIsDarkTheme, { immediate: true })
	// Watch for element changes
	watch(element, updateIsDarkTheme)

	return readonly(isDarkTheme)
}

/**
 * Shared composable to check whether the dark theme is enabled on the page.
 * Reacts on body data-theme-* attributes change and system theme change.
 * @return {DeepReadonly<Ref<boolean>>} - computed boolean whether the dark theme is enabled
 */
export const useIsDarkTheme = createSharedComposable(() => useIsDarkThemeElement())
