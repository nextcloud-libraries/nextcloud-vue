/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { AppContext, Component, ComponentPublicInstance } from 'vue'
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
 * @return The dialog's component public instance and a function to unmount it
 */
export function spawnDialog(
	dialog: Component,
	props?: DialogProps,
	onClose: (...rest: unknown[]) => void = () => {},
): {
	vm: ComponentPublicInstance
	unmount(): void
} {
	const el = document.createElement('div')
	const container: HTMLElement = typeof props?.container === 'string'
		? (document.querySelector(props.container) || document.body)
		: document.body
	container.appendChild(el)

	const vnode = createVNode(dialog, {
		...props,
		onclose: (...rest: unknown[]) => {
			onClose(...rest.map(v => toRaw(v)))
			unmount()
		},
	})

	// If there is an instance use it to get access to registered components
	const appContext = props?.appContext ?? getCurrentInstance()?.appContext
	if (appContext) {
		vnode.appContext = { ...appContext }
	}

	render(vnode, el)

	// vnode.component and proxy are not null here, because we just rendered it
	const vm = vnode.component!.proxy!

	/**
	 * Unmount the dialog instance
	 */
	function unmount() {
		// Destroy component instance
		render(null, el)
		// Remove the element it was mounted to
		el.remove()
	}

	return {
		vm,
		unmount,
	}
}
