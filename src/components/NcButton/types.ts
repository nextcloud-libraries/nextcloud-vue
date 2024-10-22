/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PropType } from 'vue'

export enum ButtonAlignment {
	Start = 'start',
	StartReverse = 'start-reverse',
	Center = 'center',
	CenterReverse = 'center-reverse',
	End = 'end',
	EndReverse = 'end-reverse',
}

export enum ButtonNativeType {
	Submit = 'submit',
	Reset = 'reset',
	Button = 'button',
}

export enum ButtonType {
	Primary = 'primary',
	Secondary = 'secondary',
	Tertiary = 'tertiary',
	TertiaryNoBackground = 'tertiary-no-background',
	TertiaryOnPrimary = 'tertiary-on-primary',
	Error = 'error',
	/**
	 * @deprecated Design-wise not recommended for new code
	 */
	Warning = 'warning',
	Success = 'success',
}

export interface NcButtonEmits {
	(e: 'click', event: MouseEvent): void
	/**
	 * Update the current pressed state of the button (if the `pressed` property was configured)
	 */
	(e: 'update:pressed', pressed: boolean): void
}

export const NcButtonProps = {
	/**
	 * Set the text and icon alignment
	 *
	 * @default 'center'
	 * @type {'start' | 'start-reverse' | 'center' | 'center-reverse' | 'end' | 'end-reverse'}
	 */
	alignment: {
		type: String as PropType<ButtonAlignment>,
		default: ButtonAlignment.Center,
		validator(value: string) {
			return Object.values(ButtonAlignment).includes(value as ButtonAlignment)
		},
	},

	/**
	 * By default the icon is set to `aria-hidden="true"` to hide it from the accessibility tree.
	 * But sometimes this is not desired, e.g. for a loading icon with an accessible name,
	 * setting this prop will make the icon appear in the accessible tree.
	 * @default false
	 * @since 9.0.0
	 */
	noIconAriaHidden: {
		type: Boolean,
		default: false,
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
	 * The main button text.
	 * This can be overwritten by using the *default* slot.
	 * @since 9.0.0
	 */
	text: {
		type: String,
		default: '',
	},

	/**
	 * Specifies the button type
	 * If left empty, the default button style will be applied.
	 *
	 * @default 'secondary'
	 * @type {'primary' | 'secondary' | 'tertiary' | 'tertiary-no-background' | 'tertiary-on-primary' | 'error' | 'warning' | 'success'}
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
	 *
	 * @default 'button'
	 * @type {'submit' | 'reset' | 'button'}
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
	 * @default '_self'
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
	 * The pressed state of the button if it has a checked state
	 * This will add the `aria-pressed` attribute and for the button to have the primary style in checked state.
	 *
	 * Pressed state is not supported for links
	 */
	pressed: {
		type: Boolean,
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
}
