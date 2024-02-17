if (!window._vue_richtext_widgets) {
	window._vue_richtext_widgets = {}
}

const isWidgetRegistered = (id) => {
	return !!window._vue_richtext_widgets[id]
}

const hasInteractiveView = (id) => {
	return !!window._vue_richtext_widgets[id]?.hasInteractiveView
}

const registerWidget = (id, callback, onDestroy = (el) => {}, props) => {
	const propsWithDefaults = {
		hasInteractiveView: false,
		...props,
	}

	if (window._vue_richtext_widgets[id]) {
		console.error('Widget for id ' + id + ' already registered')
		return
	}

	window._vue_richtext_widgets[id] = {
		id,
		callback,
		onDestroy,
		...propsWithDefaults,
	}
}

const renderWidget = (el, { richObjectType, richObject, accessible, interactive }) => {
	if (richObjectType === 'open-graph') {
		return
	}

	if (!window._vue_richtext_widgets[richObjectType]) {
		console.error('Widget for rich object type ' + richObjectType + ' not registered')
		return
	}

	window._vue_richtext_widgets[richObjectType].callback(el, { richObjectType, richObject, accessible, interactive })
}

const destroyWidget = (richObjectType, el) => {
	if (richObjectType === 'open-graph') {
		return
	}

	if (!window._vue_richtext_widgets[richObjectType]) {
		return
	}

	window._vue_richtext_widgets[richObjectType].onDestroy(el)
}

window._registerWidget = registerWidget

export {
	registerWidget,
	renderWidget,
	destroyWidget,
	isWidgetRegistered,
	hasInteractiveView,
}
