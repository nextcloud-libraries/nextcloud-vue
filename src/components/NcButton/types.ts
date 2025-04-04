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
