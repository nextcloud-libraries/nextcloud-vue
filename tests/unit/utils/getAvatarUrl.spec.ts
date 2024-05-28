/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { getAvatarUrl } from '../../../src/utils/getAvatarUrl'

describe('getAvatarUrl', () => {
	afterEach(() => {
		document.body.style.setProperty('--background-invert-if-dark', '')
	})

	it('should return correct relative URL for user avatar', () => {
		expect(getAvatarUrl('john', 44)).toBe('//index.php/avatar/john/44')
		expect(getAvatarUrl('alice', '64', false)).toBe('//index.php/avatar/alice/64')
	})

	it('should return correct relative URL for user avatar in dark mode', () => {
		document.body.style.setProperty('--background-invert-if-dark', 'invert(100%)')

		expect(getAvatarUrl('john', 44)).toBe('//index.php/avatar/john/44/dark')
		expect(getAvatarUrl('alice', '64', false)).toBe('//index.php/avatar/alice/64/dark')
	})

	it('should return correct relative URL for guest avatar', () => {
		expect(getAvatarUrl('john', 44, true)).toBe('//index.php/avatar/guest/john/44')
		expect(getAvatarUrl('alice', '64', true)).toBe('//index.php/avatar/guest/alice/64')
	})

	it('should return correct relative URL for guest avatar in dark mode', () => {
		document.body.style.setProperty('--background-invert-if-dark', 'invert(100%)')

		expect(getAvatarUrl('john', 44, true)).toBe('//index.php/avatar/guest/john/44/dark')
		expect(getAvatarUrl('alice', '64', true)).toBe('//index.php/avatar/guest/alice/64/dark')
	})
})
