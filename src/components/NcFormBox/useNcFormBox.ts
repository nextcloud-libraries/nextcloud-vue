/*
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { InjectionKey } from 'vue'

import { inject } from 'vue'

export const NC_FORM_BOX_CONTEXT_KEY: InjectionKey<{
	isInFormBox: false
	isInFormBoxRow: false
	formBoxItemClass: undefined
} | {
	isInFormBox: true
	isInFormBoxRow: boolean
	formBoxItemClass: string
}> = Symbol.for('NcFormBox:context')

/**
 * Get NcFormBox context with a fallback
 * TODO: make it public?
 */
export function useNcFormBox() {
	return inject(NC_FORM_BOX_CONTEXT_KEY, {
		isInFormBox: false,
		isInFormBoxRow: false,
		formBoxItemClass: undefined,
	})
}
