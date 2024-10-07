<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { Slot } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

import { computed, inject } from 'vue'
import { routerKey } from 'vue-router'
import { isLegacy } from '../../utils/legacy.ts'

export type ButtonAlignment = 'start'
	| 'start-reverse'
	| 'center'
	| 'center-reverse'
	| 'end'
	| 'end-reverse'

export type ButtonSize = 'small'
	| 'normal'
	| 'large'

export type ButtonType = 'submit'
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

const props = withDefaults(defineProps<{
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
	 *
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
	download?: string | true

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
	pressed?: boolean | undefined

	/**
	 * Specify the button size.
	 *
	 * @default 'normal'
	 */
	size?: ButtonSize

	/**
	 * Target for the `a` element if `href` is set.
	 *
	 * @default '_self'
	 */
	target?: string

	/**
	 * The main button text.
	 * This can be overwritten by using the *default* slot.
	 *
	 * @since 9.0.0
	 */
	text?: string

	/**
	 * Providing the to attribute turns the button component into a `router-link` element.
	 *
	 * Note: This takes precedence over the href attribute.
	 */
	to?: RouteLocationRaw

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
	 *
	 * @default false
	 */
	wide?: boolean
}>(), {
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

const hasVueRouterContext = inject(routerKey, null) !== null

const tag = computed(() => {
	// TODO: should we warn if props.to is provided but there is no vue-router?
	if (hasVueRouterContext && props.to) {
		// Note: RouterLink is used as globally registered component (by name) and not imported intentionally
		// to use injected component from the app and not bundle it to the button
		return 'RouterLink'
	} else if (props.href) {
		return 'a'
	} else {
		return 'button'
	}
})

const hasPressedState = computed(() => tag.value === 'button' && typeof props.pressed === 'boolean')

const variantWithPressed = computed(() => {
	// Pressed toggle button forced to be primary
	if (props.pressed) {
		return 'primary'
	}
	// Non-pressed toggle button may use passed variant but it cannot be primary
	if (props.pressed === false && props.variant === 'primary') {
		return 'secondary'
	}

	return props.variant
})
const isTertiaryVariant = computed(() => variantWithPressed.value.startsWith('tertiary'))

const flexAlignment = computed(() => props.alignment.split('-')[0])
const isReverseAligned = computed(() => props.alignment.includes('-'))

const getNcPopoverTriggerAttrs = inject<() => Record<string, string | undefined>>('NcPopover:trigger:attrs', () => ({}), false)
const ncPopoverTriggerAttrs = computed(() => getNcPopoverTriggerAttrs())

const attrs = computed(() => {
	if (tag.value === 'RouterLink') {
		return {
			to: props.to,
			activeClass: 'active',
		}
	} else if (tag.value === 'a') {
		return {
			href: props.href || '#',
			target: props.target,
			rel: 'nofollow noreferrer noopener',
			download: props.download || undefined,
		}
	} else if (tag.value === 'button') {
		return {
			...ncPopoverTriggerAttrs.value,
			'aria-pressed': props.pressed,
			type: props.type,
			disabled: props.disabled,
		}
	}

	return undefined
})

/**
 * Handle the click on the link / button
 *
 * @param event - Mouse click event
 */
function onClick(event: MouseEvent) {
	if (hasPressedState.value) {
		emit('update:pressed', !props.pressed)
	}
	emit('click', event)
}
</script>

<template>
	<component
		:is="tag"
		class="button-vue"
		:class="[
			`button-vue--size-${size}`,
			{
				[`button-vue--${variantWithPressed}`]: variantWithPressed,
				'button-vue--tertiary': isTertiaryVariant,
				'button-vue--wide': wide,
				[`button-vue--${flexAlignment}`]: flexAlignment !== 'center',
				'button-vue--reverse': isReverseAligned,
				'button-vue--legacy': isLegacy,
			},
		]"
		:aria-label
		v-bind="attrs"
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
	--button-inner-size: calc(var(--button-size) - 4px); // without the outer border
	--button-radius: var(--border-radius-element);
	--button-padding-default: calc(var(--default-grid-baseline) + var(--button-radius));
	--button-padding: var(--default-grid-baseline) var(--button-padding-default);

	// General styles
	// by default use secondary styling
	color: var(--color-primary-element-light-text);
	background-color: var(--color-primary-element-light);
	border: 1px solid var(--color-primary-element-light-hover);
	border-bottom-width: 2px;
	border-radius: var(--button-radius);
	box-sizing: border-box;
	// adjust position and size
	position: relative;
	width: fit-content;
	overflow: hidden;
	padding-block: 1px 0; // center the content as border is 1px top and 2px bottom
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
		--button-size: var(--clickable-area-small);
		--button-radius: var(--border-radius-small); // make the border radius even smaller for small buttons
	}

	&--size-large {
		--button-size: var(--clickable-area-large);
	}

	// Cursor pointer on element and all children
	* {
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

	&--reverse {
		--button-padding: var(--button-padding-default) var(--default-grid-baseline);
	}

	&__icon {
		--default-clickable-area: var(--button-inner-size); // align icon size with inner button size
		height: var(--button-inner-size);
		width: var(--button-inner-size);
		min-height: var(--button-inner-size);
		min-width: var(--button-inner-size);
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
		--button-padding: var(--button-radius);
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
			border-radius: var(--border-radius-element);
			background-color: transparent;
		}
	}

	// Button types

	// Primary
	&--primary {
		background-color: var(--color-primary-element);
		border-color: var(--color-primary-element-hover);
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
		background-color: var(--color-primary-element-light);
		border-color: var(--color-primary-element-light-hover);
		color: var(--color-primary-element-light-text);

		&:hover:not(:disabled) {
			color: var(--color-primary-element-light-text);
			background-color: var(--color-primary-element-light-hover);
		}
	}

	// Tertiary
	&--tertiary {
		background-color: transparent;
		border-color: transparent;
		color: var(--color-main-text);

		&:hover:not(:disabled) {
			background-color: var(--color-background-hover);
		}
	}

	// Tertiary, no background
	&--tertiary-no-background {
		&:hover:not(:disabled) {
			background-color: transparent;
		}
	}

	// Tertiary on primary color (like the header)
	&--tertiary-on-primary {
		color: var(--color-primary-element-text);

		&:hover:not(:disabled) {
			background-color: transparent;
		}
	}

	// Success
	&--success {
		border-color: var(--color-success-hover);
		background-color: var(--color-success);
		color: var(--color-success-text);
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
		border-color: var(--color-warning-hover);
		background-color: var(--color-warning);
		color: var(--color-warning-text);
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
		border-color: var(--color-error-hover);
		background-color: var(--color-error);
		color: var(--color-error-text);
		&:hover:not(:disabled) {
			background-color: var(--color-error-hover);
		}
		// Back to the default color for this button when active
		// TODO: add ripple effect
		&:active {
			background-color: var(--color-error);
		}
	}

	// before Nextcloud 32
	&--legacy {
		--button-inner-size: var(--button-size);
		// no border
		border: none;
		padding-block: 0;
	}
	&--legacy#{&}--error,
	&--legacy#{&}--success,
	&--legacy#{&}--warning {
		color: white;
	}
}

</style>
