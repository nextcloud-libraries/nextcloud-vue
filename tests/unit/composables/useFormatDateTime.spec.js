/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useFormatRelativeTime } from '../../../src/composables/useFormatDateTime/index.ts'
import { computed, nextTick, ref } from 'vue'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

describe('useFormatRelativeTime composable', () => {
	const time = Date.parse('2025-01-01T00:00:00Z')

	beforeAll(() => vi.useFakeTimers())
	beforeEach(() => vi.setSystemTime(time + 60000))

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
