/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { MaybeRefOrGetter } from 'vue'

import { ref, toValue } from 'vue'

const DELAY = 2000

/**
 * Copy content to clipboard with copied state
 *
 * @param content - Content to copy
 */
export function useCopy(content: MaybeRefOrGetter<string>) {
	const isCopied = ref(false)

	/**
	 * Copy the content to clipboard
	 */
	async function copy() {
		if (isCopied.value) {
			return
		}

		const value = toValue(content)
		try {
			await navigator.clipboard.writeText(value)
		} catch {
			// Fallback for a case when clipboard API is not available or permission denied
			prompt('', value)
		}

		isCopied.value = true
		setTimeout(() => {
			isCopied.value = false
		}, DELAY)
	}

	return {
		isCopied,
		copy,
	}
}
