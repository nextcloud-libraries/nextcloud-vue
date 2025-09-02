/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ComputedRef, InjectionKey } from 'vue'

import { inject } from 'vue'

export const INSIDE_RADIO_GROUP_KEY: InjectionKey<ComputedRef<{ modelValue: string, onUpdate: (value: string) => void }>> = Symbol.for('insideRadioGroup')

/**
 * To check if inside a radio group and if yes inject the current modelValue as well as the onUpdate method.
 */
export function useInsideRadioGroup() {
	return inject(INSIDE_RADIO_GROUP_KEY, undefined)
}
