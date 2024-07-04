/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

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
	 * @deprecated Designwise not recommended for new code
	 */
	Warning = 'warning',
	Success = 'success',
}
