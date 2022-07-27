<!--
  - @copyright Copyright (c) 2021 Marco Ambrosini <marcoambrosini@pm.me>
  -
  - @author Marco Ambrosini <marcoambrosini@pm.me>
  -
  - @license GNU AGPL version 3 or any later version
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
-->

<docs>
### Description

General purpose text field component.

```
<template>
	<div class="wrapper">
		<TextField :value.sync="text"
			placeholder="Type something here"
			:can-clear="true"
			@clear="clearText">
			<Magnify :size="16 " />
		</TextField>
		<TextField :value.sync="text"
			placeholder="Type something here"
			:success="true"
			@clear="clearText">
		</TextField>
	</div>
</template>
<script>
import Magnify from 'vue-material-design-icons/Magnify'

export default {
	data() {
		return {
			text: '',
		}
	},

	components: {
		Magnify,
	},

	methods: {
		clearText() {
			this.text = ''
		}
	}
}
</script>
<style lang="scss" scoped>
.wrapper {
	display: flex;
	gap: 4px;
}
</style>
```
</docs>

<template>
	<div class="text-field">
		<input v-bind="$attrs"
			ref="input"
			class="text-field__input"
			type="text"
			:class="{
				'text-field__input--can-clear': canClear,
				'text-field__input--leading-icon': hasLeadingIcon,
			}"
			:value="value"
			v-on="$listeners"
			@input="handleInput">

		<!-- Leading icon -->
		<div class="text-field__icon text-field__icon--leading">
			<!-- Leading material design icon in the text field, set the size to 18 -->
			<slot />
		</div>
		<!-- Success icon -->
		<div v-if="success" class="text-field__icon text-field__icon--trailing">
			<Check :size="18" />
		</div>
		<!-- clear text button -->
		<Button v-if="canClear"
			type="tertiary-no-background"
			class="text-field__clear-button"
			@click="clearText">
			<Close slot="icon"
				:size="20" />
		</Button>
	</div>
</template>

<script>
import Button from '../Button/index.js'
import Close from 'vue-material-design-icons/Close'
import Check from 'vue-material-design-icons/Check'

export default {
	name: 'TextField',

	components: {
		Button,
		Close,
		Check,
	},

	props: {
		/**
		 * The value of the input field
		 */
		value: {
			type: String,
			required: true,
		},

		/**
		 * Controls whether to display the clear button or not. Since the
		 * parent component will have to store the value of this text input,
		 * once clear button is pressed, there's no change in the value of
		 * the text input. Instead, a 'clear' event is sent to the parent
		 * component.
		 */
		canClear: {
			type: Boolean,
			default: false,
		},

		/**
		 * Toggles the success state of the component. Adds a checkmark icon.
		 * this cannot be used together with canClear.
		 */
		success: {
			type: Boolean,
			default: false,
		},
	},

	computed: {
		hasLeadingIcon() {
			return this.$slots.default
		},
	},

	watch: {
		/**
		 * Don't allow both trailing checkmark and clear button to be present
		 * at the same time
		 */
		success() {
			this.validateProps()
		},

		canClear() {
			this.validateProps()
		},
	},

	methods: {
		handleInput(event) {
			this.$emit('update:value', event.target.value)
		},

		clearText(event) {
			this.$emit('clear', event)
			this.$refs.input.focus()
		},

		validateProps() {
			if (this.canClear && this.success) {
				throw new Error('success and canClear props cannot be true at the same time')
			}
		},
	},
}

</script>

<style lang="scss" scoped>

.text-field {
	position: relative;
	width: 100%;
	border-radius: var(--border-radius-large);
	padding-left: 16px;

	&__input {
		margin: 0;
		padding: 0 12px;
		font-size: var(--default-font-size);
		background-color: var(--color-main-background);
		color: var(--color-main-text);
		border: 2px solid var(--color-border-dark);
		height: 36px !important;
		border-radius: var(--border-radius-large);
		cursor: pointer;
		width: 100%;
		-webkit-appearance: textfield !important;
		-moz-appearance: textfield !important;

		&:hover {
			border-color: var(--color-primary-element);
		}
		&:focus {
			cursor: text;
		}

		&--can-clear {
			padding-right: 36px;
		}

		&--leading-icon {
			padding-left: 32px;
		}
	}

	&__icon {
		position: absolute;
		height: 32px;
		width: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0.7;
		&--leading {
			top: 2px;
			left: 20px;
		}

		&--trailing {
			top: 2px;
			right: 2px;
		}
	}

	&__clear-button {
		position: absolute;
		top: 2px;
		right: 1px;
	}
}

::v-deep .button-vue {
	min-width: unset;
	min-height: unset;
	height: 32px;
	width: 32px !important;
	border-radius: var(--border-radius-large);
}
</style>
