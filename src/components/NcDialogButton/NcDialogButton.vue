<!--
  - SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
Dialog button component used by NcDialog in the actions slot to display the buttons passed by the `buttons` prop.
</docs>

<template>
	<NcButton :aria-label="label"
		:disabled
		:type
		:variant
		@click="handleClick">
		{{ label }}
		<template #icon>
			<!-- @slot Allow to set a custom icon for the button -->
			<slot name="icon">
				<!-- The loading state is an information that must be accessible -->
				<NcLoadingIcon v-if="isLoading" :name="t('Loading …') /* TRANSLATORS: The button is in a loading state*/" />
				<NcIconSvgWrapper v-else-if="icon !== undefined" :svg="icon" />
			</slot>
		</template>
	</NcButton>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { ref } from 'vue'
import { t } from '../../l10n.js'

import NcButton, { ButtonType, ButtonVariant } from '../NcButton/index'
import NcIconSvgWrapper from '../NcIconSvgWrapper/index.js'
import NcLoadingIcon from '../NcLoadingIcon/index.js'

const props = defineProps({
	/**
	 * The function that will be called when the button is pressed.
	 * If the function returns `false` the click is ignored and the dialog will not be closed,
	 * which is the default behavior of "reset"-buttons.
	 *
	 * @type {() => unknown|false|Promise<unknown|false>}
	 */
	callback: {
		type: Function,
		required: false,
		default: () => {},
	},

	/**
	 * The label of the button
	 */
	label: {
		type: String,
		required: true,
	},

	/**
	 * Optional inline SVG icon for the button
	 */
	icon: {
		type: String,
		required: false,
		default: undefined,
	},

	/**
	 * The button type, see `NcButton`.
	 *
	 * @type {'button'|'submit'|'reset'}
	 */
	type: {
		type: String as PropType<ButtonType | `${ButtonType}`>,
		default: 'button',
		validator: (type: string) => ['button', 'submit', 'reset'].includes(type),
	},

	/**
	 * If the button should be shown as disabled
	 */
	disabled: {
		type: Boolean,
		default: false,
	},

	/**
	 * The button variant, see `NcButton`.
	 *
	 * @type {'primary'|'secondary'|'tertiary'|'error'|'warning'|'success'}
	 * @since 8.23.0
	 */
	variant: {
		type: String as PropType<ButtonVariant | `${ButtonVariant}`>,
		required: false,
		default: 'secondary',
		validator: (type) => typeof type === 'string' && ['primary', 'secondary', 'tertiary', 'error', 'warning', 'success'].includes(type),
	},
})

const emit = defineEmits<{
	(name: 'click', event: MouseEvent, payload: unknown): void
}>()

const isLoading = ref(false)

/**
 * Handle clicking the button
 * @param e The click event
 */
async function handleClick(e: MouseEvent) {
	// Do not re-emit while loading
	if (isLoading.value) {
		return
	}

	isLoading.value = true
	try {
		// for reset buttons the default is "false"
		const fallback = props.type === 'reset' ? false : undefined
		const result = await props.callback?.() ?? fallback
		if (result !== false) {
			/**
			 * The click event (`MouseEvent`) and the value returned by the callback
			 */
			emit('click', e, result)
		}
	} finally {
		isLoading.value = false
	}
}
</script>
