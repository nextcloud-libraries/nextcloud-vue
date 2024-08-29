/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useFormatDateTime } from '../../../src/composables/useFormatDateTime.ts'
import { isRef, nextTick, ref } from 'vue'

describe('useFormatDateTime composable', () => {
	beforeAll(() => {
		jest.spyOn(console, 'error').mockImplementation(() => {})
	})
	afterAll(() => {
		jest.restoreAllMocks()
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

	describe('relative time intervals', () => {
		const time = ref(Date.now())
		const ctx = useFormatDateTime(time, { ignoreSeconds: false, relativeTime: 'long' })

		test('t < 60s -> seconds', async () => {
			time.value = Date.now() - (50 * 1000)
			await nextTick()
			expect(ctx.formattedTime.value).toMatch(/\d sec/)
		})

		test('t >= 60s -> minutes', async () => {
			time.value = Date.now() - (60 * 1000)
			await nextTick()
			expect(ctx.formattedTime.value).toMatch(/minute/)
		})

		test('t >= 60min -> hour', async () => {
			time.value = Date.now() - (60 * 60 * 1000)
			await nextTick()
			expect(ctx.formattedTime.value).toMatch(/hour/)
		})

		test('t <= 23h -> hour', async () => {
			time.value = Date.now() - (23 * 60 * 60 * 1000)
			await nextTick()
			expect(ctx.formattedTime.value).toMatch(/hour/)
		})

		test('t >= 24h -> days', async () => {
			time.value = Date.now() - (24 * 60 * 60 * 1000)
			await nextTick()
			expect(ctx.formattedTime.value).toMatch(/day/)
		})

		test('t <= 6days -> days', async () => {
			time.value = Date.now() - (6 * 24 * 60 * 60 * 1000)
			await nextTick()
			expect(ctx.formattedTime.value).toMatch(/day/)
		})

		test('t >= 7 days -> weeks', async () => {
			time.value = Date.now() - (7 * 24 * 60 * 60 * 1000)
			await nextTick()
			expect(ctx.formattedTime.value).toMatch(/week/)
		})

		test('t < 28 days -> weeks', async () => {
			time.value = Date.now() - (21 * 24 * 60 * 60 * 1000)
			await nextTick()
			expect(ctx.formattedTime.value).toMatch(/week/)
		})

		test('t >= 28 days -> months', async () => {
			time.value = Date.now() - (28 * 24 * 60 * 60 * 1000)
			await nextTick()
			expect(ctx.formattedTime.value).toMatch(/month/)
		})

		test('t <= 11 month -> month', async () => {
			time.value = Date.now() - (335 * 24 * 60 * 60 * 1000)
			await nextTick()
			expect(ctx.formattedTime.value).toMatch(/month/)
		})

		test('t >= 12 month -> years', async () => {
			time.value = Date.now() - (365 * 24 * 60 * 60 * 1000)
			await nextTick()
			expect(ctx.formattedTime.value).toMatch(/year/)
		})
	})
})
