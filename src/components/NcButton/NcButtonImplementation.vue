<!--
  - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<component :is="isLink ? 'a' : 'button'"
		:aria-label="ariaLabel"
		:aria-pressed="hasPressedState ? String(pressed) : undefined"
		:class="[
			'button-vue',
			`button-vue--size-${size}`,
			{
				[`button-vue--vue-${realType}`]: realType,
				'button-vue--wide': wide,
				[`button-vue--${flexAlignment}`]: flexAlignment !== 'center',
				'button-vue--reverse': isReverseAligned,
				active: isActive,
			},
		]"
		:disabled="disabled"
		:type="isLink ? undefined : nativeType"
		:role="isLink ? 'button' : undefined"
		:href="href"
		:target="isLink ? target : undefined"
		:rel="isLink ? 'nofollow noreferrer noopener' : undefined"
		:download="(!to && href && download) ? download : undefined"
		v-bind="ncPopoverTriggerAttrs"
		@click="onClick">
		<span class="button-vue__wrapper">
			<span v-if="hasIcon()"
				:aria-hidden="noIconAriaHidden ? undefined : 'true'"
				class="button-vue__icon">
				<slot name="icon" />
			</span>
			<span v-if="hasText()" class="button-vue__text">
				<slot name="default">{{ text }}</slot>
			</span>
		</span>
	</component>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { NcButtonEmits } from './types'

import { computed, inject, useSlots, watch } from 'vue'
import { NcButtonProps } from './types'
import isSlotPopulated from '../../utils/isSlotPopulated'
import logger from '../../utils/logger'

const props = defineProps({
	// NcButton props
	...NcButtonProps,

	// router link props
	isActive: {
		type: Boolean,
		default: false,
	},
	navigate: {
		type: Function as PropType<(e: MouseEvent) => void>,
		default: () => () => {},
	},
})
const emit = defineEmits<NcButtonEmits>()

/**
 * If this is a link (<a>) element
 */
const isLink = computed(() => props.to || props.href)

/**
 * If the button has a pressed state (only if not a link)
 */
const hasPressedState = computed(() => !isLink.value && typeof props.pressed === 'boolean')

/**
 * The real type to be used for the button, enforces `primary` for pressed state and, if stateful button, any other type for not pressed state
 * Otherwise the type property is used.
 */
const realType = computed(() => {
	// Force *primary* when pressed
	if (props.pressed) {
		return 'primary'
	}
	// If not pressed but button is configured as stateful button then the type must not be primary
	if (props.pressed === false && props.type === 'primary') {
		return 'secondary'
	}
	return props.type
})

/**
 * The flexbox alignment of the button content
 */
const flexAlignment = computed(() => props.alignment.split('-')[0])

/**
 * If the button content should be reversed (icon on the end)
 */
const isReverseAligned = computed(() => props.alignment.includes('-'))

const getNcPopoverTriggerAttrs = inject<() => Record<string, string|undefined>>('NcPopover:trigger:attrs', () => ({}), false)
const ncPopoverTriggerAttrs = computed(() => getNcPopoverTriggerAttrs())

const slots = useSlots()

/**
 * Check if the button has a text content (function because slots are not reactive)
 */
function hasText(): boolean {
	return Boolean(props.text) || isSlotPopulated(slots.default?.())
}

/**
 * Check if the button has an icon (function because slots are not reactive)
 */
function hasIcon(): boolean {
	return isSlotPopulated(slots.icon?.())
}

/**
 * Handle the click on the link / button
 * @param event The mouse click event
 */
function onClick(event: MouseEvent) {
	if (hasPressedState.value) {
		/**
		 * Update the current pressed state of the button (if the `pressed` property was configured)
		 *
		 * @property {boolean} newValue The new `pressed`-state
		 */
		emit('update:pressed', !props.pressed)
	}
	// We have to both navigate and emit the click event
	emit('click', event)
	props.navigate(event)
}

/**
 * Warn developers about missing aria label for icon-only buttons
 */
watch(
	() => props.ariaLabel,
	() => {
		if (!props.ariaLabel && !hasText()) {
			logger.debug('You need to fill either the text or the ariaLabel props in the button component.')
		}
	},
	{ immediate: true },
)
</script>

