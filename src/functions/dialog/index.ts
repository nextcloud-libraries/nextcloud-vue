/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { AsyncComponent, Component } from 'vue'

import Vue, { toRaw } from 'vue'

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
): Vue {
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
	const resolvedContainer = (typeof container === 'string' && document.querySelector(container)) || document.body

	// Create root container element for the dialog
	const element = resolvedContainer.appendChild(document.createElement('div'))

	const vm = new Vue({
		el: element,
		name: 'VueDialogHelper',
		render: (h) =>
			h(dialog, {
				props: {
					// If dialog has no `container` prop passing a falsy value does nothing
					// Otherwise it is expected that `null` disables teleport and mounts dialog in place like NcDialog/NcModal
					container: null,
					...props,
				},
				on: {
					close: (...rest: unknown[]) => {
						onClose(...rest.map(v => toRaw(v)))
						vm.$destroy()
						element.remove()
					},
				},
			}),
	})
	return vm
}
