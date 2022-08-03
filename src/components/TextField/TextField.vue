<!--
  - @copyright Copyright (c) 2022 Marco Ambrosini <marcoambrosini@pm.me>
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
Note: the inner html `input` element inherits all the attributes from the
textField component so you can add things like `autocomplete`, `maxlength`
and `minlength`.

```
<template>
	<div class="wrapper">
		<TextField :value.sync="text1"
			label="Leading icon and trailing button"
			trailing-button-icon="close"
			:show-trailing-button="text1 !== ''"
			@trailing-button-click="clearText">
			<Magnify :size="16" />
		</TextField>
		<TextField :value.sync="text2"
			label="Success state"
			:success="true"
			@trailing-button-click="clearText">
		</TextField>
		<TextField :value.sync="text3"
			label="Error state"
			:error="true"
			@trailing-button-click="clearText">
		</TextField>
		<TextField :value.sync="text4"
			label="Internal label"
			placeholder="That can be used together with placeholder"
			:label-visible="true"
			trailing-button-icon="close"
			:show-trailing-button="text4 !== ''"
			@trailing-button-click="clearText">
			<Lock :size="16" />
		</TextField>
		<div class="external-label">
			<label for="$refs.textField.id">External label</label>
			<TextField :value.sync="text5"
				ref="textField"
				:label-outside= "true"
				@trailing-button-click="clearText" />
		</div>
	</div>
</template>
<script>
import Magnify from 'vue-material-design-icons/Magnify'
import Lock from 'vue-material-design-icons/Lock'
import Close from 'vue-material-design-icons/Close'

export default {
	data() {
		return {
			text1: '',
			text2: '',
			text3: '',
			text4: '',
			text5: '',
		}
	},

	components: {
		Magnify,
		Lock,
		Close,
	},

	methods: {
		clearText() {
			this.text1 = ''
			this.text3 = ''
		}
	}
}
</script>
<style lang="scss" scoped>
.wrapper {
	display: flex;
	gap: 4px;
	align-items: flex-end;
	flex-wrap: wrap;
}

.external-label {
	display: flex;
	width: 100%;
}
</style>
```
</docs>

<template>
	<InputField v-bind="$props"
		v-on="$listeners"
		@input="handleInput">
		<!-- Default slot for the leading icon -->
		<slot />
		<template slot="trailing-button-icon">
			<Close v-if="trailingButtonIcon === 'close'" :size="20" />
			<ArrowRight v-else-if="trailingButtonIcon === 'arrowRight'" :size="20" />
		</template>
	</InputField>
</template>

<script>

import InputField from '../InputField/InputField.vue'
import Close from 'vue-material-design-icons/Close'
import ArrowRight from 'vue-material-design-icons/ArrowRight'

export default {
	name: 'TextField',

	components: {
		InputField,
		Close,
		ArrowRight,
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
		 * The type of the input element, it can be `text`, `password`,
		 * `email`, `number`, `tel` and `url`.
		 */
		type: {
			type: String,
			default: 'text',
			validator: (value) => [
				'text',
				'password',
				'email',
				'tel',
				'url',
			].includes(value),
		},

		/**
		 * The hidden input label for accessibility purposes. This will also
		 * be used as a placeholder unless the placeholder prop is populated
		 * with a different string.
		 */
		label: {
			type: String,
			default: undefined,
		},

		/**
		 * Pass in true if you want to use an external label. This is useful
		 * if you need a label that looks different from the one provided by
		 * this component
		 */
		labelOutside: {
			type: Boolean,
			default: false,
		},

		/**
		 * We normally have the lable hidden visually and use it for
		 * accessibility only. If you want to have the label visible just above
		 * the input field pass in true to this prop.
		 */
		labelVisible: {
			type: Boolean,
			default: false,
		},

		/**
		 * The placeholder of the input. This defaults as the string that's
		 * passed into the label prop. In order to remove the placeholder,
		 * pass in an empty string.
		 */
		placeholder: {
			type: String,
			default: undefined,
		},

		/**
		 * Controls whether to display the trailing button.
		 */
		showTrailingButton: {
			type: Boolean,
			default: false,
		},

		/**
		 * Specifies which material design icon should be used for the trailing
		 * button. Values can be `close` anbd `arrowRight`.
		 */
		trailingButtonIcon: {
			type: String,
			default: 'close',
			validator: (value) => [
				'close',
				'arrowRight',
			].includes(value),
		},

		/**
		 * Toggles the success state of the component. Adds a checkmark icon.
		 * this cannot be used together with canClear.
		 */
		success: {
			type: Boolean,
			default: false,
		},

		/**
		 * Toggles the error state of the component. Adds an error icon.
		 * this cannot be used together with canClear.
		 */
		error: {
			type: Boolean,
			default: false,
		},
	},

	methods: {
		handleInput(event) {
			this.$emit('update:value', event.target.value)
		},
	},
}
</script>
