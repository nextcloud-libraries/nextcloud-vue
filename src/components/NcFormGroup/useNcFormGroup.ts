/*
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { InjectionKey } from 'vue'

import { inject } from 'vue'

export const NC_FORM_GROUP_CONTEXT_KEY: InjectionKey<{
	isInGroup: false
	formGroupItemClass: undefined
} | {
	isInGroup: true
	formGroupItemClass: string
}> = Symbol.for('NcFormGroup:context')

/**
 * Get NcFormGroup context with a fallback
 * TODO: make it public?
 */
export function useNcFormGroup() {
	return inject(NC_FORM_GROUP_CONTEXT_KEY, {
		isInGroup: false,
		formGroupItemClass: undefined,
	})
}
