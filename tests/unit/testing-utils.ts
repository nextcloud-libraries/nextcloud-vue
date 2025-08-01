/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { vi } from 'vitest'
import { nextTick } from 'vue'

/**
 * Resize the window to a given width and wait for re-render
 *
 * @param width - The width of the window
 */
export async function resizeWindowWidth(width: number) {
	vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(width)
	window.dispatchEvent(new window.Event('resize'))
	await nextTick()
}
