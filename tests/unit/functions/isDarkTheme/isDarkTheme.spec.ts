/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { afterEach, describe, expect, it } from 'vitest'
import { checkIfDarkTheme } from '../../../../src/functions/isDarkTheme/index.ts'

/**
 * Create an element with the given theming variables set on it
 *
 * @param variables - CSS custom properties to set
 */
function themedElement(variables: Record<string, string>): HTMLElement {
	const el = document.createElement('div')
	for (const [name, value] of Object.entries(variables)) {
		el.style.setProperty(name, value)
	}
	document.body.appendChild(el)
	return el
}

describe('checkIfDarkTheme', () => {
	afterEach(() => {
		document.body.replaceChildren()
	})

	it('is dark when --nextcloud-theme-dark is 1', () => {
		expect(checkIfDarkTheme(themedElement({ '--nextcloud-theme-dark': '1' }))).toBe(true)
	})

	it('is light when --nextcloud-theme-dark is 0', () => {
		expect(checkIfDarkTheme(themedElement({ '--nextcloud-theme-dark': '0' }))).toBe(false)
	})

	it('prefers --nextcloud-theme-dark over --background-invert-if-dark', () => {
		const el = themedElement({ '--nextcloud-theme-dark': '0', '--background-invert-if-dark': 'invert(100%)' })
		expect(checkIfDarkTheme(el)).toBe(false)
	})

	it('falls back to --background-invert-if-dark on older servers', () => {
		expect(checkIfDarkTheme(themedElement({ '--background-invert-if-dark': 'invert(100%)' }))).toBe(true)
		expect(checkIfDarkTheme(themedElement({ '--background-invert-if-dark': 'no' }))).toBe(false)
	})

	it('is light without any theme', () => {
		expect(checkIfDarkTheme(themedElement({}))).toBe(false)
	})

	it('reads the variable inherited from an ancestor', () => {
		const parent = themedElement({ '--nextcloud-theme-dark': '1' })
		const child = document.createElement('span')
		parent.appendChild(child)
		expect(checkIfDarkTheme(child)).toBe(true)
	})
})
