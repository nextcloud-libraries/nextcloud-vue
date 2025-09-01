/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { DeepReadonly, Ref } from 'vue'

import { readonly, ref } from 'vue'

const isFullscreen = ref(checkIfIsFullscreen())

window.addEventListener('resize', () => {
	isFullscreen.value = checkIfIsFullscreen()
})

/**
 * If the window height is equal to the screen height,
 * we are in full screen mode.
 */
function checkIfIsFullscreen(): boolean {
	return window.outerHeight === window.screen.height
}

/**
 * Use global `isFullscreen` state, based on the screen height check.
 */
export function useIsFullscreen(): DeepReadonly<Ref<boolean>> {
	return readonly(isFullscreen)
}

/**
 * @deprecated Is to be removed in v9.0.0 with Vue 3 migration.
 *             Use `composables/useIsFullscreen` instead.
 *             Defined and exported only for isFullscreen mixin.
 */
export const isFullscreenState = readonly(isFullscreen)
