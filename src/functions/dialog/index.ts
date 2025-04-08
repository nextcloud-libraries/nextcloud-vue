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

/**
 * Spawn a single-use Vue dialog instance to get the result when it is closed
 *
 * @param dialog - Dialog component to spawn
 * @param props - Props to pass to the dialog instance
 * @param options - Spawning options
 * @return Promise resolved with the `close` event payload
 */
export function spawnDialog(
	dialog: Component,
	props: object = {},
	options: SpawnDialogOptions = {},
): Promise<unknown> {
	let { container } = options

	// For backwards compatibility try to use container from props
	if ('container' in props && typeof props.container === 'string') {
		container ??= props.container
	}

	// Resolve container to an Element or fallback to document.body
	const resolvedContainer = (typeof container === 'string' && document.querySelector(container)) || document.body

	// Create root container element for the dialog
	const element = resolvedContainer.appendChild(document.createElement('div'))

	return new Promise((resolve, reject) => {
		const app = createApp(dialog, {
			...props,
			// If dialog has no `container` prop passing a falsy value does nothing
			// Otherwise it is expected that `null` disables teleport and mounts dialog in place like NcDialog/NcModal
			container: null,
			onClose(...rest: unknown[]) {
				app.unmount()
				element.remove()
				resolve(rest.length > 1 ? rest : rest[0])
			},
			'onVue:unmounted'() {
				app.unmount()
				element.remove()
				reject(new Error('Dialog was unmounted without close event'))
			},
		})

		app.mount(element)
	})
}
