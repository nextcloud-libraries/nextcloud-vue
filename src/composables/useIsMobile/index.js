/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { readonly, ref } from 'vue'

/** The minimal width of the viewport for a desktop screen */
export const MOBILE_BREAKPOINT = 1024
/** The minimal width of the viewport for a small mobile screen, a half of the minimal desktop */
export const MOBILE_SMALL_BREAKPOINT = MOBILE_BREAKPOINT / 2

const isLessThanBreakpoint = (breakpoint) => document.documentElement.clientWidth < breakpoint

// Store the state of the viewport size in a module-scope to reuse between module's users
const isMobile = ref(isLessThanBreakpoint(MOBILE_BREAKPOINT))
const isSmallMobile = ref(isLessThanBreakpoint(MOBILE_SMALL_BREAKPOINT))

window.addEventListener('resize', () => {
	isMobile.value = isLessThanBreakpoint(MOBILE_BREAKPOINT)
	isSmallMobile.value = isLessThanBreakpoint(MOBILE_SMALL_BREAKPOINT)
}, { passive: true })

/**
 * Use global isMobile state
 *
 * @return {import('vue').DeepReadonly<import('vue').Ref<boolean>>} Reactive flag for MOBILE_BREAKPOINT
 */
export function useIsMobile() {
	return readonly(isMobile)
}

/**
 * Use global isSmallMobile state
 *
 * @return {import('vue').DeepReadonly<import('vue').Ref<boolean>>} Reactive flag for MOBILE_SMALL_BREAKPOINT
 */
export function useIsSmallMobile() {
	return readonly(isSmallMobile)
}

/**
 * @deprecated Is to be removed in v9.0.0 with Vue 3 migration.
 *             Use `composables/useIsMobile` instead.
 *             Defined and exported only for isMobile mixin.
 */
export const isMobileState = readonly(isMobile)
