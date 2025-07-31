/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { setLanguage } from '@nextcloud/l10n'
import { mount } from '@vue/test-utils'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import NcDateTime from '../../../../src/components/NcDateTime/NcDateTime.vue'

const getCanonicalLocale = vi.hoisted(() => vi.fn(() => 'en-US'))

vi.mock('@nextcloud/l10n', async (original) => ({
	...(await original()),
	getCanonicalLocale,
}))

describe('NcDateTime.vue', () => {
	'use strict'

	beforeAll(() => vi.useFakeTimers())
	afterAll(() => vi.useRealTimers())

	it('Sets the title property correctly', () => {
		const time = Date.UTC(2023, 5, 23, 14, 30)
		vi.setSystemTime(new Date(time))
		const wrapper = mount(NcDateTime, {
			props: {
				timestamp: time,
			},
		})

		expect(wrapper.element.hasAttribute('title')).toBe(true)
		expect(wrapper.element.getAttribute('title')).toMatch('6/23/23, 2:30:00 PM')
	})

	it('Can set format of the title property', () => {
		const time = Date.UTC(2023, 5, 23, 14, 30)
		vi.setSystemTime(new Date(time))
		const wrapper = mount(NcDateTime, {
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
		vi.setSystemTime(new Date(time))
		const wrapper = mount(NcDateTime, {
			props: {
				timestamp: time,
				relativeTime: false,
			},
		})

		expect(wrapper.element.hasAttribute('title')).toBe(true)
		expect(wrapper.element.textContent).toMatch(wrapper.element.getAttribute('title'))
	})

	describe('Work with different locales', () => {
		beforeEach(() => {
			getCanonicalLocale.mockImplementationOnce(() => 'de-DE')
		})

		/**
		 * Use German locale as it uses a different date format than English
		 */
		it('Works with absolute timestamps', () => {
			const time = Date.UTC(2023, 5, 23, 14, 30)
			vi.setSystemTime(time)
			const wrapper = mount(NcDateTime, {
				props: {
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
			setLanguage('de')
		})
		afterAll(() => {
			// revert mock
			setLanguage('en')
		})

		it('Works with relative timestamps', () => {
			const now = Date.UTC(2023, 5, 24, 14, 0)
			vi.setSystemTime(now)

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
			vi.setSystemTime(new Date(time))
			const wrapper = mount(NcDateTime, {
				props: {
					timestamp: time,
				},
			})

			expect(wrapper.element.textContent).toContain('now')
		})

		it('shows seconds from now (updating)', async () => {
			const time = Date.UTC(2023, 5, 23, 14, 30, 30)
			vi.setSystemTime(Date.UTC(2023, 5, 23, 14, 30, 33))
			const wrapper = mount(NcDateTime, {
				props: {
					timestamp: time,
				},
			})

			expect(wrapper.element.textContent).toContain('3 seconds')
			await vi.advanceTimersByTimeAsync(1020)
			await nextTick()
			expect(wrapper.element.textContent).toContain('4 seconds')
		})

		it('shows seconds from now - also as narrow variant', () => {
			const time = Date.UTC(2023, 5, 23, 14, 30, 30)
			const currentTime = Date.UTC(2023, 5, 23, 14, 30, 33)
			vi.setSystemTime(currentTime)
			const wrapper = mount(NcDateTime, {
				props: {
					timestamp: time,
					relativeTime: 'narrow',
				},
			})

			expect(wrapper.element.textContent).toContain('3s ago')
		})

		it('shows minutes from now', () => {
			const time = Date.UTC(2023, 5, 23, 14, 30, 30)
			const currentTime = Date.UTC(2023, 5, 23, 14, 33, 30)
			vi.setSystemTime(currentTime)
			const wrapper = mount(NcDateTime, {
				props: {
					timestamp: time,
				},
			})

			expect(wrapper.element.textContent).toContain('3 minutes')
		})

		it('shows hours from now', () => {
			const time = Date.UTC(2023, 5, 23, 14, 30, 30)
			const currentTime = Date.UTC(2023, 5, 23, 17, 30, 30)
			vi.setSystemTime(currentTime)
			const wrapper = mount(NcDateTime, {
				props: {
					timestamp: time,
				},
			})

			expect(wrapper.element.textContent).toContain('3 hours')
		})

		it('shows days from now', () => {
			const time = Date.UTC(2023, 5, 21, 20, 30, 30)
			const currentTime = Date.UTC(2023, 5, 23, 17, 30, 30)
			vi.setSystemTime(currentTime)
			const wrapper = mount(NcDateTime, {
				props: {
					timestamp: time,
				},
			})

			expect(wrapper.element.textContent).toContain('2 days')
		})

		it('shows weeks from now', () => {
			const time = Date.UTC(2023, 5, 23, 14, 30, 30)
			const currentTime = Date.UTC(2023, 6, 13, 14, 30, 30)
			vi.setSystemTime(currentTime)
			const wrapper = mount(NcDateTime, {
				props: {
					timestamp: time,
				},
			})

			expect(wrapper.element.textContent).toContain('3 weeks')
		})
	})
})
