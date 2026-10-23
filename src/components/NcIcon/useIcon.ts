/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ComputedRef } from 'vue'
import type { MaybeRefOrGetter } from '@vueuse/core'
import type { IconGeneral, IconNormalized } from './normalizeIcon.ts'
import { computed } from 'vue'
import { toValue } from '@vueuse/core'
import { normalizeIcon } from './normalizeIcon.ts'

/**
 * Reactive normalizeIcon
 * @param icon - Icon in any supported format
 */
export function useIcon(icon: MaybeRefOrGetter<IconGeneral>): ComputedRef<IconNormalized> {
	return computed(() => normalizeIcon(toValue(icon)))
}
