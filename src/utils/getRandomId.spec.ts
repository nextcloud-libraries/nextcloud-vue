/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, test, vi } from 'vitest'
import { getRandomId } from './getRandomId.ts'

describe('getRandomId', () => {

	test.each([1, 5, 10, 42])('Test with different length', (length) => {
		const id = getRandomId(length)
		expect(id).toMatch(new RegExp(`^nc-[a-zA-Z0-9]{${length}}$`))
	})

	test('Test with default length', () => {
		const id = getRandomId(5)
		expect(id).toMatch(/^nc-[a-zA-Z0-9]{5}$/)
	})

	test('Test with negative length', () => {
		expect(() => getRandomId(-1)).toThrowError()
	})

	test('Test with zero length', () => {
		expect(() => getRandomId(0)).toThrowError()
	})

	test('Test with bad luck number generator', () => {
		const spy = vi.spyOn(Math, 'random')
		spy.mockImplementation(() => Math.PI - 3)

		const id = getRandomId(10)
		expect(id).toMatch(/^nc-[a-zA-Z0-9]{10}$/)
	})
})
