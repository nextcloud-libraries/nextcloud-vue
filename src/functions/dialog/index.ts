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
	dialog: Component | AsyncComponent,
	props?: DialogProps,
	onClose: (...rest: unknown[]) => void = () => {},
): Vue {
	const el = document.createElement('div')

	const container: HTMLElement = typeof props?.container === 'string'
		? (document.querySelector(props.container) || document.body)
		: document.body
	container.appendChild(el)

	const vm = new Vue({
		el,
		name: 'VueDialogHelper',
		render: (h) =>
			h(dialog, {
				props,
				on: {
					close: (...rest: unknown[]) => {
						onClose(...rest.map(v => toRaw(v)))
						vm.$destroy()
						el.remove()
					},
				},
			}),
	})
	return vm
}