<style lang="scss" scoped>
.button-vue {
	// Setup different button sizes
	--button-size: var(--default-clickable-area);
	--button-radius: var(--border-radius-element, calc(var(--button-size) / 2));
	--button-padding-default: min(calc(var(--default-grid-baseline) + var(--button-radius)), calc(var(--default-grid-baseline) * 4));
	--button-padding: var(--default-grid-baseline) var(--button-padding-default);

	&--size-small {
		--button-size: var(--clickable-area-small, 24px);
		--button-radius: var(--border-radius); // make the border radius even smaller for small buttons
	}

	&--size-large {
		--button-size: var(--clickable-area-large, 48px);
	}

	// General styles
	position: relative;
	width: fit-content;
	overflow: hidden;
	border: 0;
	padding-block: 0;
	padding-inline: var(--button-padding);
	font-size: var(--default-font-size);
	font-weight: bold;
	min-height: var(--button-size);
	min-width: var(--button-size);
	display: flex;
	align-items: center;
	justify-content: center;

	// Cursor pointer on element and all children
	cursor: pointer;
	& *,
	span {
		cursor: pointer;
	}
	border-radius: var(--button-radius);
	transition-property: color, border-color, background-color;
	transition-duration: 0.1s;
	transition-timing-function: linear;

	// No outline feedback for focus. Handled with a toggled class in js (see data)
	&:focus {
		outline: none;
	}

	&:disabled {
		cursor: default;
		& * {
			cursor: default;
		}
		opacity: $opacity_disabled;
		// Gives a wash out effect
		filter: saturate($opacity_normal);
	}

	// Default button type
	color: var(--color-primary-element-light-text);
	background-color: var(--color-primary-element-light);
	&:hover:not(:disabled) {
		background-color: var(--color-primary-element-light-hover);
	}

	// Back to the default color for this button when active
	// TODO: add ripple effect
	&:active {
		background-color: var(--color-primary-element-light);
	}

	&__wrapper {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 100%;
	}

	&--end &__wrapper {
		justify-content: end;
	}
	&--start &__wrapper {
		justify-content: start;
	}
	&--reverse &__wrapper {
		flex-direction: row-reverse;
	}

	&--reverse#{&}--icon-and-text {
		padding-inline: var(--button-padding) var(--default-grid-baseline);
	}

	&__icon {
		height: var(--button-size);
		width: var(--button-size);
		min-height: var(--button-size);
		min-width: var(--button-size);
		display: flex;
		justify-content: center;
		align-items: center;
	}
	// For small buttons we need to adjust the icon size
	&--size-small &__icon {
		:deep(> *) {
			max-height: 16px;
			max-width: 16px;
		}
		:deep(svg) {
			height: 16px;
			width: 16px;
		}
	}

	&__text {
		font-weight: bold;
		margin-bottom: 1px;
		padding: 2px 0;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	// Icon-only button
	&:not(:has(#{&}__text)) {
		--button-padding: clamp(var(--default-grid-baseline), var(--button-radius), calc(var(--default-grid-baseline) * 4));
		line-height: 1;
		width: var(--button-size) !important;
	}

	// Text-only button
	&:not(:has(#{&}__icon)) {
		--button-padding: var(--button-padding-default);
		& .button-vue__text {
			padding-inline: var(--default-grid-baseline);
		}
	}

	// Wide button spans the whole width of the container
	&--wide {
		width: 100%;
	}

	&:focus-visible {
		outline: 2px solid var(--color-main-text) !important;
		box-shadow: 0 0 0 4px var(--color-main-background) !important;
		&.button-vue--vue-tertiary-on-primary {
			outline: 2px solid var(--color-primary-element-text);
			border-radius: var(--border-radius-element, var(--border-radius));
			background-color: transparent;
		}
	}

	// Button types

	// Primary
	&--vue-primary {
		background-color: var(--color-primary-element);
		color: var(--color-primary-element-text);
		&:hover:not(:disabled) {
			background-color: var(--color-primary-element-hover);
		}
		// Back to the default color for this button when active
		// TODO: add ripple effect
		&:active {
			background-color: var(--color-primary-element);
		}
	}

	// Secondary
	&--vue-secondary {
		color: var(--color-primary-element-light-text);
		background-color: var(--color-primary-element-light);
		&:hover:not(:disabled) {
			color: var(--color-primary-element-light-text);
			background-color: var(--color-primary-element-light-hover);
		}
	}

	// Tertiary
	&--vue-tertiary {
		color: var(--color-main-text);
		background-color: transparent;
		&:hover:not(:disabled) {
			background-color: var(--color-background-hover);
		}
	}

	// Tertiary, no background
	&--vue-tertiary-no-background {
		color: var(--color-main-text);
		background-color: transparent;
		&:hover:not(:disabled) {
			background-color: transparent;
		}
	}

	// Tertiary on primary color (like the header)
	&--vue-tertiary-on-primary {
		color: var(--color-primary-element-text);
		background-color: transparent;

		&:hover:not(:disabled) {
			background-color: transparent;
		}
	}

	// Success
	&--vue-success {
		background-color: var(--color-success);
		color: white;
		&:hover:not(:disabled) {
			background-color: var(--color-success-hover);
		}
		// Back to the default color for this button when active
		// : add ripple effect
		&:active {
			background-color: var(--color-success);
		}
	}

	// Warning
	&--vue-warning {
		background-color: var(--color-warning);
		color: white;
		&:hover:not(:disabled) {
			background-color: var(--color-warning-hover);
		}
		// Back to the default color for this button when active
		// TODO: add ripple effect
		&:active {
			background-color: var(--color-warning);
		}
	}

	// Error
	&--vue-error {
		background-color: var(--color-error);
		color: white;
		&:hover:not(:disabled) {
			background-color: var(--color-error-hover);
		}
		// Back to the default color for this button when active
		// TODO: add ripple effect
		&:active {
			background-color: var(--color-error);
		}
	}
}

</style>
