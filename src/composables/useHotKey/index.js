/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { onKeyStroke } from '@vueuse/core'

const disableKeyboardShortcuts = window.OCP?.Accessibility?.disableKeyboardShortcuts?.()

/**
 * Check if event target (active element) is editable (allows input from keyboard) or NcModal is open
 * If true, a hot key should not trigger the callback
 * TODO discuss if we should abort on another interactive elements (button, a, e.t.c)
 *
 * @param {KeyboardEvent} event keyboard event
 * @return {boolean} whether it should prevent callback
 */
function shouldIgnoreEvent(event) {
	if (event.target instanceof HTMLInputElement
		|| event.target instanceof HTMLTextAreaElement
		|| event.target instanceof HTMLSelectElement
		|| event.target?.isContentEditable) {
		return true
	}
	/** Abort if any modal/dialog opened */
	return document.getElementsByClassName('modal-mask').length !== 0
}

const eventHandler = (callback, options) => (event) => {
	if (!!options.ctrl !== event.ctrlKey) {
		// Ctrl is required and not pressed, or the opposite
		return
	} else if (!!options.alt !== event.altKey) {
		// Alt is required and not pressed, or the opposite
		return
	} else if (!!options.shift !== event.shiftKey) {
		// Shift is required and not pressed, or the opposite
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

/**
 * @param {string} key - keyboard key or keys to listen to
 * @param {Function} callback - callback function
 * @param {object} options - composable options
 * @see docs/composables/usekeystroke.md
 */
export function useHotKey(key, callback = () => {}, options = {}) {
	if (disableKeyboardShortcuts) {
		// Keyboard shortcuts are disabled
		return () => {}
	}

	const stopKeyDown = onKeyStroke(key, eventHandler(callback, options), {
		eventName: 'keydown',
		dedupe: true,
		passive: !options.prevent,
	})

	const stopKeyUp = options.push
		? onKeyStroke(key, eventHandler(callback, options), {
			eventName: 'keyup',
			passive: !options.prevent,
		})
		: () => {}

	return () => {
		stopKeyDown()
		stopKeyUp()
	}
}
