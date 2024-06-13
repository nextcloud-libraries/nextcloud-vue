/**
 * SPDX-FileCopyrightText: 2021 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import NcHighlight from '../../../../src/components/NcHighlight/NcHighlight.vue'

describe('NcHighlight.vue', () => {
	'use strict'

	describe('validate given ranges', () => {
		it('should ensure ranges are well formed (start before end)', () => {
			const wrapper = mount(NcHighlight, {
				propsData: {
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
				propsData: {
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
				propsData: {
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
				propsData: {
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
				propsData: {
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
