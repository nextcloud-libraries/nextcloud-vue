/**
 * @copyright Copyright (c) 2021 Raimund Schlüßler <raimund.schluessler@mailbox.org>
 *
 * @author Raimund Schlüßler <raimund.schluessler@mailbox.org>
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import NcHighlight from '../../../../src/components/NcHighlight/NcHighlight.vue'

describe('NcHighlight.vue', () => {
	'use strict'

	describe('validate given ranges', () => {
		it('should ensure ranges are well formed (start before end)', () => {
			const wrapper = mount(NcHighlight, {
				props: {
					text: 'Highlight me',
					search: 'me',
					highlight: [
						{ start: 3, end: 1 },
						{ start: 5, end: 7 },
					],
				},
			})

			expect(wrapper.vm.ranges).toEqual([
				{ start: 1, end: 3 },
				{ start: 5, end: 7 },
			])
		})

		it('should discard ranges completely out of bound', () => {
			const wrapper = mount(NcHighlight, {
				props: {
					text: 'Highlight me',
					search: 'me',
					highlight: [
						{ start: -10, end: -2 },
						{ start: 1, end: 3 },
						{ start: 5, end: 7 },
						{ start: 20, end: 25 },
					],
				},
			})

			expect(wrapper.vm.ranges).toEqual([
				{ start: 1, end: 3 },
				{ start: 5, end: 7 },
			])
		})

		it('should limit ranges to the string length', () => {
			const wrapper = mount(NcHighlight, {
				props: {
					text: 'Highlight me',
					search: 'me',
					highlight: [
						{ start: -10, end: -2 },
						{ start: -2, end: 1 },
						{ start: 3, end: 3 },
						{ start: 5, end: 7 },
						{ start: 10, end: 25 },
						{ start: 20, end: 25 },
					],
				},
			})

			expect(wrapper.vm.ranges).toEqual([
				{ start: 0, end: 1 },
				{ start: 3, end: 3 },
				{ start: 5, end: 7 },
				{ start: 10, end: 12 },
			])
		})

		it('should sort ranges ascendingly', () => {
			const wrapper = mount(NcHighlight, {
				props: {
					text: 'Highlight me',
					search: 'me',
					highlight: [
						{ start: -10, end: -2 },
						{ start: -2, end: 1 },
						{ start: 20, end: 25 },
						{ start: 10, end: 25 },
						{ start: 5, end: 7 },
						{ start: 3, end: 3 },
					],
				},
			})

			expect(wrapper.vm.ranges).toEqual([
				{ start: 0, end: 1 },
				{ start: 3, end: 3 },
				{ start: 5, end: 7 },
				{ start: 10, end: 12 },
			])
		})

		it('should merge overlapping or adjacent ranges', () => {
			const wrapper = mount(NcHighlight, {
				props: {
					text: 'Highlight me',
					search: 'me',
					highlight: [
						{ start: -2, end: 1 },
						{ start: 1, end: 3 },
						{ start: 5, end: 7 },
						{ start: 6, end: 25 },
						{ start: 6, end: 25 },
						{ start: 7, end: 9 },
						{ start: 20, end: 25 },
						{ start: -10, end: -2 },
					],
				},
			})

			expect(wrapper.vm.ranges).toEqual([
				{ start: 0, end: 3 },
				{ start: 5, end: 12 },
			])
		})
	})
})
