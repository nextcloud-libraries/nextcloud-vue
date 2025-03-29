/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { Timer } from '../../../src/utils/Timer.ts'

describe('utils: Timer', () => {

	afterAll(() => vi.useRealTimers())
	beforeAll(() => vi.useFakeTimers())

	it('timer is not started automatically', async () => {
		const cb = vi.fn()
		const timer = new Timer(cb, 500)
		expect(cb).not.toBeCalled()

		await vi.advanceTimersByTimeAsync(501)
		expect(cb).not.toBeCalled()

		timer.clear()
	})

	it('reschedules the timer', async () => {
		const cb = vi.fn()
		;(new Timer(cb, 100)).start()
		expect(cb).not.toBeCalled()

		await vi.advanceTimersByTimeAsync(101)
		expect(cb).toBeCalledTimes(1)
		await vi.advanceTimersByTimeAsync(101)
		expect(cb).toBeCalledTimes(2)
	})

	it('pause the timer', async () => {
		const cb = vi.fn()
		const timer = new Timer(cb, 100)
		timer.start()
		expect(cb).not.toBeCalled()

		await vi.advanceTimersByTimeAsync(101)
		expect(cb).toBeCalledTimes(1)

		timer.pause()
		await vi.advanceTimersByTimeAsync(101)
		await vi.advanceTimersByTimeAsync(101)
		expect(cb).toBeCalledTimes(1)

		timer.clear()
	})

	it('pause and resume the timer', async () => {
		const cb = vi.fn()
		const timer = new Timer(cb, 100)
		timer.start()
		expect(cb).not.toBeCalled()

		await vi.advanceTimersByTimeAsync(150)
		expect(cb).toBeCalledTimes(1)

		timer.pause()
		await vi.advanceTimersByTimeAsync(500)
		expect(cb).toBeCalledTimes(1)

		timer.start()
		// timer was stopped with 50ms after last call so this should be called after just 50 additional
		await vi.advanceTimersByTimeAsync(51)
		expect(cb).toBeCalledTimes(2)

		timer.clear()
	})

	it('clear the timer', async () => {
		const cb = vi.fn()
		const timer = new Timer(cb, 100)
		timer.start()
		expect(cb).not.toBeCalled()

		await vi.advanceTimersByTimeAsync(150)
		expect(cb).toBeCalledTimes(1)

		timer.clear()
		await vi.advanceTimersByTimeAsync(500)
		expect(cb).toBeCalledTimes(1)

		timer.start()
		// was cleared so no call after 50ms
		await vi.advanceTimersByTimeAsync(51)
		expect(cb).toBeCalledTimes(1)
		// but after 100ms
		await vi.advanceTimersByTimeAsync(50)
		expect(cb).toBeCalledTimes(2)

		timer.clear()
	})

	it('report isRunning', async () => {
		const cb = vi.fn()
		const timer = new Timer(cb, 100)
		expect(timer.isRunning).toBe(false)
		timer.start()
		expect(timer.isRunning).toBe(true)
		timer.pause()
		expect(timer.isRunning).toBe(false)
		timer.start()
		expect(timer.isRunning).toBe(true)
		timer.clear()
		expect(timer.isRunning).toBe(false)
	})

	it('gracefully handles exceptions in callback', async () => {
		const spy = vi.spyOn(console, 'warn')
		spy.mockImplementationOnce(() => {})

		const cb = vi.fn(() => { throw new Error('expected') })
		const timer = new Timer(cb, 100)
		timer.start()

		await vi.advanceTimersByTimeAsync(101)
		expect(cb).toBeCalled()
		expect(spy).toBeCalledTimes(1)

		await vi.advanceTimersByTimeAsync(101)
		expect(cb).toBeCalledTimes(2)
		expect(spy).toBeCalledTimes(2)
	})
})
