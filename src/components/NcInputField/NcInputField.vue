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

<script setup lang="ts">
import type { Slot } from 'vue'
import type { VueClassType } from '../../utils/VueTypes.ts'

import { mdiAlertCircle, mdiCheck } from '@mdi/js'
import { computed, useAttrs, useTemplateRef, warn } from 'vue'
import NcButton from '../NcButton/index.ts'
import NcIconSvgWrapper from '../NcIconSvgWrapper/index.ts'
import { createElementId } from '../../utils/createElementId.ts'

export interface NcInputFieldProps {
	/**
	 * Class to add to the root component.
	 */
	class?: VueClassType

	/**
	 * Class to add to the input field.
	 * Necessary to use NcInputField in the NcActionInput component.
	 */
	inputClass?: VueClassType

	/**
	 * HTML id of the input field
	 */
	id?: string

	/**
	 * The input label, always provide one for accessibility purposes.
	 * This will also be used as a placeholder unless the placeholder
	 * prop is populated with a different string.
	 *
	 * Note: If the background color is not `--color-main-background` consider using an external label instead (see `labelOutside`).
	 */
	label?: string

	/**
	 * Pass in true if you want to use an external label. This is useful
	 * if you need a label that looks different from the one provided by
	 * this component
	 */
	labelOutside?: boolean

	/**
	 * The type of the input element
	 */
	type?: 'text' | 'password' | 'email' | 'tel' | 'url' | 'search' | 'number'

	/**
	 * The placeholder of the input. This defaults as the string that's
	 * passed into the label prop. In order to remove the placeholder,
	 * pass in an empty string.
	 */
	placeholder?: string

	/**
	 * Controls whether to display the trailing button.
	 */
	showTrailingButton?: boolean

	/**
	 * Label of the trailing button
	 *
	 * Required when showTrailingButton is set
	 */
	trailingButtonLabel?: string

	/**
	 * Toggles the success state of the component. Adds a checkmark icon.
	 */
	success?: boolean

	/**
	 * Toggles the error state of the component. Adds an error icon.
	 */
	error?: boolean

	/**
	 * Additional helper text message
	 *
	 * This will be displayed beneath the input field. In case the field is
	 * also marked as having an error, the text will be displayed in red.
	 */
	helperText?: string

	/**
	 * Disable the input field
	 */
	disabled?: boolean

	/**
	 * Specifies whether the input should have a pill form.
	 * By default, input has rounded corners.
	 */
	pill?: boolean
}

const props = withDefaults(defineProps<NcInputFieldProps>(), {
	class: '',
	helperText: '',
	id: () => createElementId(),
	inputClass: '',
	label: undefined,
	placeholder: undefined,
	trailingButtonLabel: undefined,
	type: 'text',
})

/**
 * The value of the input field
 * If type is 'number' and a number is passed as value than the type of `update:value` will also be 'number'
 */
const modelValue = defineModel<string|number>({ required: true })

const emit = defineEmits<{
	'trailing-button-click': [event: MouseEvent]
}>()

defineOptions({
	inheritAttrs: false,
})

// public API
defineExpose({
	focus,
	select,
})

defineSlots<{
	/**
	 * Leading icon, set the size to 20.
	 */
	icon?: Slot

	/**
	 * Icon for the trailing button.
	 */
	'trailing-button-icon'?: Slot
}>()

const attrs = useAttrs()

const input = useTemplateRef('input')

const hasTrailingIcon = computed(() => props.showTrailingButton || props.success)

const isValidLabel = computed(() => {
	const isValidLabel = props.label || props.labelOutside
	if (!isValidLabel) {
		warn('You need to add a label to the NcInputField component. Either use the prop label or use an external one, as per the example in the documentation.')
	}
	return isValidLabel
})

const ariaDescribedby = computed(() => {
	const ariaDescribedby: string[] = []
	if (props.helperText) {
		ariaDescribedby.push(`${props.id}-helper-text`)
	}
	if (attrs['aria-describedby']) {
		ariaDescribedby.push(String(attrs['aria-describedby']))
	}
	return ariaDescribedby.join(' ') || undefined
})

/**
 * Focus the input element
 *
 * @param options - Focus options
 * @public
 */
function focus(options?: FocusOptions) {
	input.value!.focus(options)
}

/**
 * Select all the text in the input
 *
 * @public
 */
function select() {
	input.value!.select()
}

/**
 * Handle the input event of the HTML input.
 * Parses numbers in case of numeric type.
 *
 * @param event - The input event
 */
