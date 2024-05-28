/**
 * @copyright Copyright (c) 2021 Raimund Schlüßler <raimund.schluessler@mailbox.org>
 *
 * @author Raimund Schlüßler <raimund.schluessler@mailbox.org>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import { describe, expect, it } from 'vitest'

import FindRanges from '../../../src/utils/FindRanges'

describe('FindRanges.js', () => {
	'use strict'

	describe('find matching ranges', () => {
		it('should find the matching range', () => {
			const ranges = FindRanges('ananas', 'anan')

			expect(ranges).toEqual([
				{ start: 0, end: 4 },
			])
		})

		it('should find all non-overlapping ranges', () => {
			const ranges1 = FindRanges('ananas', 'an')

			expect(ranges1).toEqual([
				{ start: 0, end: 2 },
				{ start: 2, end: 4 },
			])

			const ranges2 = FindRanges('ananas', 'a')

			expect(ranges2).toEqual([
				{ start: 0, end: 1 },
				{ start: 2, end: 3 },
				{ start: 4, end: 5 },
			])
		})

		it('should only find first occurence of overlapping ranges', () => {
			const ranges1 = FindRanges('ananas', 'ana')

			expect(ranges1).toEqual([
				{ start: 0, end: 3 },
			])

			const ranges2 = FindRanges('oooo', 'oo')

			expect(ranges2).toEqual([
				{ start: 0, end: 2 },
				{ start: 2, end: 4 },
			])
		})
	})
})
