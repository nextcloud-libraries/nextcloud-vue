/*!
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { MaybeRefOrGetter } from '@vueuse/core'
import type { DeepReadonly, Ref } from 'vue'

import { createSharedComposable, toValue, useMutationObserver, usePreferredDark } from '@vueuse/core'
import { computed, inject, readonly, ref, watch } from 'vue'
import { checkIfDarkTheme } from '../../functions/isDarkTheme/index.ts'
import { INJECTION_KEY_THEME } from './constants.ts'

/**
 * Check whether the dark theme is enabled on a specific element.
 * If you need to check an entire page, use `useIsDarkTheme` instead for better performance.
 * Reacts on element attributes change and system theme change.
 * @param el - The element to check for the dark theme enabled on (default is `document.body`)
 * @return {DeepReadonly<Ref<boolean>>} - computed boolean whether the dark theme is enabled
 */
export function useIsDarkThemeElement(el?: MaybeRefOrGetter<HTMLElement>): DeepReadonly<Ref<boolean>> {
	const element = computed(() => toValue(el) ?? document.body)

	const isDarkTheme = ref(checkIfDarkTheme(element.value))
	const isDarkSystemTheme = usePreferredDark()

	/** Update the isDarkTheme */
	function updateIsDarkTheme() {
		isDarkTheme.value = checkIfDarkTheme(element.value)
	}

	// Watch for element change to handle data-theme* attributes change
	useMutationObserver(element, updateIsDarkTheme, { attributes: true })
	// Watch for ref changes
	watch(element, updateIsDarkTheme)
	// Watch for system theme change for the default theme
	watch(isDarkSystemTheme, updateIsDarkTheme, { immediate: true })

	return readonly(isDarkTheme)
}

/**
 * The real shared composable of the dark theme state.
 * We need to wrap this to allow to react to injected theme changes.
 */
const useInternalIsDarkTheme = createSharedComposable(() => useIsDarkThemeElement())

/**
 * Shared composable to check whether the dark theme is enabled on the page.
 *
 * Reacts on body data-theme-* attributes change and system theme change.
 * As well as any enforced theme by the `NcThemeProvider`.
 *
 * @return Computed boolean whether the dark theme is enabled
 */
export function useIsDarkTheme(): DeepReadonly<Ref<boolean>> {
	const isDarkTheme = useInternalIsDarkTheme()
	const enforcedTheme = inject(INJECTION_KEY_THEME, undefined)

	return computed(() => {
		if (enforcedTheme?.value) {
			return enforcedTheme.value === 'dark'
		}
		return isDarkTheme.value
	})
}
