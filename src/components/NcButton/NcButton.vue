<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { Slot } from 'vue'
import type { RouteLocation } from 'vue-router'

import { computed, inject, toRef } from 'vue'
import { routerKey, useLink } from 'vue-router'

export type ButtonAlignment = 'start'
	| 'start-reverse'
	| 'center'
	| 'center-reverse'
	| 'end'
	| 'end-reverse'

export type ButtonSize = 'small'
	| 'normal'
	| 'large'

export type ButtonType =
	| 'submit'
	| 'reset'
	| 'button'

export type ButtonVariant = 'primary'
	| 'secondary'
	| 'tertiary'
	| 'tertiary-no-background'
	| 'tertiary-on-primary'
	| 'error'
	// Design-wise not recommended for new code
	| 'warning'
	| 'success'

interface NcButtonProps {
	/**
	 * Set the text and icon alignment
	 *
	 * @default 'center'
	 */
	alignment?: ButtonAlignment

	/**
	 * Always try to provide an aria-label to your button.
	 *
	 * Make it more specific than the button's name by provide some more context.
	 * E.g. if the name of the button is "send" in the Mail app,
	 * the aria label could be "Send email".
	 */
	ariaLabel?: string

	/**
	 * Toggles the disabled state of the button on and off.
	 * @default false
	 */
	disabled?: boolean

	/**
	 * When `href` is set this will make the browser try to download the target.
	 * If a string is passed the browser will use it as the filename.
	 *
	 * Note that the browser might adjust it for allowed characters (e.g. '/' or '\').
	 * Also this only works with same-origin URLs and `blob:` or `data:` schemas.
	 * Moreover a `Content-Disposition` header set by the server will override the filename.
	 */
	download?: string|true

	/**
	 * Providing the href attribute turns the button component into an `a` element.
	 */
	href?: string

	/**
	 * The pressed state of the button if it has a checked state.
	 * This will add the `aria-pressed` attribute and for the button to have the primary style in checked state.
	 *
	 * Note: Pressed state is not supported for links.
	 */
	pressed?: boolean

	/**
	 * Specify the button size.
	 * @default 'normal'
	 */
	size?: ButtonSize

	/**
	 * Target for the `a` element if `href` is set.
	 * @default '_self'
	 */
	target?: string

	/**
	 * The main button text.
	 * This can be overwritten by using the *default* slot.
	 * @since 9.0.0
	 */
	text?: string

	/**
	 * Providing the to attribute turns the button component into a `router-link` element.
	 *
	 * Note: This takes precedence over the href attribute.
	 */
	to?: string|RouteLocation

	/**
	 * Specifies the button native type
	 * If left empty, the default "button" type will be used.
	 *
	 * @default 'button'
	 */
	type?: ButtonType

	/**
	 * Specifies the button variant.
	 * If left empty, the default button style will be applied.
	 *
	 * @default 'secondary'
	 */
	variant?: ButtonVariant

	/**
	 * Specifies whether the button should span all the available width.
	 * By default, buttons span the whole width of the container.
	 * @default false
	 */
	wide?: boolean
}

const props = withDefaults(defineProps<NcButtonProps>(), {
	ariaLabel: undefined,
	alignment: 'center',
	download: undefined,
	href: undefined,
	pressed: undefined,
	size: 'normal',
	target: '_self',
	text: undefined,
	to: undefined,
	type: 'button',
	variant: 'secondary',
})

const emit = defineEmits<{
	/**
	 * Emitted when the button was clicked.
	 */
	 click: [e: MouseEvent]

	/**
	 * Update the current pressed state of the button (if the `pressed` property was configured).
	 * If the button is a toggle button (`pressed` state is boolean),
	 * then this will be emitted if the user toggled the state.
	 */
	'update:pressed': [pressed: boolean]
}>()

defineSlots<{
	/**
	 * Custom button content.
	 * This can be used for custom formatted content, ensure to not include any interactive elements.
	 * For plain text it is preferred to use the `text` prop instead.
	 */
	default?: Slot

	/**
	 * Icon (optional) to show within the button
	 */
	icon?: Slot
}>()

// Make sure the component also works if the app does not use any router
// And if the app uses a router we need to make sure a `to` prop was passed to use to router
const routerLink = computed(() => (
	inject(routerKey, null) !== null && props.to
		? useLink({ to: toRef(() => props.to!) })
		: undefined
))

/**
 * If this is a link (<a>) element
 */
const isLink = computed(() => props.href)

/**
 * If the button has a pressed state (only if not a link)
 */
const hasPressedState = computed(() => !isLink.value && typeof props.pressed === 'boolean')

/**
 * The real variant to be used for the button, enforces `primary` for pressed state and, if stateful button, any other type for not pressed state
 * Otherwise the type property is used.
 */
