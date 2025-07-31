/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Check whether the dark theme is used on a specific element
 *
 * @param el - Element to check for dark theme, which is used for `data-theme-*` checking (default is `document.body`)
 * @return - Whether the dark theme is enabled via Nextcloud theme
 */
export function checkIfDarkTheme(el: HTMLElement = document.body): boolean {
	// Nextcloud uses --background-invert-if-dark for dark theme filters in CSS
	// Values:
	// - 'invert(100%)' for dark theme
	// - 'no' for light theme
	// This is the most reliable way to check for dark theme, including custom themes
	const backgroundInvertIfDark = window.getComputedStyle(el).getPropertyValue('--background-invert-if-dark')
	if (backgroundInvertIfDark !== undefined) {
		return backgroundInvertIfDark === 'invert(100%)'
	}

	// There is no theme? Fallback to the light theme
	return false
}

/**
 * Whether the dark theme is enabled in Nextcloud.
 * The variable is defined on page load and not reactive.
 * Use `checkIfDarkTheme` if you need to check it at a specific moment.
 * Use `useDarkTheme` if you need a reactive variable in a Vue component.
 */
export const isDarkTheme = checkIfDarkTheme()
