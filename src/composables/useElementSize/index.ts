/**
 * SPDX-FileCopyrightText: 2024 Max <max@nextcloud.com>
 * SPDX-License-Identifier: @license AGPL-3.0-or-later
 *
 */

import { nextTick, readonly, ref } from 'vue'
import { unrefElement, useResizeObserver } from '@vueuse/core'
import type { MaybeComputedElementRef } from '@vueuse/core'
import type { Ref } from 'vue'

export interface ElementSize {
  readonly width: Ref<number>
  readonly height: Ref<number>
}

/**
 * Track the size of the given element.
 */
export function useElementSize(target: MaybeComputedElementRef): ElementSize {
	const width = ref(0)
	const height = ref(0)

	/**
	 * Measure the width of the element after a resize
	 */
	useResizeObserver(target, ([entry]) => {
		/**
		 * Wait till the next tick to allow the resize to finish first
		 * and avoid triggering content updates during the resize.
		 *
		 * Without the nextTick we were seeing crashing browsers
		 * in cypress tests.
		 */
		nextTick(() => {
			width.value = entry?.contentRect.width ?? 0
			height.value = entry?.contentRect.height ?? 0
		})
	})

	return { width: readonly(width), height: readonly(height) }
}
