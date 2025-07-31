/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { Ref } from 'vue'

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
export function useIsFullscreen(): Readonly<Ref<boolean>> {
	return readonly(isFullscreen)
}
