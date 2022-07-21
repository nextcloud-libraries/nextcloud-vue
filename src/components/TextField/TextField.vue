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
	<TextField :value.sync="text"
		placeholder="Type something here"
		:can-clear="true"
		@clear="clearText" />
</template>
<script>

export default {
	data() {
		return {
			text: '',
		}
	},

	methods: {
		clearText() {
			this.text = ''
		}
	}
}
</script>
```
</docs>

<template>
	<div class="text-field">
		<input v-bind="$attrs"
			ref="input"
			class="text-field__input"
			type="text"
			:class="{ 'text-field__input--can-clear': canClear }"
			:value="value"
			v-on="$listeners"
			@input="handleInput">
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

export default {
	name: 'TextField',

	components: {
		Button,
		Close,
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
	},

	methods: {
		handleInput(event) {
			this.$emit('update:value', event.target.value)
		},

		clearText(event) {
			this.$emit('clear', event)
			this.$refs.input.focus()
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
