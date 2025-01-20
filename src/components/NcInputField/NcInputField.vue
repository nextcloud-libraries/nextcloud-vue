<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
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
	<div class="input-field"
		:class="{
			'input-field--disabled': disabled,
			'input-field--label-outside': labelOutside || !isValidLabel,
			'input-field--leading-icon': !!$scopedSlots.icon || !!$scopedSlots.default || !!$slots.default,
			'input-field--trailing-icon': showTrailingButton || hasTrailingIcon,
			'input-field--pill': pill,
		}">
		<div class="input-field__main-wrapper">
			<input v-bind="$attrs"
				:id="computedId"
				ref="input"
				class="input-field__input"
				:type="type"
				:disabled="disabled"
				:placeholder="computedPlaceholder"
				:aria-describedby="ariaDescribedby"
				aria-live="polite"
				:class="[inputClass,
					{
						'input-field__input--success': success,
						'input-field__input--error': error,
					}]"
				:value="model?.toString()"
				v-on="$listeners"
				@input="handleInput">
			<!-- Label -->
			<label v-if="!labelOutside && isValidLabel"
				class="input-field__label"
				:for="computedId">
				{{ label }}
			</label>

			<!-- Leading icon -->
			<div v-show="!!$scopedSlots.icon || !!$scopedSlots.default || !!$slots.default" class="input-field__icon input-field__icon--leading">
				<!-- @slot Leading icon, set the size to 18 -->
				<slot name="icon">
					<!-- @slot Deprecated, removed in v9: use #icon slot instead. -->
					<slot />
				</slot>
			</div>

			<!-- trailing button -->
			<NcButton v-if="showTrailingButton"
				type="tertiary-no-background"
				class="input-field__trailing-button"
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
				<Check v-if="success" :size="20" style="color: var(--color-success-text);" />
				<AlertCircle v-else-if="error" :size="20" style="color: var(--color-error-text);" />
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
import { useModelMigration } from '../../composables/useModelMigration.ts'

export default {
	name: 'NcInputField',

	components: {
		NcButton,
		AlertCircle,
		Check,
	},

	inheritAttrs: false,

	model: {
		prop: 'modelValue',
		event: 'update:modelValue',
	},

	props: {
		/**
		 * Removed in v9 - use `modelValue` (`v-model`) instead
		 * @deprecated
		 */
		value: {
			type: [String, Number],
			default: undefined,
		},

		/**
		 * The value of the input field
		 * If type is 'number' and a number is passed as value than the type of `update:modelValue` will also be 'number'
		 */
		modelValue: {
			type: [String, Number],
			default: undefined,
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
				'number',
			].includes(value),
		},

		/**
		 * The input label, always provide one for accessibility purposes.
		 * This will also be used as a placeholder unless the placeholder
		 * prop is populated with a different string.
		 *
		 * Note: If the background color is not `--color-main-background` consider using an external label instead (see `labelOutside`).
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

		/**
		 * Specifies whether the input should have a pill form.
		 * By default, input has rounded corners.
		 */
		pill: {
			type: Boolean,
			default: false,
		},

		/**
		 * Class to add to the input field.
		 * Necessary to use NcInputField in the NcActionInput component.
		 */
		inputClass: {
			type: [Object, String],
			default: '',
		},
	},

	emits: [
		/**
		 * Removed in v9 - use `update:modelValue` (`v-model`) instead
		 * @deprecated
		 */
		'update:value',
		'update:modelValue',
		/** Same as update:modelValue for Vue 2 compatibility */
		'update:model-value',
		'trailing-button-click',
	],

	setup() {
		const model = useModelMigration('value', 'update:value', true)
		return {
			model,
		}
	},

	computed: {
		computedId() {
			return this.$attrs.id && this.$attrs.id !== '' ? this.$attrs.id : this.inputName
		},

		inputName() {
			return 'input' + GenRandomId()
		},

		hasTrailingIcon() {
			return this.success
		},

		hasPlaceholder() {
			return this.placeholder !== '' && this.placeholder !== undefined
		},

		computedPlaceholder() {
			return this.hasPlaceholder ? this.placeholder : this.label
		},

		isValidLabel() {
			const isValidLabel = this.label || this.labelOutside
			if (!isValidLabel) {
				console.warn('You need to add a label to the NcInputField component. Either use the prop label or use an external one, as per the example in the documentation.')
			}
			return isValidLabel
		},

		ariaDescribedby() {
			const ariaDescribedby = []
			if (this.helperText.length > 0) {
				ariaDescribedby.push(`${this.inputName}-helper-text`)
			}
			if (this.$attrs['aria-describedby']) {
				ariaDescribedby.push(this.$attrs['aria-describedby'])
			}
			return ariaDescribedby.join(' ') || null
		},
	},

	methods: {
		/**
		 * Focus the input element
		 *
		 * @public
		 */
		focus() {
			this.$refs.input.focus()
		},

		/**
		 * Select all the text in the input
		 *
		 * @public
		 */
		select() {
			this.$refs.input.select()
		},

		handleInput(event) {
			const newValue = this.type === 'number' && typeof this.model === 'number' ? parseFloat(event.target.value, 10) : event.target.value
			this.model = newValue
		},

		handleTrailingButtonClick(event) {
			this.$emit('trailing-button-click', event)
		},
	},
}
</script>

<style lang="scss" scoped>

