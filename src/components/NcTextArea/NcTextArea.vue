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
			v-model="text1"
			placeholder="Placeholders are possible"
			helper-text="This is a regular helper text." >
		</NcTextArea>
		<NcTextArea label="Success state"
			v-model="text2"
			:success="true">
		</NcTextArea>
		<NcTextArea label="Error state"
			v-model="text3"
			placeholder="Enter something valid"
			helper-text="Helper texts will be styled accordingly."
			:error="true">
		</NcTextArea>
		<NcTextArea label="Disabled"
			v-model="text4"
			:disabled="true" />
		<NcTextArea label="Disabled + Success"
			v-model="text5"
			:success="true"
			:disabled="true" />
		<div class="external-label">
			<label for="textField">External label</label>
			<NcTextArea id="textField"
				v-model="text6"
				:label-outside="true"
				placeholder="Text area with external label" />
		</div>
		<NcTextArea label="Custom size and no resize"
			v-model="text7"
			resize="none"
			rows="5" />
		</NcTextArea>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				text1: '',
				text2: '',
				text3: '',
				text4: '',
				text5: '',
				text6: '',
				text7: '',
			}
		},
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
	<div
		class="textarea"
		:class="{
			'textarea--disabled': disabled,
			'textarea--legacy': isLegacy32,
		}">
		<div class="textarea__main-wrapper">
			<textarea
				v-bind="$attrs"
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
						'textarea__input--legacy': isLegacy,
						'textarea__input--success': success,
						'textarea__input--error': error,
					}]"
				:style="{ resize: resize }"
				:value="model"
				v-on="$listeners"
				@input="handleInput" />
			<!-- Label -->
			<label
				v-if="!labelOutside && isValidLabel"
				class="textarea__label"
				:for="computedId">
				{{ label }}
			</label>
		</div>
		<p
			v-if="helperText.length > 0"
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
import AlertCircle from 'vue-material-design-icons/AlertCircleOutline.vue'
import Check from 'vue-material-design-icons/Check.vue'
import { useModelMigration } from '../../composables/useModelMigration.ts'
import GenRandomId from '../../utils/GenRandomId.js'
import { isLegacy32 } from '../../utils/legacy.ts'

export default {
	name: 'NcTextArea',

	components: {
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
		 *
		 * @deprecated
		 */
		value: {
			type: String,
			default: undefined,
		},

		/**
		 * The value of the input field
		 */
		modelValue: {
			type: String,
			default: undefined,
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
		/**
		 * Removed in v9 - use `update:modelValue` (`v-model`) instead
		 *
		 * @deprecated
		 */
		'update:value',
		'update:modelValue',
		/** Same as update:modelValue for Vue 2 compatibility */
		'update:model-value',
	],

	setup() {
		const model = useModelMigration('value', 'update:value', true)
		return {
			isLegacy32,
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

		hasPlaceholder() {
			return this.placeholder !== '' && this.placeholder !== undefined
		},

		computedPlaceholder() {
			if (this.hasPlaceholder) {
				return this.placeholder
			}
			if (isLegacy32) {
				return this.label
			}
			return undefined
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
			this.model = event.target.value
		},
	},
}
</script>

<style lang="scss" scoped>
.textarea {
	--input-border-color: var(--color-border-maxcontrast);
	--input-border-width-offset: calc(var(--border-width-input-focused, 2px) - var(--border-width-input, 2px));
	position: relative;
	width: 100%;
	border-radius: var(--border-radius-large);
	margin-block-start: 6px; // for the label in active state
	resize: vertical;

	&--disabled {
		opacity: 0.7;
		filter: saturate(0.7);
	}

	&__main-wrapper {
		height: calc(var(--default-clickable-area) * 2);
		padding: var(--border-width-input, 2px);
		position: relative;

		&:not(:has([disabled])):has(textarea:focus),
		&:not(:has([disabled])):has(textarea:active) {
			padding: 0;
		}
	}

	&__input {
		margin: 0;
		padding-block: calc(10px + var(--input-border-width-offset));
		padding-inline: calc(12px - var(--border-width-input, 2px) + var(--input-border-width-offset)); // align with label 8px margin label + 4px padding label - 2px border input
		width: 100%;
		font-size: var(--default-font-size);
		text-overflow: ellipsis;
		cursor: pointer;

		background-color: var(--color-main-background);
		color: var(--color-main-text);
		// we use box shadow to create a border as this allows use to have a nice gradient
		border: none;
		border-radius: var(--border-radius-element, var(--border-radius-large));
		box-shadow:
			0 -1px var(--input-border-color),
			0 0 0 1px color-mix(in srgb, var(--input-border-color), 65% transparent);

		&:hover:not([disabled]) {
			box-shadow: 0 0 0 1px var(--input-border-color);
		}
		&:active:not([disabled]),
		&:focus:not([disabled]) {
			--input-border-width-offset: 0px;
			--input-border-color: var(--color-main-text);
			border: var(--border-width-input-focused, 2px) solid var(--input-border-color);
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
			--input-border-color: var(--color-border-success, var(--color-success)) !important; //Override hover border color
			&:focus-visible {
				box-shadow: rgb(248, 250, 252) 0px 0px 0px 2px, var(--color-primary-element) 0px 0px 0px 4px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px
			}
		}

		&--error {
			--input-border-color: var(--color-border-error, var(--color-error)) !important; //Override hover border color
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

	// for Nextcloud 31 and older we need the old design with only one color
	&--legacy {
		.textarea__input {
			box-shadow: 0 0 0 1px var(--input-border-color);
		}

		.textarea__main-wrapper:hover:not(:has([disabled])) {
			padding: 0;

			.textarea__input {
				--input-border-color: var(--color-main-text);
				// Reset padding offset when focused
				--input-border-width-offset: 0px;
				border: var(--border-width-input-focused, 2px) solid var(--input-border-color);
				box-shadow: 0 0 0 2px var(--color-main-background) !important;
			}
		}
	}
}
</style>
