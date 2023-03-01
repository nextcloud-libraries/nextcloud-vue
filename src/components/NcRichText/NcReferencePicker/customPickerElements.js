if (!window._vue_richtext_custom_picker_elements) {
	window._vue_richtext_custom_picker_elements = {}
}

/**
 * Representation of the render callback result
 * It contains a dom element and an object (Vue instance or other fancy things)
 */
class NcCustomPickerRenderResult {

	/**
	 * @param {HTMLElement} element
	 * @param {object} object
	 */
	constructor(element, object) {
		this.element = element
		this.object = object
	}

}

const isCustomPickerElementRegistered = (id) => {
	return !!window._vue_richtext_custom_picker_elements[id]
}

const registerCustomPickerElement = (id, callback, onDestroy = (el) => {}) => {
	if (window._vue_richtext_custom_picker_elements[id]) {
		console.error('Custom reference picker element for id ' + id + ' already registered')
		return
	}

	window._vue_richtext_custom_picker_elements[id] = {
		id,
		callback,
		onDestroy,
	}
}

const renderCustomPickerElement = (el, { providerId, accessible }) => {
	if (!window._vue_richtext_custom_picker_elements[providerId]) {
		console.error('Custom reference picker element for reference provider ID ' + providerId + ' not registered')
		return
	}

	return window._vue_richtext_custom_picker_elements[providerId].callback(el, { providerId, accessible })
}

const destroyCustomPickerElement = (providerId, el, renderResult) => {
	if (!window._vue_richtext_custom_picker_elements[providerId]) {
		return
	}

	window._vue_richtext_custom_picker_elements[providerId].onDestroy(el, renderResult)
}

window._registerCustomPickerElement = registerCustomPickerElement

export {
	NcCustomPickerRenderResult,
	registerCustomPickerElement,
	renderCustomPickerElement,
	destroyCustomPickerElement,
	isCustomPickerElementRegistered,
}
