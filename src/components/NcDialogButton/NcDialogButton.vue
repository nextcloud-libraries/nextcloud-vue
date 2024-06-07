<!--
  - @copyright Copyright (c) 2023 Ferdinand Thiessen
  -
  - @author Ferdinand Thiessen <opensource@fthiessen.de>
  -
  - @license AGPL-3.0-or-later
  -
  - This program is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as
  - published by the Free Software Foundation, either version 3 of the
  - License, or (at your option) any later version.
  -
  - This program is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
  -
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
import NcButton from '../NcButton/index.js'
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
