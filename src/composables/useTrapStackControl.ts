/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { MaybeRefOrGetter, Ref } from 'vue'

import { onUnmounted, toValue, watch } from 'vue'
import { createTrapStackController } from '../utils/focusTrap.ts'

/**
 * Control global focus trap stack when focus trap is managed manually
 *
 * @param shouldPause - Whether focus trap should be paused
 * @param options - Additional options
 * @param options.disabled - Whether the controller should be disabled
 */
export function useTrapStackControl(shouldPause: Ref<boolean> | (() => boolean), options: { disabled?: MaybeRefOrGetter<boolean> } = {}) {
	const trapStackController = createTrapStackController()

	watch(shouldPause, () => {
		if (toValue(options.disabled)) {
			return
		}

		if (toValue(shouldPause)) {
			trapStackController.pause()
		} else {
			trapStackController.unpause()
		}
	})

	onUnmounted(() => {
		trapStackController.unpause()
	})
}
