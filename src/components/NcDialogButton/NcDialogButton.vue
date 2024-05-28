<!--
  - SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
Dialog button component used by NcDialog in the actions slot to display the buttons passed by the `buttons` prop.
</docs>

<template>
	<NcButton :aria-label="label"
		:disabled="disabled"
		:type="type"
		@click="handleClick">
		{{ label }}
		<template #icon>
			<!-- @slot Allow to set a custom icon for the button -->
			<slot name="icon">
				<NcIconSvgWrapper v-if="icon !== undefined" :svg="icon" />
			</slot>
		</template>
	</NcButton>
</template>

<script>
import { defineComponent } from 'vue'
import NcButton from '../NcButton/index.ts'
import NcIconSvgWrapper from '../NcIconSvgWrapper/index.js'

export default defineComponent({
	name: 'NcDialogButton',

	components: {
		NcButton,
		NcIconSvgWrapper,
	},

	props: {
		/**
		 * The function that will be called when the button is pressed
		 * @type {() => void}
		 */
		callback: {
			type: Function,
			required: true,
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
		 * The button type, see NcButton
		 * @type {'primary'|'secondary'|'error'|'warning'|'success'}
		 */
		type: {
			type: String,
			required: false,
			default: 'secondary',
			validator: (type) => typeof type === 'string' && ['primary', 'secondary', 'error', 'warning', 'success'].includes(type),
		},

		/**
		 * If the button should be shown as disabled
		 */
		disabled: {
			type: Boolean,
			default: false,
		},
	},

	emits: ['click'],

	setup(props, { emit }) {
		/**
		 * Handle clicking the button
		 * @param {MouseEvent} e The click event
		 */
		const handleClick = (e) => {
			props.callback?.()
			emit('click', e)
		}

		return { handleClick }
	},
})
</script>
