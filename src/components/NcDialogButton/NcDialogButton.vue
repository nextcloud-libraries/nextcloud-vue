<!--
  - SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
Dialog button component used by NcDialog in the actions slot to display the buttons passed by the `buttons` prop.
</docs>

<template>
	<NcButton
		:aria-label="label"
		:disabled="disabled"
		:type="type"
		:native-type="nativeType"
		:variant="variant"
		@click="handleClick">
		{{ label }}
		<template #icon>
			<!-- @slot Allow to set a custom icon for the button -->
			<slot name="icon">
				<!-- The loading state is an information that must be accessible -->
				<NcLoadingIcon v-if="isLoading" :name="t('Loading …') /* TRANSLATORS: The button is in a loading state*/" />
				<NcIconSvgWrapper v-else-if="icon !== undefined" :svg="icon" />
			</slot>
		</template>
	</NcButton>
</template>

<script setup>
import { ref } from 'vue'
import { t } from '../../l10n.js'
import NcButton from '../NcButton/index.js'
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
	 * The button type, see NcButton.
	 *
	 * @deprecated The usage for setting the color variant is deprecated and will be removed with v9.
	 * @type {'button'|'submit'|'reset'|'primary'|'secondary'|'error'|'warning'|'success'}
	 */
	type: {
		type: String,
		required: false,
		default: 'secondary',
		validator: (type) => typeof type === 'string' && ['button', 'submit', 'reset', 'primary', 'secondary', 'tertiary', 'error', 'warning', 'success'].includes(type),
	},

	/**
	 * See `nativeType` of `NcButton`.
	 * @deprecated use `type` instead - will removed with v9
	 */
	nativeType: {
		type: String,
		required: false,
		default: 'button',
		validator(value) {
			return ['submit', 'reset', 'button'].includes(value)
		},
	},

	/**
	 * If the button should be shown as disabled
	 */
	disabled: {
		type: Boolean,
		default: false,
	},

	/**
	 * The button variant, see NcButton.
	 *
	 * @type {'primary'|'secondary'|'tertiary'|'error'|'warning'|'success'}
	 * @since 8.24.0
	 */
	variant: {
		type: String,
		required: false,
		default: 'secondary',
		validator: (type) => typeof type === 'string' && ['primary', 'secondary', 'tertiary', 'error', 'warning', 'success'].includes(type),
	},
})

const emit = defineEmits(['click'])

const isLoading = ref(false)

/**
 * Handle clicking the button
 * @param {MouseEvent} e The click event
 */
async function handleClick(e) {
	// Do not re-emit while loading
	if (isLoading.value) {
		return
	}

	isLoading.value = true
	try {
		// for reset buttons the default is "false"
		const fallback = props.nativeType === 'reset' ? false : undefined
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
