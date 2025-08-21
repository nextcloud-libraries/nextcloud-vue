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
		<NcTextArea v-model="text"
			label="Text area"
			placeholder="Placeholders are possible"
			helper-text="This is a regular helper text." />
		<NcTextArea label="Success state"
			:success="true" />
		<NcTextArea label="Error state"
			placeholder="Enter something valid"
			helper-text="Helper texts will be styled accordingly."
			:error="true" />
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
	</div>
</template>

<script>
export default {
	data() {
		return {
			text: 'This is text.',
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

<script setup lang="ts">
import type { VueClassType } from '../../utils/VueTypes.ts'

import { mdiAlertCircle, mdiCheck } from '@mdi/js'
import { computed, useAttrs, useTemplateRef, watch } from 'vue'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'
import { createElementId } from '../../utils/createElementId.ts'
import { isLegacy } from '../../utils/legacy.ts'
import logger from '../../utils/logger.ts'

defineOptions({ inheritAttrs: false })

/**
 * The value of the text area
 */
const modelValue = defineModel<string>({ required: true })

const props = withDefaults(defineProps<{
	/**
	 * Disable the text area
	 */
	disabled?: boolean

	/**
	 * Toggles the error state of the component.
	 * Adds an error icon.
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
	 * The id of the textarea element
	 */
	id?: string

	/**
	 * Class to add to the `<textarea>` element.
	 */
	inputClass?: VueClassType

	/**
	 * The input label, always provide one for accessibility purposes.
	 * On Nextcloud before version 32 this will also be used as a placeholder
	 * unless the placeholder prop is populated with a different string.
	 */
	label?: string

	/**
	 * Pass in true if you want to use an external label. This is useful
	 * if you need a label that looks different from the one provided by
	 * this component
	 */
	labelOutside?: boolean

	/**
	 * The placeholder of the input.
	 * On Nextcloud before 32 this defaults to the value of the `label` prop.
	 */
	placeholder?: string

	/**
	 * The resize CSS property sets whether an element is resizable, and if
	 * so, in which directions.
	 */
	resize?: 'both' | 'vertical' | 'horizontal' | 'none'

	/**
	 * Toggles the success state of the component.
	 * Adds a checkmark icon.
	 */
	success?: boolean
}>(), {
	helperText: undefined,
	id: () => createElementId(),
	inputClass: '',
	label: undefined,
	placeholder: undefined,
	resize: 'both',
})

defineExpose({
	focus,
	select,
})

/**
 * The native text area component instance
 */
const textAreaElement = useTemplateRef('input')

// needs to be a getter as attrs are not reactive
const attrs = useAttrs()

const internalPlaceholder = computed(() => props.placeholder || (isLegacy ? props.label : undefined))

// warn about invalid labels (missing label and no label outside)
watch(() => props.labelOutside, () => {
	if (!props.labelOutside && !props.label) {
		logger.warn('[NcTextArea] You need to add a label to the NcInputField component. Either use the prop label or use an external one, as per the example in the documentation.')
	}
})

const ariaDescribedby = computed(() => {
	const ariaDescribedby: string[] = []
	if (props.helperText) {
		ariaDescribedby.push(`${props.id}-helper-text`)
	}
	if (typeof attrs['aria-describedby'] === 'string') {
		ariaDescribedby.push(attrs['aria-describedby'])
	}
	return ariaDescribedby.join(' ') || undefined
})

/**
 * Update the model value to the text area value.
 *
 * @param event - The input event
 */
function handleInput(event: Event) {
	const { value } = event.target as HTMLTextAreaElement
	modelValue.value = value
}

/**
 * Focus the input element
 *
 * @param options - Focus options
 * @public
 */
function focus(options?: FocusOptions) {
	textAreaElement.value!.focus(options)
}

/**
 * Select all the text in the input
 *
 * @public
 */
function select() {
	textAreaElement.value!.select()
}
</script>

<template>
	<div class="textarea"
		:class="[
			$attrs.class,
			{
				'textarea--disabled': disabled,
				'textarea--legacy': isLegacy,
			},
		]">
		<div class="textarea__main-wrapper">
			<textarea
				v-bind="{ ...$attrs, class: undefined }"
				:id
				ref="input"
				:aria-describedby
				aria-live="polite"
				class="textarea__input"
				:class="[
					inputClass,
					{
						'textarea__input--label-outside': labelOutside,
						'textarea__input--legacy': isLegacy,
						'textarea__input--success': success,
						'textarea__input--error': error,
					},
				]"
				:disabled
				:placeholder="internalPlaceholder"
				:style="{ resize }"
				:value="modelValue"
				@input="handleInput" />
			<!-- Label -->
			<label
				v-if="!labelOutside"
				class="textarea__label"
				:for="id">
				{{ label }}
			</label>
		</div>
		<p
			v-if="helperText"
			:id="`${id}-helper-text`"
			class="textarea__helper-text-message"
			:class="{
				'textarea__helper-text-message--error': error,
				'textarea__helper-text-message--success': success,
			}">
			<NcIconSvgWrapper v-if="success" class="textarea__helper-text-message__icon" :path="mdiCheck" />
			<NcIconSvgWrapper v-else-if="error" class="textarea__helper-text-message__icon" :path="mdiAlertCircle" />
			{{ helperText }}
		</p>
	</div>
</template>

<style lang="scss" scoped>
.textarea {
	--input-border-color: var(--color-border-maxcontrast);
	--input-border-width-offset: calc(var(--border-width-input-focused, 2px) - var(--border-width-input, 2px));
	position: relative;
	width: 100%;
	border-radius: var(--border-radius-element);
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
		border-radius: var(--border-radius-element);
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
