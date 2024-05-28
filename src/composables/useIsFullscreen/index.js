/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { readonly, ref } from 'vue'

// if the window height is equal to the screen height,
// we're in full screen mode
const checkIfIsFullscreen = () => window.outerHeight === screen.height

const isFullscreen = ref(checkIfIsFullscreen())

window.addEventListener('resize', () => {
	isFullscreen.value = checkIfIsFullscreen()
})

/**
 * Use global isFullscreen state, based on the screen height check
 *
 * @return {import('vue').DeepReadonly<import('vue').Ref<boolean>>}
 */
export function useIsFullscreen() {
	return readonly(isFullscreen)
}
