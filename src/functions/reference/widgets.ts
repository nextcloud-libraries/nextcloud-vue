/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { logger } from '../../utils/logger.ts'

export interface ReferenceWidgetRenderProperties {
	richObjectType: string
	richObject: object
	accessible: boolean
	interactive: boolean
}

type ReferenceWidgetRenderCallback = (el: HTMLElement, properties: ReferenceWidgetRenderProperties) => void
type ReferenceWidgetDestroyCallback = (el: HTMLElement) => void

export interface ReferenceWidgetProps {
	id: string
	hasInteractiveView: boolean
	fullWidth: boolean
	callback: ReferenceWidgetRenderCallback
	onDestroy: ReferenceWidgetDestroyCallback
}

window._vue_richtext_widgets ??= {}
window._registerWidget ??= (id: string, callback: ReferenceWidgetRenderCallback, onDestroy: ReferenceWidgetDestroyCallback, props: Partial<ReferenceWidgetProps>) => {
	registerWidget(id, callback, onDestroy, props)
}

/**
 * Register a new reference widget
 *
 * @param id - Id tof the widget
 * @param callback - Render callback
 * @param onDestroy - Cleanup callback
 * @param props - Widget props
 */
export function registerWidget(
	id: string,
	callback: ReferenceWidgetRenderCallback,
	onDestroy: ReferenceWidgetDestroyCallback = () => {},
	props?: Partial<ReferenceWidgetProps>,
) {
	const propsWithDefaults = {
		hasInteractiveView: true,
		fullWidth: false,
		...props,
	}

	if (window._vue_richtext_widgets[id]) {
		logger.error(`[ReferencePicker]: Widget for id ${id} already registered`)
		return
	}

	window._vue_richtext_widgets[id] = {
		id,
		callback,
		onDestroy,
		...propsWithDefaults,
	}
}

/**
 * Render a reference widget to a given HTML element.
 *
 * @param el - The element to render widget to
 * @param options - render options
 */
export function renderWidget(el: HTMLElement, options: ReferenceWidgetRenderProperties) {
	const { richObjectType, richObject, accessible, interactive } = options
	if (richObjectType === 'open-graph') {
		return
	}

	if (!window._vue_richtext_widgets[richObjectType]) {
		logger.error('Widget for rich object type ' + richObjectType + ' not registered')
		return
	}

	window._vue_richtext_widgets[richObjectType].callback(el, { richObjectType, richObject, accessible, interactive })
}

/**
 * Call the cleanup callback of the reference widget for given object type.
 *
 * @param richObjectType - The object type
 * @param el - The element
 */
export function destroyWidget(richObjectType: string, el: HTMLElement) {
	if (richObjectType === 'open-graph') {
		return
	}

	if (!window._vue_richtext_widgets[richObjectType]) {
		return
	}

	window._vue_richtext_widgets[richObjectType].onDestroy(el)
}

/**
 * Check if a widget with the give id is registered.
 *
 * @param id - Id of the widget
 */
export function isWidgetRegistered(id: string): boolean {
	return !!window._vue_richtext_widgets[id]
}

/**
 * Check if the given widget has an interactive view.
 *
 * @param id - Id of the widget
 */
export function hasInteractiveView(id: string): boolean {
	return !!window._vue_richtext_widgets[id]?.hasInteractiveView
}

/**
 * Check if the widget supports full width.
 *
 * @param id - Id of the widget
 */
export function hasFullWidth(id: string): boolean {
	return !!window._vue_richtext_widgets[id]?.fullWidth
}
