/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { AppContext, Component } from 'vue'
import { createVNode, getCurrentInstance, render, toRaw } from 'vue'

interface DialogProps {
	[index: string]: unknown
	container?: string
	appContext?: AppContext
}

/**
 * Helper to spawn a Vue dialog without having to mount it from a component
 *
 * @param dialog The dialog component to spawn
 * @param props Properties to pass to the dialog
 * @param props.container Optionally pass a query selector for the dialog container element
 * @param props.appContext Optionally the app context to use (e.g. for registered components)
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

	const vueComponent = createVNode(dialog, {
		...props,
		onclose: (...rest: unknown[]) => {
			onClose(...rest.map(v => toRaw(v)))
			// destroy the component
			render(null, el)
			el.remove()
		},
	})

	// If there is an instance use it to get access to registered components
	const appContext = props?.appContext ?? getCurrentInstance()?.appContext
	if (appContext) {
		vueComponent.appContext = { ...appContext }
	}

	render(vueComponent, el)
}
