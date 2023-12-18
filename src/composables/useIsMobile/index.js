/**
 * @copyright Copyright (c) 2023 Grigorii K. Shartsev <me@shgk.me>
 *
 * @author Grigorii K. Shartsev <me@shgk.me>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
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