.input-field {
	--input-border-radius: var(--border-radius-element, var(--border-radius-large));
	// The padding before the input can start (leading button or border)
	--input-padding-start: var(--border-radius-large);
	// The padding where the input has to end (trailing button or border)
	--input-padding-end: var(--border-radius-large);
	// positional styles
	position: relative;
	width: 100%;
	margin-block-start: 6px; // for the label in active state

	&--disabled {
		opacity: 0.4;
		filter: saturate(0.4);
	}

	// If there is no internal label we reset the margin reserved for it
	&--label-outside {
		margin-block-start: 0;
	}

	&--leading-icon {
		--input-padding-start: calc(var(--default-clickable-area) - var(--default-grid-baseline));
	}

	&--trailing-icon {
		--input-padding-end: calc(var(--default-clickable-area) - var(--default-grid-baseline));
	}

	&--pill {
		--input-border-radius: var(--border-radius-pill);
	}

	&__main-wrapper {
		height: var(--default-clickable-area);
		position: relative;
	}

	&__input {
		// If border width differes between focused and unfocused we need to compensate to prevent jumping
		--input-border-width-offset: calc(var(--border-width-input-focused, 2px) - var(--border-width-input, 2px));
		background-color: var(--color-main-background);
		color: var(--color-main-text);
		border: var(--border-width-input, 2px) solid var(--color-border-maxcontrast);
		border-radius: var(--input-border-radius);

		cursor: pointer;
		-webkit-appearance: textfield !important;
		-moz-appearance: textfield !important;
		appearance: textfield !important;

		font-size: var(--default-font-size);
		text-overflow: ellipsis;

		height: calc(var(--default-clickable-area) - 2 * var(--input-border-width-offset)) !important;
		width: 100%;

		padding-inline: calc(var(--input-padding-start) + var(--input-border-width-offset)) calc(var(--input-padding-end) + var(--input-border-width-offset));
		padding-block: var(--input-border-width-offset);

		&::placeholder {
			color: var(--color-text-maxcontrast);
		}

		&:active:not([disabled]),
		&:hover:not([disabled]),
		&:focus:not([disabled]) {
			border-color: var(--color-main-text);
			border-width: var(--border-width-input-focused, 2px);
			box-shadow: 0 0 0 2px var(--color-main-background) !important;
			// Reset padding offset when focused
			--input-border-width-offset: 0px;
		}

		&:focus + .input-field__label,
		&:hover:not(:placeholder-shown) + .input-field__label {
			color: var(--color-main-text);
		}

		&:focus {
			cursor: text;
		}

		&:disabled {
			cursor: default;
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

		&--error,
		&:invalid {
			border-color: var(--color-error) !important; //Override hover border color
			&:focus-visible {
				box-shadow: rgb(248, 250, 252) 0px 0px 0px 2px, var(--color-primary-element) 0px 0px 0px 4px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px
			}
		}
	}

	// Hide placeholder while not focussed -> show label instead (only if internal label is used)
	&:not(&--label-outside) &__input:not(:focus)::placeholder {
		opacity: 0;
	}

	&__label {
		--input-label-font-size: var(--default-font-size);
		position: absolute;
		margin-inline: var(--input-padding-start) var(--input-padding-end);
		max-width: fit-content;
		font-size: var(--input-label-font-size);
		inset-block-start: calc((var(--default-clickable-area) - 1lh) / 2); // center the label vertically
		inset-inline: var(--border-width-input-focused, 2px);
		// Fix color so that users do not think the input already has content
		color: var(--color-text-maxcontrast);
		// only one line labels are allowed
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		// forward events to input
		pointer-events: none;
		// Position transition
		transition: height var(--animation-quick), inset-block-start var(--animation-quick), font-size var(--animation-quick), color var(--animation-quick), background-color var(--animation-quick) var(--animation-slow);
	}

	&__input:focus + &__label,
	&__input:not(:placeholder-shown) + &__label {
		--input-label-font-size: 13px; // minimum allowed font size for accessibility
		line-height: 1.5; // minimum allowed line height for accessibility
		// 1.5 * font-size = line-height; line-height / 2 for centering and make it negative as we need to move outside the element
		inset-block-start: calc(-1.5 * var(--input-label-font-size) / 2);
		font-weight: 500;
		border-radius: var(--default-grid-baseline) var(--default-grid-baseline) 0 0;
		background-color: var(--color-main-background);
		padding-inline: var(--default-grid-baseline);
		margin-inline: calc(var(--input-padding-start) - var(--default-grid-baseline)) calc(var(--input-padding-end) - var(--default-grid-baseline));

		transition: height var(--animation-quick), inset-block-start var(--animation-quick), font-size var(--animation-quick), color var(--animation-quick);
	}

	&__icon {
		position: absolute;
		height: var(--default-clickable-area);
		width: var(--default-clickable-area);
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0.7;

		inset-block-end: 0;

		&--leading {
			inset-inline-start: 0px;
		}

		&--trailing {
			inset-inline-end: 0px;
		}
	}

	&__trailing-button {
		--button-size: calc(var(--default-clickable-area) - 2 * var(--border-width-input-focused, 2px)) !important;
		--button-radius: calc(var(--input-border-radius) - var(--border-width-input-focused, 2px)); // lower radius as size is smaller

		&.button-vue {
			position: absolute;
			top: var(--border-width-input-focused, 2px);
			inset-inline-end: var(--border-width-input-focused, 2px);

			&:focus-visible {
				box-shadow: none !important;
			}
		}
	}

	&__helper-text-message {
		padding-block: 4px;
		padding-inline: var(--border-radius-large);
		display: flex;
		align-items: center;
		color: var(--color-text-maxcontrast);

		&__icon {
			margin-inline-end: 8px;
		}

		&--error {
			color: var(--color-error-text);
		}

		&--success {
			color: var(--color-success-text);
		}
	}
}
</style>
