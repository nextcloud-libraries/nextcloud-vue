/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { VNode, VNodeChildren } from 'vue'

import { computed, onBeforeMount, ref, useSlots } from 'vue'

function slotText(slot: VNode): string {
	const extractText = (child?: VNodeChildren): string => {
		if (typeof child === 'string') {
			return child.trim()
		} else if (Array.isArray(child)) {
			return child
				.map((c) => extractText(c))
				.join('')
		}
		return ''
	}

	return extractText(slot.children)
}

export function useActionText() {
	const slots = useSlots()
	const text = ref('')
	const isLongText = computed(() => text.value && text.value.trim().length > 20)

	function getText() {
		return (slots.default?.() ?? [])
			.map(slotText)
			.join('')
	}

	onBeforeMount(() => { text.value = getText() })

	return {
		/**
		 * The current text from the default slot as $slots is not reactive
		 */
		text,
		/**
		 * Check if the passed text is considered long (currently > 20 characters)
		 */
		isLongText,
	}
}
