<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
import type { PropType, SlotsType } from 'vue'

import { defineComponent, h, resolveComponent } from 'vue'
import { ButtonAlignment, ButtonNativeType, ButtonType } from './types'
import isSlotPopulated from '../../utils/isSlotPopulated'

export default defineComponent({
	name: 'NcButton',

	inject: {
		getNcPopoverTriggerAttrs: {
			from: 'NcPopover:trigger:attrs',
			default: () => () => ({}),
		},
	},

	props: {
		/**
		 * Set the text and icon alignment
		 */
		alignment: {
			type: String as PropType<ButtonAlignment>,
			default: ButtonAlignment.Center,
			validator(value: string) {
				return Object.values(ButtonAlignment).includes(value as ButtonAlignment)
			},
		},

		/**
		 * Toggles the disabled state of the button on and off.
		 */
		disabled: {
			type: Boolean,
			default: false,
		},

		/**
		 * Specify the button size
		 * Accepted values: `'small'`, `'normal'` (default), `'large'`
		 */
		size: {
			type: String,
			default: 'normal',
			validator(value: string) {
				return ['small', 'normal', 'large'].includes(value)
			},
		},

		/**
		 * Specifies the button type
		 * If left empty, the default button style will be applied.
		 */
		type: {
			type: String as PropType<ButtonType>,
			default: ButtonType.Secondary,
			validator(value: string) {
				return Object.values(ButtonType).includes(value as ButtonType)
			},
		},

		/**
		 * Specifies the button native type
		 * If left empty, the default "button" type will be used.
		 */
		nativeType: {
			type: String as PropType<ButtonNativeType>,
			default: ButtonNativeType.Button,
			validator(value: string) {
				return Object.values(ButtonNativeType).includes(value as ButtonNativeType)
			},
		},

		/**
		 * Specifies whether the button should span all the available width.
		 * By default, buttons span the whole width of the container.
		 */
		wide: {
			type: Boolean,
			default: false,
		},

		/**
		 * Always try to provide an aria-label to your button. Make it more
		 * specific than the button's name by provide some more context. E.g. if
		 * the name of the button is "send" in the Mail app, the aria label could
		 * be "Send email".
		 */
		ariaLabel: {
			type: String,
			default: null,
		},

		/**
		 * Providing the href attribute turns the button component into an `a`
		 * element.
		 */
		href: {
			type: String,
			default: null,
		},

		/**
		 * Target for the `a` element if `href` is set.
		 */
		target: {
			type: String,
			default: '_self',
		},

		/**
		 * Providing the download attribute with href downloads file when clicking.
		 */
		download: {
			type: String,
			default: null,
		},

		/**
		 * Providing the to attribute turns the button component into a `router-link`
		 * element. Takes precedence over the href attribute.
		 */
		to: {
			type: [String, Object],
			default: null,
		},

		/**
		 * @deprecated To be removed in @nextcloud/vue 9. Migration guide: remove ariaHidden prop from NcAction* components.
		 * @todo Add a check in @nextcloud/vue 9 that this prop is not provided,
		 * otherwise root element will inherit incorrect aria-hidden.
		 */
		ariaHidden: {
			type: Boolean,
			default: null,
		},

		/**
		 * The pressed state of the button if it has a checked state
		 * This will add the `aria-pressed` attribute and for the button to have the primary style in checked state.
		 *
		 * Pressed state is not supported for links
		 */
		pressed: {
			type: Boolean,
			default: null,
		},
	},

	emits: {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		'update:pressed': (pressed: boolean) => true,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		click: (event: PointerEvent) => true,
	},

	slots: Object as SlotsType<{
		/**
		 * Text content of the button. Can include custom layout.
		 */
		default: void,
		/**
		 * Icon content
		 */
		icon: void,
	}>,

	computed: {
		/**
		 * The real type to be used for the button, enforces `primary` for pressed state and, if stateful button, any other type for not pressed state
		 * Otherwise the type property is used.
		 */
		realType() {
			// Force *primary* when pressed
			if (this.pressed) {
				return 'primary'
			}
			// If not pressed but button is configured as stateful button then the type must not be primary
			if (this.pressed === false && this.type === 'primary') {
				return 'secondary'
			}
			return this.type
		},

		/**
		 * The flexbox alignment of the button content
		 */
		flexAlignment() {
			return this.alignment.split('-')[0]
		},

		/**
		 * If the button content should be reversed (icon on the end)
		 */
		isReverseAligned() {
			return this.alignment.includes('-')
		},

		ncPopoverTriggerAttrs() {
			return (this.getNcPopoverTriggerAttrs as () => Record<string, string|undefined>)()
		},
	},

	/**
	 * The render function to display the component
	 *
	 * @return {object|undefined} The created VNode
	 */
	render() {
		const hasText = isSlotPopulated(this.$slots.default?.())
		const hasIcon = isSlotPopulated(this.$slots.icon?.())

		/**
		 * Always fill either the text prop or the ariaLabel one.
		 */
		if (!hasText && !this.ariaLabel) {
			console.warn('You need to fill either the text or the ariaLabel props in the button component.', {
				text: this.$slots.default?.()?.[0]?.children,
				ariaLabel: this.ariaLabel,
			},
			this)
		}

		const isLink = (this.to || this.href)

		const hasPressed = !isLink && typeof this.pressed === 'boolean'

		const renderButton = ({ href, navigate, isActive }: {href?: string, navigate?: (ev: Event) => void, isActive?: boolean } = {}) => h(isLink ? 'a' : 'button',
			{
				class: [
					'button-vue',
					`button-vue--size-${this.size}`,
					{
						'button-vue--icon-only': hasIcon && !hasText,
						'button-vue--text-only': hasText && !hasIcon,
						'button-vue--icon-and-text': hasIcon && hasText,
						[`button-vue--vue-${this.realType}`]: this.realType,
						'button-vue--wide': this.wide,
						[`button-vue--${this.flexAlignment}`]: this.flexAlignment !== 'center',
						'button-vue--reverse': this.isReverseAligned,
						active: isActive,
					},
				],
				'aria-label': this.ariaLabel,
				'aria-pressed': hasPressed ? this.pressed.toString() : undefined,
				disabled: this.disabled,
				type: isLink ? null : this.nativeType,
				role: isLink ? 'button' : null,
				href: this.to ? href : (this.href || null),
				target: isLink ? this.target : null,
				rel: isLink ? 'nofollow noreferrer noopener' : null,
				download: (!this.to && this.href && this.download) ? this.download : null,
				// If this button is used as a popover trigger, we need to apply trigger attrs, e.g. aria attributes
				...this.ncPopoverTriggerAttrs,
				onClick: ($event) => {
					// Update pressed prop on click if it is set
					if (hasPressed) {
						/**
						 * Update the current pressed state of the button (if the `pressed` property was configured)
						 *
						 * @property {boolean} newValue The new `pressed`-state
						 */
						this.$emit('update:pressed', !this.pressed)
					}
					// We have to both navigate and emit the click event
					this.$emit('click', $event)
					navigate?.($event)
				},
			},
			[
				h('span', { class: 'button-vue__wrapper' }, [
					hasIcon
						? h('span', {
							class: 'button-vue__icon',
							attrs: {
								'aria-hidden': 'true',
							},
						},
						[this.$slots.icon?.()],
						)
						: null,
					hasText ? h('span', { class: 'button-vue__text' }, [this.$slots.default?.()]) : null,
				]),
			],
		)

		// If we have a router-link, we wrap the button in it
		if (this.to) {
			return h(resolveComponent('router-link'), {
				custom: true,
				to: this.to,
			}, {
				default: renderButton,
			})
		}
		// Otherwise we simply return the button
		return renderButton()
	},
})
</script>

<style lang="scss" scoped>
.button-vue {
	// Setup different button sizes
	--button-size: var(--default-clickable-area);
	--button-radius: var(--border-radius-element, calc(var(--button-size) / 2));
	--button-padding: clamp(var(--default-grid-baseline), var(--button-radius), calc(var(--default-grid-baseline) * 4));

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
	padding: 0;
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
	&--icon-only {
		line-height: 1;
		width: var(--button-size) !important;
	}

	// Text-only button
	&--text-only {
		padding: 0 var(--button-padding);
		& .button-vue__text {
			margin-left: 4px;
			margin-right: 4px;
		}
	}

	// Icon and text button
	&--icon-and-text {
		// icon and text means the icon adds "visual" padding thus we need to adjust the text padding
		--button-padding: min(calc(var(--default-grid-baseline) + var(--button-radius)), calc(var(--default-grid-baseline) * 4));
		// Adjust padding as the icon already got some padding we need to reduce the padding on the icon side and only add larger padding to the text side
		padding-block: 0;
		padding-inline: var(--default-grid-baseline) var(--button-padding);
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
