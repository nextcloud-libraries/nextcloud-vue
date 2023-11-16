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

/**
 * @deprecated Is to be removed in v9.0.0 with Vue 3 migration.
 *             Use `composables/useIsFullscreen` instead.
 *             Defined and exported only for isFullscreen mixin.
 */
export const isFullscreenState = readonly(isFullscreen)
