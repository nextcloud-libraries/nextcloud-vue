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
import type { ButtonType, ButtonVariant } from '../NcButton/index.ts'
import { ref } from 'vue'
import { t } from '../../l10n.js'

import NcButton from '../NcButton/index'
import NcIconSvgWrapper from '../NcIconSvgWrapper/index.js'
import NcLoadingIcon from '../NcLoadingIcon/index.js'

const props = withDefaults(defineProps<{
	/**
	 * The function that will be called when the button is pressed.
	 * If the function returns `false` the click is ignored and the dialog will not be closed,
	 * which is the default behavior of "reset"-buttons.
	 *
	 * @default '() => {}'
	 */
	callback?: () => unknown|false

	/**
	 * If the button should be shown as disabled.
	 *
	 * @default false
	 */
	disabled?: boolean

	/**
	 * Optional inline SVG icon for the button.
	 *
	 * @default undefined
	 */
	icon?: string

	/**
	 * The label of the button.
	 */
	label: string

	/**
	 * The button type, see `NcButton`.
	 *
	 * @default 'button'
	 */
	type?: ButtonType

	/**
	 * The button variant, see `NcButton`.
	 *
	 * @default 'tertiary'
	 * @since 8.24.0
	 */
	variant?: ButtonVariant
}>(), {
	callback: () => {},
	disabled: false,
	icon: undefined,
	type: 'button',
	variant: 'tertiary',
})

const emit = defineEmits<{
	/**
	 * The click event (`MouseEvent`) and the value returned by the callback
	 */
	'click': [event: MouseEvent, payload: unknown]
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
			emit('click', e, result)
		}
	} finally {
		isLoading.value = false
	}
}
</script>
