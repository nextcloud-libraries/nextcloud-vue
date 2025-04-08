/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { Component } from 'vue'
import { createApp, toRaw } from 'vue'

interface DialogProps {
	[index: string]: unknown
	container?: string
}

/**
 * Helper to spawn a Vue dialog without having to mount it from a component
 *
 * @param dialog The dialog component to spawn
 * @param props Properties to pass to the dialog
 * @param props.container Optionally pass a query selector for the dialog container element
 * @param onClose Callback when the dialog is closed
 */
export function spawnDialog(
	dialog: Component,
	props?: DialogProps,
	onClose: (...rest: unknown[]) => void = () => {},
): void {
	const el = document.createElement('div')
	const container: HTMLElement = typeof props?.container === 'string'
		? (document.querySelector(props.container) || document.body)
		: document.body
	container.appendChild(el)

	const app = createApp(dialog, {
		...props,
		onClose: (...rest: unknown[]) => {
			onClose(...rest.map(v => toRaw(v)))
			app.unmount()
			el.remove()
		},
	})

	app.mount(el)
}
