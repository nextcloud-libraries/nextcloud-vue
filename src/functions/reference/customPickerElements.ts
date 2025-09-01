/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { logger } from '../../utils/logger.ts'

window._vue_richtext_custom_picker_elements ??= {}
window._registerCustomPickerElement ??= registerCustomPickerElement

/**
 * Representation of the render callback result
 * It contains a dom element and an object (Vue instance or other fancy things)
 */
export class NcCustomPickerRenderResult {
	public element: HTMLElement
	public object: object

	/**
	 * @param element - The HTML element
	 * @param object - The object
	 */
	constructor(element: HTMLElement, object: object) {
		this.element = element
		this.object = object
	}
}

interface CustomPickerElementProps {
	providerId: number
	accessible: boolean
}

type CustomPickerElementRegistrationCallback = (el: HTMLElement, options: CustomPickerElementProps) => void
type CustomPickerElementDestroyCallback = (el: HTMLElement, result: NcCustomPickerRenderResult) => void

export interface CustomPickerElement {
	id: string
	size: 'small' | 'normal' | 'large' | 'full'

	callback: CustomPickerElementRegistrationCallback
	onDestroy: CustomPickerElementDestroyCallback
}

/**
 * @param id - Id of the element to check
 */
export function isCustomPickerElementRegistered(id: string): boolean {
	return !!window._vue_richtext_custom_picker_elements[id]
}

/**
 * @param id - Id of the element to get
 */
export function getCustomPickerElementSize(id: string): 'small' | 'normal' | 'large' | 'full' | null {
	const size = window._vue_richtext_custom_picker_elements[id]?.size
	if (['small', 'normal', 'large', 'full'].includes(size)) {
		return size
	}
	return null
}

/**
 * @param id - Id of element to register
 * @param callback - Render callback
 * @param onDestroy - Cleanup callback
 * @param size - Size of the element
 */
export function registerCustomPickerElement(
	id: string,
	callback: CustomPickerElementRegistrationCallback,
	onDestroy: CustomPickerElementDestroyCallback = () => {},
	size: CustomPickerElement['size'] = 'large',
) {
	if (window._vue_richtext_custom_picker_elements[id]) {
		logger.error(`Custom reference picker element for id ${id} already registered`)
		return
	}

	window._vue_richtext_custom_picker_elements[id] = {
		id,
		callback,
		onDestroy,
		size,
	}
}

/**
 * @param el - element to render to
 * @param options - Element options
 */
export function renderCustomPickerElement(el: HTMLElement, options: CustomPickerElementProps) {
	const { providerId, accessible } = options
	if (!window._vue_richtext_custom_picker_elements[providerId]) {
		logger.error(`Custom reference picker element for reference provider ID ${providerId} not registered`)
		return
	}

	return window._vue_richtext_custom_picker_elements[providerId]
		.callback(el, { providerId, accessible })
}

/**
 * @param providerId - Provider id of element to destroy
 * @param el - The element to destroy element from
 * @param renderResult - The render result
 */
export function destroyCustomPickerElement(providerId: string, el: HTMLElement, renderResult: NcCustomPickerRenderResult) {
	if (!window._vue_richtext_custom_picker_elements[providerId]) {
		return
	}

	window._vue_richtext_custom_picker_elements[providerId]
		.onDestroy(el, renderResult)
}
