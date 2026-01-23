<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { Slot } from 'vue'

import { computed, onMounted } from 'vue'
import { createElementId } from '../../utils/createElementId.ts'
import { useNcFormBox } from '../NcFormBox/useNcFormBox.ts'
import { useInsideRadioGroup } from '../NcRadioGroup/useNcRadioGroup.ts'

const props = defineProps<{
	/**
	 * Non visible label for accessibility when no `label` is passed.
	 */
	ariaLabel?: string

	/**
	 * The visual label of the radio button
	 */
	label?: string

	/**
	 * The value that should be assigned to the `modelValue` of the `NcRadioGroup`.
	 */
	value: string

	/**
	 * Disabled state of the radio button
	 */
	disabled?: boolean
}>()

defineSlots<{
	/**
	 * Optional icon slot
	 */
	icon?: Slot
}>()

const labelId = createElementId()
const radioGroup = useInsideRadioGroup()
const { formBoxItemClass } = useNcFormBox()

onMounted(() => radioGroup!.value.register(true))

const isChecked = computed(() => radioGroup?.value.modelValue === props.value)

/**
 * Handle updating the current model value
 */
function onUpdate() {
	if (props.disabled) {
		return
	}
	radioGroup!.value.onUpdate(props.value)
}
</script>

<template>
	<div
		:class="[{
			[$style.radioGroupButton_active]: isChecked,
			[$style.radioGroupButton_disabled]: disabled,
		}, $style.radioGroupButton, formBoxItemClass]"
		@click="onUpdate">
		<div v-if="$slots.icon" :class="$style.radioGroupButton__icon">
			<slot name="icon" />
		</div>

		<div v-if="label" :id="labelId" :class="$style.radioGroupButton__label">
			{{ label }}
		</div>

		<input
			:aria-labelledby="label ? labelId : undefined"
			:aria-label="label ? undefined : ariaLabel"
			class="hidden-visually"
			:checked="isChecked"
			type="radio"
			:disabled="disabled"
			:value
			@input="onUpdate">
	</div>
</template>

<style module lang="scss">
.radioGroupButton {
	--radio-group-button--border-radius: var(--border-radius-small);
	--radio-group-button--border-width: 1px;
	--radio-group-button--color: var(--color-primary-element-light-text);
	--radio-group-button--background-color: var(--color-primary-element-light);
	--radio-group-button--background-color-hover: var(--color-primary-element-light-hover);
	--radio-group-button--padding: 1px;
	cursor: pointer;
	color: var(--radio-group-button--color);
	background-color: var(--radio-group-button--background-color);
	transition: var(--animation-quick) background-color;
	border: var(--radio-group-button--border-width) solid var(--radio-group-button--background-color-hover);
	border-bottom-width: 2px;
	border-radius: var(--radio-group-button--border-radius);
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	text-align: center;
	min-height: var(--default-clickable-area);
	// ensure that the content is centered because of uneven border
	padding-block: var(--radio-group-button--padding) 0;
	padding-inline: var(--radio-group-button--padding);

	* {
		cursor: pointer;
	}

	&:has(&__label) {
		padding-inline: calc(var(--radio-group-button--padding) + var(--border-radius-element));
	}

	&:has(&__icon) {
		padding-inline-start: var(--radio-group-button--padding);
	}

	&:hover {
		background-color: var(--radio-group-button--background-color-hover);
	}

	&:focus-within {
		--radio-group-button--border-width: 2px;
		--radio-group-button--padding: 0px;
		border: var(--radio-group-button--border-width) solid var(--color-main-text) !important;
		outline: calc(var(--default-grid-baseline) / 2) var(--color-main-background);
	}
}

.radioGroupButton_active {
	--radio-group-button--color: var(--color-primary-element-text);
	--radio-group-button--background-color: var(--color-primary-element);
	--radio-group-button--background-color-hover: var(--color-primary-element-hover);
}

.radioGroupButton__label {
	font-weight: bold;
}

.radioGroupButton_disabled {
	filter: saturate($opacity_normal);
	opacity: $opacity_disabled;

	// Reset the cursor
	cursor: default;
	* {
		cursor: default;
	}

	&:hover {
		background-color: var(--radio-group-button--background-color);
	}
}

.radioGroupButton__icon {
	--radio-group-button--icon-size: calc(var(--default-clickable-area) - 4px);
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	width: var(--radio-group-button--icon-size);

	// make sure the icon is a bit smaller to account for border
	* {
		--default-clickable-area: var(--radio-group-button--icon-size);
	}
}
</style>
