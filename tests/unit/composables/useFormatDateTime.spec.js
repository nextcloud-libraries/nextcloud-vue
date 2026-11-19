/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { computed, nextTick, ref } from 'vue'
import { useFormatRelativeTime } from '../../../src/composables/useFormatDateTime/index.ts'

describe('useFormatRelativeTime composable', () => {
	const time = Date.parse('2025-01-01T00:00:00Z')

	beforeAll(() => vi.useFakeTimers())
	beforeEach(() => {
		// composables of previous tests are never unmounted, so drop their pending timers
		vi.clearAllTimers()
		vi.setSystemTime(time + 60000)
	})

	it('works with timestamp', () => {
		const formatted = useFormatRelativeTime(time)
		expect(formatted.value).toBe('1 minute ago')
	})

	it('works with computed timestamp', () => {
		const formatted = useFormatRelativeTime(computed(() => time))
		expect(formatted.value).toBe('1 minute ago')
	})

	it('works with a date object', () => {
		const formatted = useFormatRelativeTime(new Date(time))
		expect(formatted.value).toBe('1 minute ago')
	})

	it('works with computed date object', () => {
		const formatted = useFormatRelativeTime(computed(() => new Date(time)))
		expect(formatted.value).toBe('1 minute ago')
	})

	it('updates the time', () => {
		vi.setSystemTime(time + 6000)

		const formatted = useFormatRelativeTime(time)
		expect(formatted.value).toBe('6 seconds ago')
		vi.advanceTimersByTime(6000)
		expect(formatted.value).toBe('12 seconds ago')
	})

	it('can stop and restart the interval', async () => {
		const options = ref({})
		const formatted = useFormatRelativeTime(time, options)
		expect(formatted.value).toBe('1 minute ago')

		// wait one minute
		await vi.advanceTimersByTimeAsync(60000)
		expect(formatted.value).toBe('2 minutes ago')

		// disable update and wait 2 minutes
		options.value.update = false
		await vi.advanceTimersByTimeAsync(120000)
		expect(formatted.value).toBe('2 minutes ago')

		// reenable update and wait until next timer
		delete options.value.update
		// request the next tick
		nextTick()
		// and wait for it (Vue's computed calculation)
		await vi.advanceTimersToNextTimerAsync()
		expect(formatted.value).toBe('4 minutes ago')
	})

	it.each`
	name                 | timestamp
	${'NaN'}             | ${Number.NaN}
	${'Infinity'}        | ${Number.POSITIVE_INFINITY}
	${'-Infinity'}       | ${Number.NEGATIVE_INFINITY}
	${'an invalid date'} | ${new Date('not a date')}
	${'out of range'}    | ${new Date(8.64e15 + 1)}
	`('handles $name', ({ timestamp }) => {
		const formatted = useFormatRelativeTime(timestamp)
		expect(formatted.value).toBe('Invalid date')
	})

	it('does not schedule updates for an invalid date', async () => {
		const formatted = useFormatRelativeTime(Number.NaN)
		expect(formatted.value).toBe('Invalid date')
		expect(vi.getTimerCount()).toBe(0)

		await vi.advanceTimersByTimeAsync(60000)
		expect(formatted.value).toBe('Invalid date')
	})

	it('recovers when the timestamp becomes valid again', async () => {
		const timestamp = ref(Number.NaN)
		const formatted = useFormatRelativeTime(timestamp)
		expect(formatted.value).toBe('Invalid date')

		timestamp.value = time
		await nextTick()
		expect(formatted.value).toBe('1 minute ago')

		// updates are scheduled again
		await vi.advanceTimersByTimeAsync(60000)
		expect(formatted.value).toBe('2 minutes ago')
	})

	it('handles a timestamp becoming invalid', async () => {
		const timestamp = ref(time)
		const formatted = useFormatRelativeTime(timestamp)
		expect(formatted.value).toBe('1 minute ago')

		timestamp.value = Number.NaN
		await nextTick()
		expect(formatted.value).toBe('Invalid date')
	})

	it.each`
	format      | expected
	${'long'}   | ${'a few seconds ago'}
	${'short'}  | ${'seconds ago'}
	${'narrow'} | ${'sec. ago'}
	`('can ignore seconds', ({ format, expected }) => {
		const time = Date.parse('2025-01-01T00:00:00Z')
		vi.setSystemTime(time + 6000)

		const options = { ignoreSeconds: true, relativeTime: format }
		const formatted = useFormatRelativeTime(time, options)
		expect(formatted.value).toBe(expected)
	})
})