function handleInput(event: Event) {
	const target = event.target as HTMLInputElement
	modelValue.value = props.type === 'number' && typeof modelValue.value === 'number'
		? parseFloat(target.value)
		: target.value
}
</script>

<template>
	<div class="input-field"
		:class="[{
			'input-field--disabled': disabled,
			'input-field--error': error,
			'input-field--label-outside': labelOutside || !isValidLabel,
			'input-field--leading-icon': !!$slots.icon,
			'input-field--trailing-icon': hasTrailingIcon,
			'input-field--pill': pill,
			'input-field--success': success,
		}, $props.class]">
		<div class="input-field__main-wrapper">
			<input v-bind="$attrs"
				:id
				ref="input"
				:aria-describedby="ariaDescribedby"
				aria-live="polite"
				class="input-field__input"
				:class="inputClass"
				:disabled
				:placeholder="placeholder || label"
				:type
				:value="modelValue.toString()"
				@input="handleInput">
			<!-- Label -->
			<label v-if="!labelOutside && isValidLabel"
				class="input-field__label"
				:for="id">
				{{ label }}
			</label>

			<!-- Leading icon -->
			<div v-show="!!$slots.icon" class="input-field__icon input-field__icon--leading">
				<slot name="icon" />
			</div>

			<!-- trailing button -->
			<NcButton v-if="showTrailingButton"
				class="input-field__trailing-button"
				:aria-label="trailingButtonLabel"
				:disabled="disabled"
				variant="tertiary-no-background"
				@click="emit('trailing-button-click', $event)">
				<template #icon>
					<slot name="trailing-button-icon" />
				</template>
			</NcButton>

			<!-- Success and error icons -->
			<div v-else-if="success || error"
				class="input-field__icon input-field__icon--trailing">
				<NcIconSvgWrapper v-if="success" :path="mdiCheck" />
				<NcIconSvgWrapper v-else :path="mdiAlertCircle" />
			</div>
		</div>
		<p v-if="helperText"
			:id="`${id}-helper-text`"
			class="input-field__helper-text-message">
			<NcIconSvgWrapper v-if="success" class="input-field__helper-text-message__icon" :path="mdiCheck" />
			<NcIconSvgWrapper v-else-if="error" class="input-field__helper-text-message__icon" :path="mdiAlertCircle" />
			{{ helperText }}
		</p>
	</div>
</template>

<style lang="scss" scoped>

.input-field {
	--input-border-radius: var(--border-radius-element);
	// The padding before the input can start (leading button or border)
	--input-padding-start: var(--border-radius-element);
	// The padding where the input has to end (trailing button or border)
	--input-padding-end: var(--border-radius-element);
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

		// prevent Blink and WebKit to add an additional button when type is set to search
		// we have our properly styled trailing button anyways.
		&::-webkit-search-cancel-button {
			// its a weird bug in Blink that this rule must not be grouped with the other selectors below.
			// otherwise it is not recognized by Blink
			display: none;
		}
		&::-webkit-search-decoration,
		&::-webkit-search-results-button,
		&::-webkit-search-results-decoration,
		&::-ms-clear {
			display: none;
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
	}

	// Hide placeholder while not focussed -> show label instead (only if internal label is used)
	&:not(&--label-outside) &__input:not(:focus)::placeholder {
		opacity: 0;
	}

	&__label {
		--input-label-font-size: var(--default-font-size);
		font-size: var(--input-label-font-size);

		position: absolute;
		margin-inline: var(--input-padding-start) var(--input-padding-end);
		max-width: fit-content;
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
		padding-inline: var(--border-radius-element);
		display: flex;
		align-items: center;
		color: var(--color-text-maxcontrast);

		&__icon {
			margin-inline-end: 8px;
		}
	}

	&--error {
		.input-field__helper-text-message,
		.input-field__icon--trailing {
			color: var(--color-error);
		}
	}

	&--error .input-field__input,
	&__input:user-invalid {
		border-color: var(--color-error) !important; //Override hover border color
		&:focus-visible {
			box-shadow: rgb(248, 250, 252) 0px 0px 0px 2px, var(--color-primary-element) 0px 0px 0px 4px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px
		}
	}

	&--success {
		.input-field__input {
			border-color: var(--color-success) !important; //Override hover border color
			&:focus-visible {
				box-shadow: rgb(248, 250, 252) 0px 0px 0px 2px, var(--color-primary-element) 0px 0px 0px 4px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px
			}
		}

		.input-field__helper-text-message,
		.input-field__icon--trailing {
			color: var(--color-success);
		}
	}
}
</style>
