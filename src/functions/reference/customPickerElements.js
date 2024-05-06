if (!window._vue_richtext_custom_picker_elements) {
	window._vue_richtext_custom_picker_elements = {}
}

/**
 * Representation of the render callback result
 * It contains a dom element and an object (Vue instance or other fancy things)
 */
class NcCustomPickerRenderResult {
	/**
	 * @param {HTMLElement} element The HTML element
	 * @param {object} object The object
	 */
	constructor(element, object) {
		this.element = element
		this.object = object
	}
}

const isCustomPickerElementRegistered = (id) => {
	return !!window._vue_richtext_custom_picker_elements[id]
}

const getCustomPickerElementSize = (id) => {
	const size = window._vue_richtext_custom_picker_elements[id]?.size
	if (['small', 'normal', 'large', 'full'].includes(size)) {
		return size
	}
	return null
}

const registerCustomPickerElement = (
	id,
	callback,
	onDestroy = (el) => {},
	size = 'large',
) => {
	if (window._vue_richtext_custom_picker_elements[id]) {
		console.error(
			'Custom reference picker element for id ' + id + ' already registered',
		)
		return
	}

	window._vue_richtext_custom_picker_elements[id] = {
		id,
		callback,
		onDestroy,
		size,
	}
}

const renderCustomPickerElement = (el, { providerId, accessible }) => {
	if (!window._vue_richtext_custom_picker_elements[providerId]) {
		console.error(
			'Custom reference picker element for reference provider ID ' +
				providerId +
				' not registered',
		)
		return
	}

	return window._vue_richtext_custom_picker_elements[providerId].callback(el, {
		providerId,
		accessible,
	})
}

const destroyCustomPickerElement = (providerId, el, renderResult) => {
	if (!window._vue_richtext_custom_picker_elements[providerId]) {
		return
	}

	window._vue_richtext_custom_picker_elements[providerId].onDestroy(
		el,
		renderResult,
	)
}

window._registerCustomPickerElement = registerCustomPickerElement

export {
	NcCustomPickerRenderResult,
	registerCustomPickerElement,
	renderCustomPickerElement,
	destroyCustomPickerElement,
	isCustomPickerElementRegistered,
	getCustomPickerElementSize,
}
