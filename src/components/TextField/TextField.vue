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
### Sescription

General purpose text field component.

```
<template>
	<TextField :value.sync="textField"
</template>
<script>

export default {
	data() {
		return {
			textField: '',
		}
	}
}
</script>
```
</docs>

<template>
	<div class="text-field">
		<input class="text-input__input"
			type="text"
			:value="value"
			@input="handleInput">
		<Button type="tertiary-no-background" v-if="showClearButton" class="text-input__clear-button" />
	</div>
</template>

<script>
import Button from '../Button/index.js'

export default {
	name: 'TextField',

	components: {
		Button,
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
		 * The input placeholder
		 */
		placeholder: {
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
		showClearButton: {
			type: Boolean,
			default: true,
		},
	},

	methods: {
		handleInput(event) {
			this.$emit('update:value', event.target.value)
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
		width: 100%;
	}

	&__clear-button {
		position: absolute;
		top: 0;
		right: 0;
	}
}
</style>
