/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useFormatDateTime } from '../../../src/composables/useFormatDateTime.ts'
import { isRef, nextTick, ref } from 'vue'

import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

describe('useFormatDateTime composable', () => {
	beforeAll(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {})
	})
	afterAll(() => {
		vi.restoreAllMocks()
	})

	it('Should provide formatted time and options as ref', () => {
		const ctx = useFormatDateTime()
		expect(isRef(ctx.formattedTime)).toBe(true)
		expect(isRef(ctx.formattedFullTime)).toBe(true)
		expect(isRef(ctx.options)).toBe(true)
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
		expect(ctx.formattedTime.value).toContain('2 month')
		time.value = Date.now() - 2 * 365 * 24 * 60 * 60 * 1000
		await nextTick()
		expect(ctx.formattedTime.value).toContain('2 years')
	})

	it('Shows different relative times', async () => {
		const ctx = useFormatDateTime(Date.now() - 5000, { ignoreSeconds: true, relativeTime: 'long' })
		expect(ctx.formattedTime.value).toBe('a few seconds ago')
		ctx.options.value.relativeTime = 'short'
		await nextTick()
		expect(ctx.formattedTime.value).toBe('seconds ago')
		ctx.options.value.relativeTime = 'narrow'
		await nextTick()
		expect(ctx.formattedTime.value).toBe('sec. ago')
	})

	it('Should be reactive on options change', async () => {
		const ctx = useFormatDateTime(Date.now() - 5000, { ignoreSeconds: false })
		expect(ctx.formattedTime.value).toContain('sec')
		ctx.options.value.ignoreSeconds = true
		await nextTick()
		expect(ctx.formattedTime.value).toBe('a few seconds ago')
	})
})