const realVariant = computed(() => {
	// Force *primary* when pressed
	if (props.pressed) {
		return 'primary'
	}
	// If not pressed but button is configured as stateful button then the type must not be primary
	if (props.pressed === false && props.variant === 'primary') {
		return 'secondary'
	}
	return props.variant
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

/**
 * Attributes to pass to the <a> element
 */
const linkAttrs = computed(() => ({
	role: 'button',
	href: props.href || '#',
	target: props.target,
	rel: 'nofollow noreferrer noopener',
	download: props.download || null,
}))

/**
 * Attribute to pass to the <button> element
 */
const buttonAttrs = computed(() => ({
	'aria-pressed': hasPressedState.value ? String(props.pressed) : undefined,
	type: props.type,
}))

/**
 * Handle the click on the link / button
 * @param event The mouse click event
 */
function onClick(event: MouseEvent) {
	if (hasPressedState.value) {
		emit('update:pressed', !props.pressed)
	}
	// We have to both navigate and emit the click event
	emit('click', event)
	routerLink.value?.navigate(event)
}
</script>

<template>
	<component :is="isLink ? 'a' : 'button'"
		class="button-vue"
		:class="[
			`button-vue--size-${size}`,
			{
				[`button-vue--${realVariant}`]: realVariant,
				'button-vue--wide': wide,
				[`button-vue--${flexAlignment}`]: flexAlignment !== 'center',
				'button-vue--reverse': isReverseAligned,
				active: routerLink?.isActive,
			},
		]"
		:disabled
		:aria-label
		v-bind="{
			...ncPopoverTriggerAttrs,
			...(isLink ? linkAttrs : buttonAttrs),
		}"
		@click="onClick">
		<span class="button-vue__wrapper">
			<span class="button-vue__icon">
				<slot name="icon" />
			</span>
			<span class="button-vue__text">
				<slot>
					{{ text }}
				</slot>
			</span>
		</span>
	</component>
</template>

<style lang="scss" scoped>
.button-vue {
	--button-size: var(--default-clickable-area);
	--button-radius: var(--border-radius-element, calc(var(--button-size) / 2));
	--button-padding-default: min(calc(var(--default-grid-baseline) + var(--button-radius)), calc(var(--default-grid-baseline) * 4));
	--button-padding: var(--default-grid-baseline) var(--button-padding-default);

	// General styles
	// by default use secondary styling
	color: var(--color-primary-element-light-text);
	background-color: var(--color-primary-element-light);
	// no border but rounded
	border: 0;
	border-radius: var(--button-radius);
	// adjust position and size
	position: relative;
	width: fit-content;
	overflow: hidden;
	padding-block: 0;
	padding-inline: var(--button-padding);
	min-height: var(--button-size);
	min-width: var(--button-size);
	// display setup
	display: flex;
	align-items: center;
	justify-content: center;
	transition-property: color, border-color, background-color;
	transition-duration: 0.1s;
	transition-timing-function: linear;
	cursor: pointer;
	font-size: var(--default-font-size);
	font-weight: bold;

	// Setup different button sizes
	&--size-small {
		--button-size: var(--clickable-area-small, 24px);
		--button-radius: var(--border-radius); // make the border radius even smaller for small buttons
	}

	&--size-large {
		--button-size: var(--clickable-area-large, 48px);
	}

	// Cursor pointer on element and all children
	& *,
	span {
		cursor: pointer;
	}

	// No outline feedback for focus. Handled with a toggled class in js (see data)
	&:focus {
		outline: none;
	}

	// Disabled styles
	&:disabled {
		// Gives a wash out effect
		filter: saturate($opacity_normal);
		opacity: $opacity_disabled;

		// Reset the cursor
		cursor: default;
		* {
			cursor: default;
		}
	}

	// Hover styles when not disabled (for the default theming of 'secondary')
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

		&:empty {
			display: none;
		}
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

		&:empty {
			display: none;
		}
	}

	// Icon-only button
	&:has(#{&}__text:empty) {
		--button-padding: clamp(var(--default-grid-baseline), var(--button-radius), calc(var(--default-grid-baseline) * 4));
		line-height: 1;
		width: var(--button-size) !important;
	}

	// Text-only button
	&:has(#{&}__icon:empty) {
		--button-padding: var(--button-padding-default);

		.button-vue__text {
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
	&--primary {
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
	&--secondary {
		color: var(--color-primary-element-light-text);
		background-color: var(--color-primary-element-light);
		&:hover:not(:disabled) {
			color: var(--color-primary-element-light-text);
			background-color: var(--color-primary-element-light-hover);
		}
	}

	// Tertiary
	&--tertiary {
		color: var(--color-main-text);
		background-color: transparent;
		&:hover:not(:disabled) {
			background-color: var(--color-background-hover);
		}
	}

	// Tertiary, no background
	&--tertiary-no-background {
		color: var(--color-main-text);
		background-color: transparent;
		&:hover:not(:disabled) {
			background-color: transparent;
		}
	}

	// Tertiary on primary color (like the header)
	&--tertiary-on-primary {
		color: var(--color-primary-element-text);
		background-color: transparent;

		&:hover:not(:disabled) {
			background-color: transparent;
		}
	}

	// Success
	&--success {
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
	&--warning {
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
	&--error {
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
