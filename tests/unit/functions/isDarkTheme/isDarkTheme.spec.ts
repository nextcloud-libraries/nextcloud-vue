/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { afterEach, describe, expect, it } from 'vitest'
import { checkIfDarkTheme } from '../../../../src/functions/isDarkTheme/index.ts'

/**
 * Create an element with the given theming properties set on it
 *
 * @param variables - CSS properties to set
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

	it('is dark when the color scheme is dark', () => {
		expect(checkIfDarkTheme(themedElement({ 'color-scheme': 'dark' }))).toBe(true)
	})

	it('is light when the color scheme is light', () => {
		expect(checkIfDarkTheme(themedElement({ 'color-scheme': 'light' }))).toBe(false)
	})

	it('prefers the color scheme over --background-invert-if-dark', () => {
		const el = themedElement({ 'color-scheme': 'light', '--background-invert-if-dark': 'invert(100%)' })
		expect(checkIfDarkTheme(el)).toBe(false)
	})

	it('falls back when the color scheme is not a single theme', () => {
		const el = themedElement({ 'color-scheme': 'light dark', '--background-invert-if-dark': 'invert(100%)' })
		expect(checkIfDarkTheme(el)).toBe(true)
	})

	it('falls back to --background-invert-if-dark on older servers', () => {
		expect(checkIfDarkTheme(themedElement({ '--background-invert-if-dark': 'invert(100%)' }))).toBe(true)
		expect(checkIfDarkTheme(themedElement({ '--background-invert-if-dark': 'no' }))).toBe(false)
	})

	it('is light without any theme', () => {
		expect(checkIfDarkTheme(themedElement({}))).toBe(false)
	})

	it('reads the color scheme inherited from an ancestor', () => {
		const parent = themedElement({ 'color-scheme': 'dark' })
		const child = document.createElement('span')
		parent.appendChild(child)
		expect(checkIfDarkTheme(child)).toBe(true)
	})
})
