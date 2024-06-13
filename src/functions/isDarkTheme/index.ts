/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Check whether the dark theme is enabled in Nextcloud
 *
 * @param el - the element to check for the dark theme
 * @return {boolean}
 */
export function checkIfDarkTheme(el: HTMLElement = document.body): boolean {
	// Nextcloud uses --background-invert-if-dark for dark theme filters in CSS
	// Values:
	// - 'invert(100%)' for the dark theme
	// - 'no' for the light theme
	return window.getComputedStyle(el).getPropertyValue('--background-invert-if-dark') === 'invert(100%)'
}

/**
 * Whether the dark theme is enabled in Nextcloud.
 * The variable is defined on page load and not reactive.
 * Use `checkIfDarkTheme` if you need to check it at a specific moment.
 * Use `useDarkTheme` if you need a reactive variable in a Vue component.
 *
 * @type {boolean}
 */
export const isDarkTheme = checkIfDarkTheme()
