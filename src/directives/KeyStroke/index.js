/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { onKeyStroke } from '@vueuse/core'

const disableKeyboardShortcuts = window.OCP?.Accessibility?.disableKeyboardShortcuts?.()

/**
 * Check if event target (active element) is interactive and should not trigger the directive callback
 * @param {KeyboardEvent} event keyboard event
 * @return {boolean} whether it should prevent callback
 */
function shouldPreventCallback(event) {
	/** Abort the directive if active element is an input, textarea or contenteditable */
	if (event.target instanceof HTMLInputElement
		/**
		 * TODO discuss if we should abort on another interactive elements
		 * || event.target instanceof HTMLButtonElement
		 * || event.target instanceof HTMLAnchorElement
		 * || event.target instanceof HTMLSelectElement
		 * || (event.target as HTMLElement)?.hasAttribute('tabindex')
		 */
		|| event.target instanceof HTMLTextAreaElement
		|| event.target?.isContentEditable) {
		return true
	}
	/** Abort the directive if any modal/dialog opened */
	return document.getElementsByClassName('modal-mask').length !== 0
}

const eventHandler = (callback, modifiers) => (event) => {
	if (!!modifiers.ctrl !== event.ctrlKey) {
		// Ctrl is required and not pressed, or the opposite
	} else if (disableKeyboardShortcuts) {
		// Keyboard shortcuts are disabled
	} else if (shouldPreventCallback(event)) {
		// Keyboard shortcuts are disabled, because active element assumes input
	} else {
		if (modifiers.prevent) {
			event.preventDefault()
		}
		if (modifiers.stop) {
			event.stopPropagation()
		}
		callback(event)
	}
}

/**
 * Wrapper for https://vueuse.org/core/onKeyStroke/
 * Available modifiers:
 * - .ctrl: Ctrl key is required
 * - .prevent: Prevent default action
 * - .stop: Stop propagation
 * - .push: Trigger on keydown and keyup
 * - .press: Trigger on keydown, don't dedupe events
 */
const directive = {
	bind(el, binding) {
		const keys = binding.arg?.replace('space', ' ').split(',') ?? true
		onKeyStroke(keys, eventHandler(binding.value, binding.modifiers), {
			eventName: 'keydown',
			dedupe: !binding.modifiers.press,
			target: disableKeyboardShortcuts ? null : document,
		})
		if (binding.modifiers.push) {
			onKeyStroke(keys, eventHandler(binding.value, binding.modifiers), {
				eventName: 'keyup',
				target: disableKeyboardShortcuts ? null : document,
			})
		}
	},
}

export default directive
