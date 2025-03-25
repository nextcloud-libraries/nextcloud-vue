/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Check whether the dark theme is used on a specific element
 * @param el - Element to check for dark theme, which is used for `data-theme-*` checking (default is `document.body`)
 * @return {boolean} - Whether the dark theme is enabled via Nextcloud theme
 */
export function checkIfDarkTheme(el: HTMLElement = document.body): boolean {
	// Check if the new clean nextcloud-theme-dark variable is set
	const isNextcloudThemeDark = window.getComputedStyle(el).getPropertyValue('--nextcloud-theme-dark')
	if (isNextcloudThemeDark !== undefined) {
		return isNextcloudThemeDark === '1'
	}

	// Else we check the old ways
	// 1. first priority is the data-theme-dark attribute on a parent element
	// 2. second priority is the data-themes attribute on the body, aka the user setting
	// 3. third priority is the system preference
	// 4. lastly is the default light theme
	const darkModeSystemPreference = window?.matchMedia?.('(prefers-color-scheme: dark)')?.matches
	const darkModeAccountSetting = document.body.getAttribute('data-themes')?.includes('dark')
	const darkModeElementOverride = el.closest('[data-theme-dark]') !== null
	return darkModeElementOverride || darkModeAccountSetting || darkModeSystemPreference || false
}

/**
 * Whether the dark theme is enabled in Nextcloud.
 * The variable is defined on page load and not reactive.
 * Use `checkIfDarkTheme` if you need to check it at a specific moment.
 * Use `useDarkTheme` if you need a reactive variable in a Vue component.
 */
export const isDarkTheme = checkIfDarkTheme()
