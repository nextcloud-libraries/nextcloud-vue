/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import NcDateTime from '../../../../src/components/NcDateTime/NcDateTime.vue'
import { nextTick } from 'vue'

describe('NcDateTime.vue', () => {
	'use strict'

	beforeAll(() => jest.useFakeTimers())
	afterAll(() => jest.useRealTimers())

	it('Sets the title property correctly', () => {
		const time = Date.UTC(2023, 5, 23, 14, 30)
		jest.setSystemTime(new Date(time))
		const wrapper = mount(NcDateTime, {
			propsData: {
				timestamp: time,
			},
		})

		expect(wrapper.element.hasAttribute('title')).toBe(true)
		expect(wrapper.element.getAttribute('title')).toMatch('6/23/23, 2:30:00 PM')
	})

	it('Can set format of the title property', () => {
		const time = Date.UTC(2023, 5, 23, 14, 30)
		jest.setSystemTime(new Date(time))
		const wrapper = mount(NcDateTime, {
			propsData: {
				timestamp: time,
				format: { dateStyle: 'long' },
			},
		})

		expect(wrapper.element.hasAttribute('title')).toBe(true)
		expect(wrapper.element.getAttribute('title')).toMatch('June 23, 2023')
	})

	it('Can disable relative time', () => {
		const time = Date.UTC(2023, 5, 23, 14, 30)
		jest.setSystemTime(new Date(time))
		const wrapper = mount(NcDateTime, {
			propsData: {
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
		it('Works with absolute timestamps', () => {
			const time = Date.UTC(2023, 5, 23, 14, 30)
			jest.setSystemTime(time)
			const wrapper = mount(NcDateTime, {
				propsData: {
					timestamp: time,
				},
			})

			expect(wrapper.element.hasAttribute('title')).toBe(true)
			expect(wrapper.element.getAttribute('title')).toMatch('23.06.23, 14:30:00')
		})
	})

	describe('Work with different languages', () => {
		beforeAll(() => {
			// mock the language
			document.documentElement.lang = 'de'
		})
		afterAll(() => {
			// revert mock
			document.documentElement.lang = 'en'
		})

		it('Works with relative timestamps', () => {
			const now = Date.UTC(2023, 5, 24, 14, 0)
			jest.setSystemTime(now)

			const yesterday = Date.UTC(2023, 5, 23, 13, 59)
			const wrapper = mount(NcDateTime, {
				propsData: {
					timestamp: yesterday,
				},
			})

			expect(wrapper.text()).toMatch('gestern')
		})
	})

	describe('Shows relative time', () => {
		it('works with currentTime == timestamp', () => {
			const time = Date.UTC(2023, 5, 23, 14, 30)
			jest.setSystemTime(new Date(time))
			const wrapper = mount(NcDateTime, {
				propsData: {
					timestamp: time,
				},
			})

			expect(wrapper.element.textContent).toContain('now')
		})

		it('shows seconds from now (updating)', async () => {
			const time = Date.UTC(2023, 5, 23, 14, 30, 30)
			jest.setSystemTime(Date.UTC(2023, 5, 23, 14, 30, 33))
			const wrapper = mount(NcDateTime, {
				propsData: {
					timestamp: time,
				},
			})

			expect(wrapper.element.textContent).toContain('3 seconds')
			await jest.advanceTimersByTimeAsync(1020)
			await nextTick()
			expect(wrapper.element.textContent).toContain('4 seconds')
		})

		it('shows seconds from now - also as narrow variant', () => {
			const time = Date.UTC(2023, 5, 23, 14, 30, 30)
			const currentTime = Date.UTC(2023, 5, 23, 14, 30, 33)
			jest.setSystemTime(currentTime)
			const wrapper = mount(NcDateTime, {
				propsData: {
					timestamp: time,
					relativeTime: 'narrow',
				},
			})

			expect(wrapper.element.textContent).toContain('3s ago')
		})

		it('shows minutes from now', () => {
			const time = Date.UTC(2023, 5, 23, 14, 30, 30)
			const currentTime = Date.UTC(2023, 5, 23, 14, 33, 30)
			jest.setSystemTime(currentTime)
			const wrapper = mount(NcDateTime, {
				propsData: {
					timestamp: time,
				},
			})

			expect(wrapper.element.textContent).toContain('3 minutes')
		})

		it('shows hours from now', () => {
			const time = Date.UTC(2023, 5, 23, 14, 30, 30)
			const currentTime = Date.UTC(2023, 5, 23, 17, 30, 30)
			jest.setSystemTime(currentTime)
			const wrapper = mount(NcDateTime, {
				propsData: {
					timestamp: time,
				},
			})

			expect(wrapper.element.textContent).toContain('3 hours')
		})

		it('shows days from now', () => {
			const time = Date.UTC(2023, 5, 21, 20, 30, 30)
			const currentTime = Date.UTC(2023, 5, 23, 17, 30, 30)
			jest.setSystemTime(currentTime)
			const wrapper = mount(NcDateTime, {
				propsData: {
					timestamp: time,
				},
			})

			expect(wrapper.element.textContent).toContain('2 days')
		})

		it('shows weeks from now', () => {
			const time = Date.UTC(2023, 5, 23, 14, 30, 30)
			const currentTime = Date.UTC(2023, 6, 13, 14, 30, 30)
			jest.setSystemTime(currentTime)
			const wrapper = mount(NcDateTime, {
				propsData: {
					timestamp: time,
				},
			})

			expect(wrapper.element.textContent).toContain('3 weeks')
		})

		it('shows months from now', () => {
			const time = Date.UTC(2023, 1, 23, 14, 30, 30)
			const currentTime = Date.UTC(2023, 6, 13, 14, 30, 30)
			jest.setSystemTime(currentTime)
			const wrapper = mount(NcDateTime, {
				propsData: {
					timestamp: time,
				},
			})

			expect(wrapper.element.textContent).toContain('5 months')
		})

		it('shows years from now', () => {
			const time = Date.UTC(2023, 5, 23, 14, 30, 30)
			const time2 = Date.UTC(2022, 5, 23, 14, 30, 30)
			const currentTime = Date.UTC(2024, 6, 13, 14, 30, 30)
			jest.setSystemTime(currentTime)

			const wrapper = mount(NcDateTime, {
				propsData: {
					timestamp: time,
				},
			})
			const wrapper2 = mount(NcDateTime, {
				propsData: {
					timestamp: time2,
				},
			})

			expect(wrapper.element.textContent).toContain('last year')
			expect(wrapper2.element.textContent).toContain('2 years')
		})
	})
})
