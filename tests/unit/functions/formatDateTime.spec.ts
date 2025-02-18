/* eslint-disable no-multi-spaces */
/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { formatDateTime, type FormatDateOptions } from '../../../src/functions/formatDateTime/index.ts'

const NOW_DATE = new Date('2022-02-02T22:22:22Z')
const NOW = NOW_DATE.getTime()

describe('formatDateTime()', () => {
	beforeAll(() => {
		jest.spyOn(console, 'error').mockImplementation(() => {})
		jest.useFakeTimers()
			.setSystemTime(NOW_DATE)
	})

	afterAll(() => {
		jest.restoreAllMocks()
			.useRealTimers()
	})

	test.each([
		[NOW_DATE,                            'now'],
		[NOW,                                 'now'],
		[NOW -                      5 * 1000, '5 seconds ago'],
		[NOW -                 2 * 60 * 1000, '2 minutes ago'],
		[NOW -            3 * 60 * 60 * 1000, '3 hours ago'],
		[NOW -       4 * 24 * 60 * 60 * 1000, '4 days ago'],
		[NOW -      14 * 24 * 60 * 60 * 1000, '2 weeks ago'],
		[NOW - 2 * 365 * 24 * 60 * 60 * 1000, '2 years ago'],
	])('Shows relative times', (time: Date|number, expected: string) => {
		const formattedTime = formatDateTime(time, { ignoreSeconds: false, relativeTime: 'long' })
		expect(formattedTime).toContain(expected)
	})

	test.each([
		['long', 'a few seconds ago'],
		['short', 'seconds ago'],
		['narrow', 'sec. ago'],
	] as const)('Shows different relative times', (relativeTime: FormatDateOptions['relativeTime'], expected: string) => {
		const formattedTime = formatDateTime(NOW - 5000, { ignoreSeconds: true, relativeTime })
		expect(formattedTime).toBe(expected)
	})

	test.each([
		['50 seconds',                 50 * 1000], // t  < 60s      -> seconds
		['1 minute',                   60 * 1000], // t >= 60s      -> minutes
		['59 minutes',            59 * 60 * 1000], // t  < 60min    -> minutes
		['1 hour',                60 * 60 * 1000], // t >= 60min    -> hours
		['23 hours',         23 * 60 * 60 * 1000], // t  < 24h      -> hours
		['tomorrow',         24 * 60 * 60 * 1000], // t >= 24h      -> days
		['6 day',       6 *  24 * 60 * 60 * 1000], // t  <  7days   -> days
		['next week',   7 *  24 * 60 * 60 * 1000], // t >=  7days   -> weeks
		['4 weeks',    27 *  24 * 60 * 60 * 1000], // t  < 28days   -> weeks
		['next month', 28 *  24 * 60 * 60 * 1000], // t >= 28days   -> months
		['11 months', 335 *  24 * 60 * 60 * 1000], // t  < 12months -> months
		['next year', 360 *  24 * 60 * 60 * 1000], // t >= 12months -> years
	])('relative time intervals', (expected: string, time: number) => {
		const formattedTime = formatDateTime(NOW + time, { ignoreSeconds: false, relativeTime: 'long' })
		expect(formattedTime).toContain(expected)
	})
})
