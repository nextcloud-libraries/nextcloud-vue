/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { getAvatarUrl } from '../../../src/utils/getAvatarUrl'
import { afterEach, describe, expect, it } from 'vitest'

describe('getAvatarUrl', () => {
	afterEach(() => {
		document.body.style.setProperty('--background-invert-if-dark', '')
	})

	it('should return correct relative URL for user avatar', () => {
		expect(getAvatarUrl('alice')).toBe('//index.php/avatar/alice/64')
		expect(getAvatarUrl('john', { size: 64 })).toBe('//index.php/avatar/john/64')
	})

	it('should return correct relative URL with fixed sizes', () => {
		/// @ts-expect-error testing invalid value
		expect(getAvatarUrl('alice', { size: 0 })).toBe('//index.php/avatar/alice/64')
		/// @ts-expect-error testing invalid value
		expect(getAvatarUrl('alice', { size: -1 })).toBe('//index.php/avatar/alice/64')
		expect(getAvatarUrl('john', { size: 64 })).toBe('//index.php/avatar/john/64')
		/// @ts-expect-error testing invalid value
		expect(getAvatarUrl('john', { size: 65 })).toBe('//index.php/avatar/john/512')
		expect(getAvatarUrl('john', { size: 512 })).toBe('//index.php/avatar/john/512')
	})

	it('should return correct relative URL for user avatar in dark mode', () => {
		document.body.style.setProperty('--background-invert-if-dark', 'invert(100%)')

		expect(getAvatarUrl('alice')).toBe('//index.php/avatar/alice/64/dark')
		expect(getAvatarUrl('john', { size: 512 })).toBe('//index.php/avatar/john/512/dark')
	})

	it('should return correct relative URL for user avatar in dark mode if enforced', () => {
		expect(getAvatarUrl('alice', { isDarkTheme: true })).toBe('//index.php/avatar/alice/64/dark')
		expect(getAvatarUrl('john', { isDarkTheme: true, size: 512 })).toBe('//index.php/avatar/john/512/dark')
	})

	it('should return correct relative URL for user avatar in bright mode if enforced but body is darkmode', () => {
		document.body.style.setProperty('--background-invert-if-dark', 'invert(100%)')

		expect(getAvatarUrl('alice', { isDarkTheme: false })).toBe('//index.php/avatar/alice/64')
		expect(getAvatarUrl('john', { isDarkTheme: false, size: 512 })).toBe('//index.php/avatar/john/512')
	})

	it('should return correct relative URL for user avatar in dark mode', () => {
		document.body.style.setProperty('--background-invert-if-dark', 'invert(100%)')

		expect(getAvatarUrl('alice')).toBe('//index.php/avatar/alice/64/dark')
		expect(getAvatarUrl('john', { size: 64 })).toBe('//index.php/avatar/john/64/dark')
	})

	it('should return correct relative URL for guest avatar', () => {
		expect(getAvatarUrl('alice', { isGuest: true })).toBe('//index.php/avatar/guest/alice/64')
		expect(getAvatarUrl('john', { size: 64, isGuest: true })).toBe('//index.php/avatar/guest/john/64')
	})

	it('should return correct relative URL for guest avatar in dark mode', () => {
		document.body.style.setProperty('--background-invert-if-dark', 'invert(100%)')

		expect(getAvatarUrl('alice', { isGuest: true })).toBe('//index.php/avatar/guest/alice/64/dark')
		expect(getAvatarUrl('john', { size: 64, isGuest: true })).toBe('//index.php/avatar/guest/john/64/dark')
	})
})
