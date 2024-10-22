<!--
  - SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### Description

This component is a textarea field.
It extends and styles an HTMLTextAreaElement.

```
<template>
	<div class="wrapper">
		<NcTextArea label="Text area"
			placeholder="Placeholders are possible"
			helper-text="This is a regular helper text." >
		</NcTextArea>
		<NcTextArea label="Success state"
			:success="true">
		</NcTextArea>
		<NcTextArea label="Error state"
			placeholder="Enter something valid"
			helper-text="Helper texts will be styled accordingly."
			:error="true">
		</NcTextArea>
		<NcTextArea label="Disabled"
			:disabled="true" />
		<NcTextArea label="Disabled + Success"
			:success="true"
			:disabled="true" />
		<div class="external-label">
			<label for="textField">External label</label>
			<NcTextArea id="textField"
				:label-outside="true"
				placeholder="Text area with external label" />
		</div>
		<NcTextArea label="Custom size and no resize"
			resize="none"
			rows="5" />
		</NcTextArea>
	</div>
</template>

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
	align-items: center;
	gap: 14px;

	> label {
		flex-shrink: 0;
	}
}
</style>
```
</docs>

<template>
	<div class="textarea" :class="{ 'textarea--disabled': disabled }">
		<div class="textarea__main-wrapper">
			<textarea v-bind="$attrs"
				:id="computedId"
				ref="input"
				class="textarea__input"
				:disabled="disabled"
				:placeholder="computedPlaceholder"
				:aria-describedby="ariaDescribedby"
				aria-live="polite"
				:class="[inputClass,
					{
						'textarea__input--label-outside': labelOutside,
						'textarea__input--success': success,
						'textarea__input--error': error,
					}]"
				:style="{ resize: resize }"
				:value="value"
				v-on="$listeners"
				@input="handleInput" />
			<!-- Label -->
			<label v-if="!labelOutside && isValidLabel"
				class="textarea__label"
				:for="computedId">
				{{ label }}
			</label>
		</div>
		<p v-if="helperText.length > 0"
			:id="`${inputName}-helper-text`"
			class="textarea__helper-text-message"
			:class="{
				'textarea__helper-text-message--error': error,
				'textarea__helper-text-message--success': success,
			}">
			<Check v-if="success" class="textarea__helper-text-message__icon" :size="18" />
			<AlertCircle v-else-if="error" class="textarea__helper-text-message__icon" :size="18" />
			{{ helperText }}
		</p>
	</div>
</template>

<script>
import GenRandomId from '../../utils/GenRandomId.js'

import AlertCircle from 'vue-material-design-icons/AlertCircleOutline.vue'
import Check from 'vue-material-design-icons/Check.vue'

export default {
	name: 'NcTextArea',

	components: {
		AlertCircle,
		Check,
	},

	inheritAttrs: false,

	model: {
		prop: 'value',
		event: 'update:value',
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
		 * The input label, always provide one for accessibility purposes.
		 * This will also be used as a placeholder unless the placeholder
		 * prop is populated with a different string.
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
		 * Class to add to the input field.
		 * Necessary to use NcInputField in the NcActionInput component.
		 */
		inputClass: {
			type: [Object, String],
			default: '',
		},

		/**
		 * The resize CSS property sets whether an element is resizable, and if
		 * so, in which directions.
		 */
		resize: {
			type: String,
			default: 'both',
			validator: (value) => ['both', 'vertical', 'horizontal', 'none'].includes(value),
		},
	},

	emits: [
		'update:value',
	],

	computed: {
		computedId() {
			return this.$attrs.id && this.$attrs.id !== '' ? this.$attrs.id : this.inputName
		},

		inputName() {
			return 'input' + GenRandomId()
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
			this.$emit('update:value', event.target.value)
		},
	},
}
</script>

<style lang="scss" scoped>

.textarea {
	position: relative;
	width: 100%;
	border-radius: var(--border-radius-large);
	margin-block-start: 6px; // for the label in active state
	resize: vertical;

	&__main-wrapper {
		position: relative;
	}

	&--disabled {
		opacity: 0.7;
		filter: saturate(0.7);
	}

	&__input {
		margin: 0;
		padding-inline: 10px 6px; // align with label 8px margin label + 4px padding label - 2px border input
		width: 100%;
		height: calc(var(--default-clickable-area) * 2);
		font-size: var(--default-font-size);
		text-overflow: ellipsis;

		background-color: var(--color-main-background);
		color: var(--color-main-text);
		border: var(--border-width-input, 2px) solid var(--color-border-maxcontrast);
		border-radius: var(--border-radius-large);

		cursor: pointer;

		&:active:not([disabled]),
		&:hover:not([disabled]),
		&:focus:not([disabled]) {
			border-width: var(--border-width-input-focused, 2px);
			border-color: var(--color-main-text);
			box-shadow: 0 0 0 2px var(--color-main-background) !important;
		}

		// Hide placeholder while not focussed -> show label instead (only if internal label is used)
		&:not(:focus,&--label-outside)::placeholder {
			opacity: 0;
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

		&--error {
			border-color: var(--color-error) !important; //Override hover border color
			&:focus-visible {
				box-shadow: rgb(248, 250, 252) 0px 0px 0px 2px, var(--color-primary-element) 0px 0px 0px 4px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px
			}
		}
	}

	&__label {
		position: absolute;
		margin-inline: 12px 0;
		max-width: fit-content;
		inset-block-start: 11px;
		inset-inline: 0;
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
		inset-block-start: -10px;
		line-height: 1.5; // minimum allowed line height for accessibility
		font-size: 13px; // minimum allowed font size for accessibility
		font-weight: 500;
		color: var(--color-main-text);
		background-color: var(--color-main-background);
		padding-inline: 4px;
		margin-inline-start: 8px;

		transition: height var(--animation-quick), inset-block-start var(--animation-quick), font-size var(--animation-quick), color var(--animation-quick);
	}

	&__helper-text-message {
		padding-block: 4px;
		display: flex;
		align-items: center;

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
