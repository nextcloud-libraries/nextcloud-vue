/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Component } from 'vue'
import { createApp } from 'vue'

type ComponentProps<T extends Component> = T extends new (...args: any) => { $props: infer P }
	? P extends Record<string, any>
		? P
		: never
	: never

type DialogComponent<T extends Component> = 'onClose' extends keyof ComponentProps<T>
	? T
	: 'Please provide a Dialog Component that supports `@close` event'

type NormalizedPayload<T> = T extends []
	? void
	: T extends [infer F]
		? F
		: T

type ClosePayload<T> = T extends { onClose?: (...args: infer P) => any }
	? P
	: never

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
export function spawnDialog<
	C extends Component,
	E extends ClosePayload<ComponentProps<C>>,
>(dialog: DialogComponent<C>, props: Partial<ComponentProps<C>> = {}, options: SpawnDialogOptions = {}): Promise<NormalizedPayload<E>> {
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
		const app = createApp(dialog as Component, {
			...props,
			// If dialog has no `container` prop passing a falsy value does nothing
			// Otherwise it is expected that `null` disables teleport and mounts dialog in place like NcDialog/NcModal
			container: null,
			onClose(...rest: E) {
				const payload = (rest.length > 1 ? rest : rest[0]) as NormalizedPayload<E>

				app.unmount()
				element.remove()
				resolve(payload)
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
