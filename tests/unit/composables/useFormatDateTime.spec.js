/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useFormatDateTime, useFormatRelativeTime } from '../../../src/composables/useFormatDateTime/index.ts'
import { computed, isRef, nextTick, ref } from 'vue'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

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

describe('useFormatDateTime composable', () => {
	beforeAll(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {})
		vi.useFakeTimers({ now: new Date('2025-01-01T00:00:00Z') })
	})

	afterAll(() => {
		vi.restoreAllMocks()
	})

	it('Should provide formatted time and options as ref', () => {
		const ctx = useFormatDateTime()
		expect(isRef(ctx.formattedTime)).toBe(true)
		expect(isRef(ctx.formattedFullTime)).toBe(true)
	})

	it('Shows relative times', async () => {
		const time = ref(Date.now())
		const ctx = useFormatDateTime(time, { ignoreSeconds: false, relativeTime: 'long' })
		expect(ctx.formattedTime.value).toContain('now')
		time.value = Date.now() - 5000
		await nextTick()
		expect(ctx.formattedTime.value).toMatch(/\d sec/)
		time.value = Date.now() - 120000
		await nextTick()
		expect(ctx.formattedTime.value).toContain('2 minutes')
		time.value = Date.now() - 2 * 60 * 60 * 1000
		await nextTick()
		expect(ctx.formattedTime.value).toContain('2 hours')
		time.value = Date.now() - 2 * 24 * 60 * 60 * 1000
		await nextTick()
		expect(ctx.formattedTime.value).toContain('2 days')
		time.value = Date.now() - 2 * 7 * 24 * 60 * 60 * 1000
		await nextTick()
		expect(ctx.formattedTime.value).toContain('2 weeks')
		time.value = Date.now() - 2 * 30 * 24 * 60 * 60 * 1000
		await nextTick()
		expect(ctx.formattedTime.value).toContain('November 2')
		time.value = Date.now() - 2 * 365 * 24 * 60 * 60 * 1000
		await nextTick()
		expect(ctx.formattedTime.value).toContain('January 2023')
	})

	it('Shows different relative times', async () => {
		const options = ref({ ignoreSeconds: true, relativeTime: 'long' })
		const ctx = useFormatDateTime(Date.now() - 5000, options)
		expect(ctx.formattedTime.value).toBe('a few seconds ago')
		options.value.relativeTime = 'short'
		await nextTick()
		expect(ctx.formattedTime.value).toBe('seconds ago')
		options.value.relativeTime = 'narrow'
		await nextTick()
		expect(ctx.formattedTime.value).toBe('sec. ago')
	})

	it('Should be reactive on options change', async () => {
		const options = ref({ ignoreSeconds: false })
		const ctx = useFormatDateTime(Date.now() - 5000, options)

		expect(ctx.formattedTime.value).toContain('sec')

		options.value.ignoreSeconds = true
		await nextTick()
		expect(ctx.formattedTime.value).toBe('a few seconds ago')
	})
})
