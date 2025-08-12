/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { FocusTrap } from 'focus-trap'

declare global {
	interface Window {
		_nc_focus_trap: FocusTrap[]
	}
}

/**
 * Get the default global focus trap stack
 */
export function getTrapStack() {
	// Create global stack if undefined
	window._nc_focus_trap ??= []

	return window._nc_focus_trap
}

/**
 * Create controller to pause/unpause the global focus trap stack.
 *
 * When some component manually implements its own focus-trap without using global focus-trap stack,
 * it also needs to pause the global stack to avoid conflict.
 *
 * Note: if global focus-trap stack was modified outside TrapStackController (likely due to user actions),
 * trap queue should be correctly handled by focus-trap itself.
 * It is no longer safe to unpause cached `pausedStack`, as it can disrupt the current focus trap state.
 * We assume that the focus-trap stack is self-regulated and ignore unpause.
 */
export function createTrapStackController() {
	/**
	 * Stack of focus traps that were paused to unpause the exact stack later
	 */
	let pausedStack: FocusTrap[] = []

	return {
		/**
		 * Pause the current focus-trap stack
		 */
		pause() {
			pausedStack = [...getTrapStack()]
			for (const trap of pausedStack) {
				trap.pause()
			}
		},
		/**
		 * Unpause the paused focus trap stack
		 * If the actual stack is different from the paused one, ignore unpause.
		 */
		unpause() {
			if (pausedStack.length === getTrapStack().length) {
				for (const trap of pausedStack) {
					trap.unpause()
				}
			}
			pausedStack = []
		},
	}
}
