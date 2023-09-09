/**
 * @copyright 2023 Ferdinand Thiessen <opensource@fthiessen.de>
 *
 * @author Ferdinand Thiessen <opensource@fthiessen.de>
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
import NcDatetime from '../../../../src/components/NcDatetime/NcDatetime.vue'

describe('NcDatetime.vue', () => {
	'use strict'

	it('Sets the title property correctly', () => {
		const time = Date.UTC(2023, 5, 23, 14, 30)
		Date.now = jest.fn(() => new Date(time).valueOf())
		const wrapper = mount(NcDatetime, {
			props: {
				timestamp: time,
			},
		})

		expect(wrapper.element.hasAttribute('title')).toBe(true)
		expect(wrapper.element.getAttribute('title')).toMatch('6/23/23, 2:30:00 PM')
	})

	it('Can set format of the title property', () => {
		const time = Date.UTC(2023, 5, 23, 14, 30)
		Date.now = jest.fn(() => new Date(time).valueOf())
		const wrapper = mount(NcDatetime, {
			props: {
				timestamp: time,
				format: { dateStyle: 'long' },
			},
		})

		expect(wrapper.element.hasAttribute('title')).toBe(true)
		expect(wrapper.element.getAttribute('title')).toMatch('June 23, 2023')
	})

	it('Can disable relative time', () => {
		const time = Date.UTC(2023, 5, 23, 14, 30)
		Date.now = jest.fn(() => new Date(time).valueOf())
		const wrapper = mount(NcDatetime, {
			props: {
				timestamp: time,
				relativeTime: false,
			},
		})

		expect(wrapper.element.hasAttribute('title')).toBe(true)
		expect(wrapper.element.textContent).toMatch(wrapper.element.getAttribute('title'))
	})

	describe('Work with different locales', () => {
		beforeAll(() => {
			// mock the locale
			document.documentElement.dataset.locale = 'de_DE'
		})
		afterAll(() => {
			// revert mock
			document.documentElement.dataset.locale = 'en'
		})

		/**
		 * Use German locale as it uses a different date format than English
		 */
		it('', () => {
			const time = Date.UTC(2023, 5, 23, 14, 30)
			Date.now = jest.fn(() => new Date(time).valueOf())
			const wrapper = mount(NcDatetime, {
				props: {
					timestamp: time,
				},
			})

			expect(wrapper.element.hasAttribute('title')).toBe(true)
			expect(wrapper.element.getAttribute('title')).toMatch('23.06.23, 14:30:00')
		})
	})

	describe('Shows relative time', () => {
		it('works with currentTime == timestamp', () => {
			const time = Date.UTC(2023, 5, 23, 14, 30)
			Date.now = jest.fn(() => new Date(time).valueOf())
			const wrapper = mount(NcDatetime, {
				props: {
					timestamp: time,
				},
			})

			expect(wrapper.vm.currentTime).toEqual(time)
			expect(wrapper.element.textContent).toContain('now')
		})

		it('shows seconds from now (updating)', async () => {
			const time = Date.UTC(2023, 5, 23, 14, 30, 30)
			let currentTime = Date.UTC(2023, 5, 23, 14, 30, 33)
			Date.now = jest.fn(() => new Date(currentTime).valueOf())
			const wrapper = mount(NcDatetime, {
				props: {
					timestamp: time,
				},
			})

			expect(wrapper.vm.currentTime).toEqual(currentTime)
			expect(wrapper.element.textContent).toContain('3 seconds')
			currentTime = Date.UTC(2023, 5, 23, 14, 30, 34)
			// wait for timer
			await new Promise((resolve) => setTimeout(resolve, 1100))
			expect(wrapper.element.textContent).toContain('4 seconds')
		})

		it('shows seconds from now - also as short variant', () => {
			const time = Date.UTC(2023, 5, 23, 14, 30, 30)
			const currentTime = Date.UTC(2023, 5, 23, 14, 30, 33)
			Date.now = jest.fn(() => new Date(currentTime).valueOf())
			const wrapper = mount(NcDatetime, {
				props: {
					timestamp: time,
					relativeTime: 'short',
				},
			})

			expect(wrapper.vm.currentTime).toEqual(currentTime)
			expect(wrapper.element.textContent).toContain('3 sec.')
		})

		it('shows minutes from now', () => {
			const time = Date.UTC(2023, 5, 23, 14, 30, 30)
			const currentTime = Date.UTC(2023, 5, 23, 14, 33, 30)
			Date.now = jest.fn(() => new Date(currentTime).valueOf())
			const wrapper = mount(NcDatetime, {
				props: {
					timestamp: time,
				},
			})

			expect(wrapper.vm.currentTime).toEqual(currentTime)
			expect(wrapper.element.textContent).toContain('3 minutes')
		})

		it('shows hours from now', () => {
			const time = Date.UTC(2023, 5, 23, 14, 30, 30)
			const currentTime = Date.UTC(2023, 5, 23, 17, 30, 30)
			Date.now = jest.fn(() => new Date(currentTime).valueOf())
			const wrapper = mount(NcDatetime, {
				props: {
					timestamp: time,
				},
			})

			expect(wrapper.vm.currentTime).toEqual(currentTime)
			expect(wrapper.element.textContent).toContain('3 hours')
		})

		it('shows weeks from now', () => {
			const time = Date.UTC(2023, 5, 23, 14, 30, 30)
			const currentTime = Date.UTC(2023, 6, 13, 14, 30, 30)
			Date.now = jest.fn(() => new Date(currentTime).valueOf())
			const wrapper = mount(NcDatetime, {
				props: {
					timestamp: time,
				},
			})

			expect(wrapper.vm.currentTime).toEqual(currentTime)
			expect(wrapper.element.textContent).toContain('3 weeks')
		})

		it('shows years from now', () => {
			const time = Date.UTC(2023, 5, 23, 14, 30, 30)
			const time2 = Date.UTC(2022, 5, 23, 14, 30, 30)
			const currentTime = Date.UTC(2024, 6, 13, 14, 30, 30)
			Date.now = jest.fn(() => new Date(currentTime).valueOf())

			const wrapper = mount(NcDatetime, {
				props: {
					timestamp: time,
				},
			})
			const wrapper2 = mount(NcDatetime, {
				props: {
					timestamp: time2,
				},
			})

			expect(wrapper.vm.currentTime).toEqual(currentTime)
			expect(wrapper2.vm.currentTime).toEqual(currentTime)
			expect(wrapper.element.textContent).toContain('last year')
			expect(wrapper2.element.textContent).toContain('2 years')
		})
	})
})
