/**
 * SPDX-FileCopyrightText: 2021 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest'

import { findRanges } from '../../../src/utils/findRanges.ts'

describe('utils: findRanges', () => {
	describe('find matching ranges', () => {
		it('should find the matching range', () => {
			const ranges = findRanges('ananas', 'anan')

			expect(ranges).toEqual([
				{ start: 0, end: 4 },
			])
		})

		it('should find all non-overlapping ranges', () => {
			const ranges1 = findRanges('ananas', 'an')

			expect(ranges1).toEqual([
				{ start: 0, end: 2 },
				{ start: 2, end: 4 },
			])

			const ranges2 = findRanges('ananas', 'a')

			expect(ranges2).toEqual([
				{ start: 0, end: 1 },
				{ start: 2, end: 3 },
				{ start: 4, end: 5 },
			])
		})

		it('should only find first occurence of overlapping ranges', () => {
			const ranges1 = findRanges('ananas', 'ana')

			expect(ranges1).toEqual([
				{ start: 0, end: 3 },
			])

			const ranges2 = findRanges('oooo', 'oo')

			expect(ranges2).toEqual([
				{ start: 0, end: 2 },
				{ start: 2, end: 4 },
			])
		})
	})
})
