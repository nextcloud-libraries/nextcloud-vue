/**
 * @copyright Copyright (c) 2024 Maksim Sukharev <antreesy.web@gmail.com>
 *
 * @author Maksim Sukharev <antreesy.web@gmail.com>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import { describe, afterEach, it, expect } from 'vitest'
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
