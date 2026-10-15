/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Check whether the dark theme is used on a specific element
 *
 * @param el - Element to check for dark theme, which is used for `data-theme-*` checking (default is `document.body`)
 * @return Whether the dark theme is enabled via Nextcloud theme
 */
export function checkIfDarkTheme(el: HTMLElement = document.body): boolean {
	const styles = window.getComputedStyle(el)

	// Nextcloud 36+ sets --nextcloud-theme-dark to 1 for dark themes and 0 otherwise
	const themeDark = styles.getPropertyValue('--nextcloud-theme-dark').trim()
	if (themeDark !== '') {
		return themeDark === '1'
	}

	// Older servers: --background-invert-if-dark is 'invert(100%)' for dark themes, 'no' otherwise.
	// Without any theme both are empty, which falls back to the light theme.
	// TODO: remove this fallback once Nextcloud 35 is no longer supported
	return styles.getPropertyValue('--background-invert-if-dark').trim() === 'invert(100%)'
}

/**
 * Whether the dark theme is enabled in Nextcloud.
 * The variable is defined on page load and not reactive.
 * Use `checkIfDarkTheme` if you need to check it at a specific moment.
 * Use `useDarkTheme` if you need a reactive variable in a Vue component.
 */
export const isDarkTheme = checkIfDarkTheme()
