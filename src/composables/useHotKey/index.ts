/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { onKeyStroke } from '@vueuse/core'

const disableKeyboardShortcuts = window.OCP?.Accessibility?.disableKeyboardShortcuts?.()
const isMac = /mac|ipad|iphone|darwin/i.test(navigator.userAgent)
const derivedKeysRegex = /^[a-zA-Z0-9]$/
const nonAsciiPrintableRegex = /^[^\x20-\x7F]$/

export interface UseHotKeyOptions {
	/** Make key filter case sensitive */
	caseSensitive?: boolean

	/** Prevent default behavior of key stroke */
	prevent?: boolean

	/** Stop the event bubbling */
	stop?: boolean

	/** Also listen for keyup event */
	push?: boolean

	/**
	 * If set then the callback is only called when the shift key is (not) pressed.
	 * When left `undefined` a pressed shift key is ignored (callback is run with and without shift pressed).
	 */
	shift?: boolean

	/**
	 * Only run the callback if the control key is (not-)pressed.
	 * Undefined will be handled the same as `false` and will only run the callback if the 'ctrl' key is NOT pressed.
	 */
	ctrl?: boolean

	/**
	 * If set the callback is only executed if the alt key is (not-)pressed
	 * Undefined will be handled the same as `false` and will only run the callback if the 'alt' key is NOT pressed.
	 */
	alt?: boolean
}

/**
 * Check if event target (active element) is editable (allows input from keyboard) or NcModal is open
 * If true, a hot key should not trigger the callback
 *
 * @todo Discuss if we should abort on another interactive elements (button, a, e.t.c)
 *
 * @param event keyboard event
 * @return Whether it should prevent callback
 */
function shouldIgnoreEvent(event: KeyboardEvent): boolean {
	if (!(event.target instanceof HTMLElement)
		|| event.target instanceof HTMLInputElement
		|| event.target instanceof HTMLTextAreaElement
		|| event.target instanceof HTMLSelectElement
		|| event.target.isContentEditable) {
		return true
	}
	/** Abort if any modal/dialog opened */
	return document.getElementsByClassName('modal-mask').length !== 0
}

type KeyboardEventHandler = (event: KeyboardEvent) => void

/**
 * Implementation of the event handler.
 *
 * @param callback The callback to run
 * @param options hot key options
 */
function eventHandler(callback: KeyboardEventHandler, options: UseHotKeyOptions): KeyboardEventHandler {
	return (event: KeyboardEvent) => {
		const ctrlKeyPressed = isMac ? event.metaKey : event.ctrlKey
		if (ctrlKeyPressed !== Boolean(options.ctrl)) {
			/**
			 * Ctrl is required and not pressed, or the opposite
			 * As on macOS 'cmd' key is used instead of 'ctrl' key for most key combinations,
			 * 'event.metaKey' should be checked
			 */
			return
		} else if (event.altKey !== Boolean(options.alt)) {
			// Alt is required and not pressed, or the opposite
			return
		} else if (options.shift !== undefined && event.shiftKey !== Boolean(options.shift)) {
			/**
			 * Shift is required and not pressed, or the opposite
			 * As shift key is used to type capital letters and alternate characters,
			 * option should be explicitly defined
			 */
			return
		} else if (shouldIgnoreEvent(event)) {
			// Keyboard shortcuts are disabled, because active element assumes input
			return
		}

		if (options.prevent) {
			event.preventDefault()
		}
		if (options.stop) {
			event.stopPropagation()
		}
		callback(event)
	}
}

/**
 * Composable to use keyboard shortcuts in the application.
 * It respects the users accessibility configuration (opt-out shortcuts).
 *
 * @param keysOrFilter - keyboard key(s) to listen to, or filter function or pass `true` for listening to all keys
 * @param callback - callback function
 * @param options - composable options
 * @see docs/composables/usekeystroke.md
 */
export function useHotKey(
	keysOrFilter: true | string | string[] | ((e: KeyboardEvent) => boolean),
	callback = () => {},
	options: UseHotKeyOptions = {},
) {
	if (disableKeyboardShortcuts) {
		// Keyboard shortcuts are disabled
		return () => {}
	}

	/**
	 * Validates event key to expected key
	 *
	 * @param event keyboard event
	 * @param key expected key
	 * @return whether it satisfies expected value or not
	 */
	const validateKeyEvent = (event: KeyboardEvent, key: string): boolean => {
		// If key exactly matches event.key, valid with any caseSensitive option. Do not perform further checks
		if (event.key === key) {
			return true
		}

		// If key and event.key are in different cases, invalid with caseSensitive = true. Do not perform further checks
		if (options.caseSensitive) {
			const isKeyInLowerCase = key === key.toLowerCase()
			const isEventKeyInLowerCase = event.key === event.key.toLowerCase()
			if (isKeyInLowerCase !== isEventKeyInLowerCase) {
				return false
			}
		}

		// If received event.key is not a printable ASCII character code (character code 32-127),
		// try to derive it from event.code and match with expected key
		if (derivedKeysRegex.test(key) && nonAsciiPrintableRegex.test(event.key)) {
			return event.code.replace(/^(?:Key|Digit|Numpad)/, '') === key.toUpperCase()
		}

		return event.key.toLowerCase() === key.toLowerCase()
	}

	/**
	 * Filter function for the listener
	 * see https://github.com/vueuse/vueuse/blob/v11.3.0/packages/core/onKeyStroke/index.ts#L21-L32
	 *
	 * @param event keyboard event
	 * @return Whether it satisfies expected value or not
	 */
	const keyFilter = (event: KeyboardEvent): boolean => {
		if (typeof keysOrFilter === 'function') {
			return keysOrFilter(event)
		} else if (typeof keysOrFilter === 'string') {
			return validateKeyEvent(event, keysOrFilter)
		} else if (Array.isArray(keysOrFilter)) {
			return keysOrFilter.some((key) => validateKeyEvent(event, key))
		} else {
			return true
		}
	}

	const stopKeyDown = onKeyStroke(keyFilter, eventHandler(callback, options), {
		eventName: 'keydown',
		dedupe: true,
		passive: !options.prevent,
	})

	const stopKeyUp = options.push
		? onKeyStroke(keyFilter, eventHandler(callback, options), {
				eventName: 'keyup',
				passive: !options.prevent,
			})
		: () => {}

	return () => {
		stopKeyDown()
		stopKeyUp()
	}
}
