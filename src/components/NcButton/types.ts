/*!
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Slot } from 'vue'
import type { RouteLocation } from 'vue-router'
import type { EnumOrValue } from '../../utils/enumOrValue.ts'

export enum ButtonAlignment {
	Start = 'start',
	StartReverse = 'start-reverse',
	Center = 'center',
	CenterReverse = 'center-reverse',
	End = 'end',
	EndReverse = 'end-reverse',
}

export enum ButtonSize {
	Small = 'small',
	Normal = 'normal',
	Large = 'large',
}

export enum ButtonType {
	Submit = 'submit',
	Reset = 'reset',
	Button = 'button',
}

export enum ButtonVariant {
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

export interface NcButtonProps {
	/**
	 * Set the text and icon alignment
	 *
	 * @default ButtonAlignment.Center
	 */
	alignment?: EnumOrValue<ButtonAlignment>

	/**
	 * By default the icon is set to `aria-hidden="true"` to hide it from the accessibility tree.
	 * But sometimes this is not desired, e.g. for a loading icon with an accessible name,
	 * setting this prop will make the icon appear in the accessible tree.
	 * @default false
	 * @since 9.0.0
	 */
	noIconAriaHidden?: boolean

	/**
	 * Toggles the disabled state of the button on and off.
	 * @default false
	 */
	disabled?: boolean

	/**
	 * Specify the button size.
	 * @default 'normal'
	 */
	size?: EnumOrValue<ButtonSize>

	/**
	 * The main button text.
	 * This can be overwritten by using the *default* slot.
	 * @since 9.0.0
	 */
	text?: string

	/**
	 * Specifies the button variant.
	 * If left empty, the default button style will be applied.
	 *
	 * @default 'secondary'
	 */
	variant?: EnumOrValue<ButtonVariant>

	/**
	 * Specifies the button native type
	 * If left empty, the default "button" type will be used.
	 *
	 * @default 'button'
	 */
	type?: EnumOrValue<ButtonType>

	/**
	 * Specifies whether the button should span all the available width.
	 * By default, buttons span the whole width of the container.
	 * @default false
	 */
	wide?: boolean

	/**
	 * Always try to provide an aria-label to your button.
	 *
	 * Make it more specific than the button's name by provide some more context.
	 * E.g. if the name of the button is "send" in the Mail app,
	 * the aria label could be "Send email".
	 */
	ariaLabel?: string

	/**
	 * Providing the href attribute turns the button component into an `a` element.
	 */
	href?: string

	/**
	 * Target for the `a` element if `href` is set.
	 * @default '_self'
	 */
	target?: string

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
	 * The pressed state of the button if it has a checked state.
	 * This will add the `aria-pressed` attribute and for the button to have the primary style in checked state.
	 *
	 * Note: Pressed state is not supported for links.
	 */
	pressed?: boolean

	/**
	 * Providing the to attribute turns the button component into a `router-link` element.
	 *
	 * Note: This takes precedence over the href attribute.
	 */
	to?: string | RouteLocation
}

export interface NcButtonEvents {
	/**
	 * Emitted when the button was clicked.
	 */
	click: [e: MouseEvent]

	/**
	 * If the button is a toggle button (`pressed` state is boolean),
	 * then this will be emitted if the user toggled the state.
	 */
	'update:pressed': [pressed: boolean]
}

export interface NcButtonSlots {
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
}
