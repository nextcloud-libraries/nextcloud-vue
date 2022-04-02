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

This component is used by the other Fields components.
It extends and styles an HTMLInputElement.

You cannot use it as is. This is here for documentation purposes.
See the other field components.

For a list of all available props and attributes, please check the [HTMLInputElement documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attributes)

</docs>

<template>
	<div class="input-field">
		<label v-if="!labelOutside && label !== undefined"
			class="input-field__label"
			:class="{ 'input-field__label--hidden': !labelVisible }"
			:for="computedId">
			{{ label }}
		</label>
		<div class="input-field__main-wrapper">
			<input v-bind="$attrs"
				:id="computedId"
				ref="input"
				class="input-field__input"
				:type="type"
				:disabled="disabled"
				:placeholder="computedPlaceholder"
				:aria-describedby="helperText.length > 0 ? `${inputName}-helper-text` : ''"
				aria-live="polite"
				:class="{
					'input-field__input--trailing-icon': showTrailingButton || hasTrailingIcon,
					'input-field__input--leading-icon': hasLeadingIcon,
					'input-field__input--success': success,
					'input-field__input--error': error,
				}"
				:value="value"
				@input="handleInput">

			<!-- Leading icon -->
			<div v-show="hasLeadingIcon" class="input-field__icon input-field__icon--leading">
				<!-- Leading material design icon in the text field, set the size to 18 -->
				<slot />
			</div>

			<!-- trailing button -->
			<NcButton v-if="showTrailingButton"
				type="tertiary-no-background"
				class="input-field__clear-button"
				:aria-label="trailingButtonLabel"
				:disabled="disabled"
				@click="handleTrailingButtonClick">
				<!-- Populating this slot creates a trailing button within the
				input boundaries that emits a `trailing-button-click` event -->
				<template #icon>
					<slot name="trailing-button-icon" />
				</template>
			</NcButton>

			<!-- Success and error icons -->
			<div v-else-if="success || error"
				class="input-field__icon input-field__icon--trailing">
				<Check v-if="success" :size="18" />
				<AlertCircle v-else-if="error" :size="18" />
			</div>
		</div>
		<p v-if="helperText.length > 0"
			:id="`${inputName}-helper-text`"
			class="input-field__helper-text-message"
			:class="{
				'input-field__helper-text-message--error': error,
				'input-field__helper-text-message--success': success,
			}">
			<Check v-if="success" class="input-field__helper-text-message__icon" :size="18" />
			<AlertCircle v-else-if="error" class="input-field__helper-text-message__icon" :size="18" />
			{{ helperText }}
		</p>
	</div>
</template>

<script>
import NcButton from '../NcButton/index.js'
import GenRandomId from '../../utils/GenRandomId.js'

import AlertCircle from 'vue-material-design-icons/AlertCircleOutline.vue'
import Check from 'vue-material-design-icons/Check.vue'

export default {
	name: 'NcInputField',

	components: {
		NcButton,
		AlertCircle,
		Check,
	},

	inheritAttrs: false,

	props: {
		/**
		 * The value of the input field
		 */
		value: {
			type: String,
			required: true,
		},

		/**
		 * The type of the input element
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
				'search',
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
		 * We normally have the label hidden visually and use it for
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
		 * Label of the trailing button
		 *
		 * Required when showTrailingButton is set
		 */
		trailingButtonLabel: {
			type: String,
			default: '',
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

		/**
		 * Additional helper text message
		 *
		 * This will be displayed beneath the input field. In case the field is
		 * also marked as having an error, the text will be displayed in red.
		 */
		helperText: {
			type: String,
			default: '',
		},

		/**
		 * Disable the input field
		 */
		disabled: {
			type: Boolean,
			default: false,
		},
	},

	emits: [
		'update:value',
		'trailing-button-click',
	],

	computed: {
		computedId() {
			return this.$attrs.id && this.$attrs.id !== '' ? this.$attrs.id : this.inputName
		},

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

		validateLabel() {
			if (this.label && !this.labelOutside) {
				throw new Error('You need to add a label to the textField component. Either use the prop label or use an external one, as per the example in the documentation')
			}
		},
	},
}
</script>

<style lang="scss" scoped>

.input-field {
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
		border: 2px solid var(--color-border-maxcontrast);
		height: 36px !important;
		border-radius: var(--border-radius-large);
		text-overflow: ellipsis;
		cursor: pointer;
		width: 100%;
		-webkit-appearance: textfield !important;
		-moz-appearance: textfield !important;

		&:active:not([disabled]),
		&:hover:not([disabled]),
		&:focus:not([disabled]) {
			border-color: var(--color-primary-element);
		}

		&:focus {
			cursor: text;
		}

		&:focus-visible {
			box-shadow: unset !important; // Override server rules
		}

		&--success {
			border-color: var(--color-success) !important; //Override hover border color
			&:focus-visible {
				box-shadow: rgb(248, 250, 252) 0px 0px 0px 2px, var(--color-primary-element) 0px 0px 0px 4px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px
			}
		}

		&--error {
			border-color: var(--color-error) !important; //Override hover border color
			&:focus-visible {
				box-shadow: rgb(248, 250, 252) 0px 0px 0px 2px, var(--color-primary-element) 0px 0px 0px 4px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px
			}
		}

		&--leading-icon {
			padding-left: 28px;
		}

		&--trailing-icon {
			padding-right: 28px;
		}
	}

	&__label {
		padding: 4px 0;
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

	&__clear-button.button-vue {
		position: absolute;
		top: 2px;
		right: 1px;
		min-width: unset;
		min-height: unset;
		height: 32px;
		width: 32px !important;
		border-radius: var(--border-radius-large);
	}

	&__helper-text-message {
		padding: 4px 0;
		display: flex;
		align-items: center;

		&__icon {
			margin-right: 8px;
			align-self: start;
			margin-top: 4px;
		}

		&--error {
			color: var(--color-error);
		}

		&--success {
			color: var(--color-success);
		}
	}
}

</style>
