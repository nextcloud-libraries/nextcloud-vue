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
			label="Type something here"
			:has-trailing-button="text1 !== ''"
			@trailing-button-click="clearText">
			<Magnify :size="16" />
			<template slot="trailing-button-icon">
				<Close  :size="20" /></template>
			</template>
		</TextField>
		<TextField :value.sync="text2"
			label="Type something here"
			:success="true"
			@trailing-button-click="clearText">
		</TextField>
		<TextField :value.sync="text3"
			label="Type something here"
			:label-visible="true"
			:has-trailing-button="text3 !== ''"
			@trailing-button-click="clearText">
			<Lock :size="16" />
			<template slot="trailing-button-icon">
				<Close :size="20" /></template>
			</template>
		</TextField>
		<div class="external-label">
			<label for="$refs.textField.id">External label</label>
			<TextField :value.sync="text4"
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
	<div class="text-field">
		<label v-if="!labelOutside && label !== undefined"
			class="text-field__label"
			:class="{ 'text-field__label--hidden': !labelVisible }"
			:for="inputName">
			{{ label }}
		</label>
		<div class="text-field__main-wrapper">
			<input v-bind="$attrs"
				ref="input"
				:name="inputName"
				class="text-field__input"
				type="text"
				:placeholder="computedPlaceholder"
				aria-live="polite"
				:class="{
					'text-field__input--trailing-icon': hasTrailingButton || hasTrailingIcon,
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

			<!-- trailing button -->
			<Button v-else-if="hasTrailingButton"
				type="tertiary-no-background"
				class="text-field__clear-button"
				@click="handleTrailingButtonClick">
				<!-- Populating this slot creates a trailing button within the
				input boundaries that emits a `trailing-button-click` event -->
				<template slot="icon">
					<slot name="trailing-button-icon" />
				</template>
			</Button>
		</div>
	</div>
</template>

<script>
import Button from '../Button/index.js'
import Check from 'vue-material-design-icons/Check'
import GenRandomId from '../../utils/GenRandomId.js'

export default {
	name: 'TextField',

	components: {
		Button,
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
		hasTrailingButton: {
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
		inputName() {
			return 'input' + GenRandomId()
		},

		hasLeadingIcon() {
			return this.$slots.default
		},

		hasTrailingIcon() {
			return this.success
		},

		hasPlaceholder() {
			return this.placeholder !== '' && this.placeholder !== undefined
		},

		computedPlaceholder() {
			if (this.labelVisible) {
				return this.hasPlaceholder ? this.placeholder : ''
			} else {
				return this.hasPlaceholder ? this.placeholder : this.label
			}
		},
	},

	watch: {
		/**
		 * Don't allow both trailing checkmark and clear button to be present
		 * at the same time
		 */
		success() {
			this.validateTrailingIcon()
		},

		canClear() {
			this.validateTrailingIcon()
		},

		label() {
			this.validateLabel()
		},

		labelOutside() {
			this.validateLabel()
		},
	},

	methods: {
		handleInput(event) {
			this.$emit('update:value', event.target.value)
		},

		handleTrailingButtonClick(event) {
			this.$emit('trailing-button-click', event)
		},

		validateTrailingIcon() {
			if (this.canClear && this.success) {
				throw new Error('success and canClear props cannot be true at the same time')
			}
		},

		validateLabel() {
			if (this.label && !this.labelOutside) {
				throw new Error('You need to add a label to the textField component. Either use the prop label or use an external one, as per the example in the documentation')
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

	&__main-wrapper {
		height: 36px;
		position: relative;
	}

	&__input {
		margin: 0;
		padding: 0 12px;
		font-size: var(--default-font-size);
		background-color: var(--color-main-background);
		color: var(--color-main-text);
		border: 2px solid var(--color-border-dark);
		height: 36px !important;
		border-radius: var(--border-radius-large);
		text-overflow: ellipsis;
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

		&--leading-icon {
			padding-left: 28px;
		}

		&--trailing-icon {
			padding-right: 28px;
		}
	}

	&__label {
		padding: 0px 4px 4px 12px;
		display: block;

		&--hidden {
			position: absolute;
			left: -10000px;
			top: auto;
			width: 1px;
			height: 1px;
			overflow: hidden;
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
			bottom: 2px;
			left: 2px;
		}

		&--trailing {
			bottom: 2px;
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
