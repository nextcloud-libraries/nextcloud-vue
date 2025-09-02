/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { afterEach, describe, expect, it, jest } from '@jest/globals'
import { useHotKey } from '../../../src/composables/useHotKey/index.ts'

describe('useHotKey', () => {
	const mockCallback = jest.fn()

	function triggerKeyDown(eventPayload, target = document.body) {
		target.dispatchEvent(new KeyboardEvent('keydown', eventPayload))
	}

	function triggerKeyUp(eventPayload, target = document.body) {
		target.dispatchEvent(new KeyboardEvent('keyup', eventPayload))
	}

	afterEach(() => {
		mockCallback.mockReset()
	})

	it('should register listener and invoke callback', () => {
		const stop = useHotKey(true, mockCallback)
		triggerKeyDown({ key: 'a', code: 'KeyA' })
		stop()

		expect(mockCallback).toHaveBeenCalled()
	})

	it('should not invoke callback, when on interactive elements', () => {
		const stop = useHotKey(true, mockCallback)
		const input = document.createElement('input')
		document.body.appendChild(input)
		triggerKeyDown({ key: 'a', code: 'KeyA' }, input)
		stop()

		expect(mockCallback).not.toHaveBeenCalled()
	})

	describe('options', () => {
		it('should accept array of keys and invoke callback for all of them', () => {
			const stop = useHotKey(['a', 'b'], mockCallback)
			triggerKeyDown({ key: 'a', code: 'KeyA' })
			triggerKeyDown({ key: 'b', code: 'KeyB' })
			stop()

			expect(mockCallback).toHaveBeenCalledTimes(2)
		})

		it('should accept filter function and invoke callback when passed', () => {
			const stop = useHotKey((event) => ['a', 'b'].includes(event.key), mockCallback)
			triggerKeyDown({ key: 'a', code: 'KeyA' })
			triggerKeyDown({ key: 'b', code: 'KeyB' })
			stop()

			expect(mockCallback).toHaveBeenCalledTimes(2)
		})

		it('should register only keydown listener and invoke callback', () => {
			const stop = useHotKey('a', mockCallback)
			triggerKeyDown({ key: 'a', code: 'KeyA' })
			triggerKeyUp({ key: 'a', code: 'KeyA' })
			stop()

			expect(mockCallback).toHaveBeenCalledTimes(1)
		})

		it('should register push listeners and invoke callback', () => {
			const stop = useHotKey('a', mockCallback, { push: true })
			triggerKeyDown({ key: 'a', code: 'KeyA' })
			triggerKeyUp({ key: 'a', code: 'KeyA' })
			stop()

			expect(mockCallback).toHaveBeenCalledTimes(2)
		})

		it('should register listener with Shift modifier and invoke callback', () => {
			const stop = useHotKey('a', mockCallback, { shift: true })
			triggerKeyDown({ key: 'a', code: 'KeyA', shiftKey: false })
			triggerKeyDown({ key: 'A', code: 'KeyA', shiftKey: true })
			stop()

			expect(mockCallback).toHaveBeenCalledTimes(1)
		})

		it('should register listener with Alt modifier and invoke callback', () => {
			const stop = useHotKey('a', mockCallback, { alt: true })
			triggerKeyDown({ key: 'a', code: 'KeyA', altKey: false })
			triggerKeyDown({ key: 'A', code: 'KeyA', altKey: true })
			stop()

			expect(mockCallback).toHaveBeenCalledTimes(1)
		})

		it('should register listener with Ctrl (Cmd on Mac) modifier and invoke callback', () => {
			const stop = useHotKey('a', mockCallback, { ctrl: true })
			triggerKeyDown({ key: 'a', code: 'KeyA', ctrlKey: false, metaKey: false })
			triggerKeyDown({ key: 'A', code: 'KeyA', ctrlKey: true, metaKey: true })
			stop()

			expect(mockCallback).toHaveBeenCalledTimes(1)
		})
	})

	describe('validation', () => {
		it.each([
			// Latin characters
			['a', { key: 'a', code: 'KeyA' }, {}],
			['a', { key: 'A', code: 'KeyA' }, {}],
			// Latin characters with different layout
			['a', { key: 'a', code: 'KeyQ' }, {}],
			// Non-Latin characters
			['a', { key: 'ф', code: 'KeyA' }, {}],
			['a', { key: 'Ф', code: 'KeyA' }, {}],
			['a', { key: 'ש', code: 'KeyA' }, {}],
			// Digits
			['1', { key: '1', code: 'Digit1' }, {}],
			['2', { key: '2', code: 'Numpad2' }, {}],
			// Non-Arabic numeral digits
			['1', { key: '일', code: 'Digit1' }, {}],
			['2', { key: '٢', code: 'Numpad2' }, {}],
			// With caseSensitive option
			['a', { key: 'a', code: 'KeyA' }, { caseSensitive: true }],
			['a', { key: 'ф', code: 'KeyA' }, { caseSensitive: true }],
			['a', { key: 'ש', code: 'KeyA' }, { caseSensitive: true }],
		])('should pass validation for %s  => pressed %o', (key, eventKey, options) => {
			const stop = useHotKey(key, mockCallback, options)
			triggerKeyDown(eventKey)
			stop()

			expect(mockCallback).toHaveBeenCalled()
		})

		it.each([
			// Wrong key
			['a', { key: 'B', code: 'KeyB' }, {}],
			['a', { key: 'b', code: 'KeyB' }, { caseSensitive: true }],
			// Wrong case
			['a', { key: 'A', code: 'KeyA' }, { caseSensitive: true }],
			['a', { key: 'Ф', code: 'KeyA' }, { caseSensitive: true }],
		])('should not pass validation for %s => pressed %o', (key, eventKey, options) => {
			const stop = useHotKey(key, mockCallback, options)
			triggerKeyDown(eventKey)
			stop()

			expect(mockCallback).not.toHaveBeenCalled()
		})
	})
})
