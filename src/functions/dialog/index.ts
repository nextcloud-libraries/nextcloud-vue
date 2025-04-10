/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { Component } from 'vue'
import { createApp } from 'vue'

type SpawnDialogOptions = {
	/**
	 * Container to mount the dialog to
	 * @default document.body
	 */
	container?: Element | string
}

export function spawnDialog(
	dialog: Component,
	props?: object,
	onClose?: (...rest: unknown[]) => void,
): void

export function spawnDialog(
	dialog: Component,
	props?: object,
	options?: SpawnDialogOptions,
	onClose?: (...rest: unknown[]) => void,
): void

/**
 * Spawn a single-use Vue dialog instance to get the result when it is closed
 *
 * @param dialog - Dialog component to spawn
 * @param props - Props to pass to the dialog instance
 * @param optionsOrOnClose - Spawning options or a callback when the dialog is closed
 * @param onClose - Callback when the dialog is closed
 */
export function spawnDialog(
	dialog: Component,
	props: object = {},
	optionsOrOnClose: SpawnDialogOptions | ((...rest: unknown[]) => void) = {},
	onClose: (...rest: unknown[]) => void = () => {},
): void {
	if (typeof optionsOrOnClose === 'function') {
		onClose = optionsOrOnClose
		optionsOrOnClose = {}
	}

	let { container } = optionsOrOnClose

	// For backwards compatibility try to use container from props
	if ('container' in props && typeof props.container === 'string') {
		container ??= props.container
	}

	// Resolve container to an Element or fallback to document.body
	const resolvedContainer = (typeof container === 'string' ? document.querySelector(container) : container) || document.body

	// Create root container element for the dialog
	const element = resolvedContainer.appendChild(document.createElement('div'))

	const app = createApp(dialog, {
		...props,
		container,
		onClose: (...rest: unknown[]) => {
			onClose(...rest)
			app.unmount()
			element.remove()
		},
	})

	app.mount(element)
}
