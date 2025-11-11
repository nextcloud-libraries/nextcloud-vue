/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { MaybeRefOrGetter } from 'vue'

import { mdiCheck, mdiContentCopy } from '@mdi/js'
import { computed, ref, toValue } from 'vue'
import { t } from '../l10n.ts'

const DELAY = 2000

/**
 * Copy content to clipboard with copied state
 *
 * @param content - Content to copy
 */
export function useCopy(content: MaybeRefOrGetter<string>) {
	const isCopied = ref(false)
	const icon = computed(() => isCopied.value ? mdiCheck : mdiContentCopy)
	const altText = computed(() => isCopied.value ? t('Copied') : t('Copy to clipboard'))

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
		icon,
		altText,
	}
}
