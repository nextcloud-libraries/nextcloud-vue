interface WidgetRenderProperties {
	richObjectType: string;
	richObject: object;
	accessible: boolean;
	interactive: boolean;
}

type widgetRenderCallback = (el: HTMLElement, properties: WidgetRenderProperties) => void;
type widgetDestroyCallback = (el: HTMLElement) => void;

interface WidgetProps {
	id: string;
	hasInteractiveView: boolean;
	fullWidth: boolean;
	callback: widgetRenderCallback;
	onDestroy: widgetDestroyCallback;
}

interface WidgetPropsOptional {
	hasInteractiveView?: boolean;
	fullWidth?: boolean;
}

declare global {
	interface Window {
		_vue_richtext_widgets: Record<string, WidgetProps>;
		_registerWidget: (id: string, callback: widgetRenderCallback, onDestroy: widgetDestroyCallback, props: WidgetPropsOptional) => void;
	}
}

if (!window._vue_richtext_widgets) {
	window._vue_richtext_widgets = {}
}

const isWidgetRegistered = (id: string) => {
	return !!window._vue_richtext_widgets[id]
}

const hasInteractiveView = (id: string) => {
	return !!window._vue_richtext_widgets[id]?.hasInteractiveView
}

export const hasFullWidth = (id: string) => {
	return !!window._vue_richtext_widgets[id]?.fullWidth
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const registerWidget = (id: string, callback: widgetRenderCallback, onDestroy = (el: HTMLElement) => {}, props: WidgetPropsOptional) => {
	const propsWithDefaults = {
		hasInteractiveView: true,
		fullWidth: false,
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

const renderWidget = (el: HTMLElement, { richObjectType, richObject, accessible, interactive }) => {
	if (richObjectType === 'open-graph') {
		return
	}

	if (!window._vue_richtext_widgets[richObjectType]) {
		console.error('Widget for rich object type ' + richObjectType + ' not registered')
		return
	}

	window._vue_richtext_widgets[richObjectType].callback(el, { richObjectType, richObject, accessible, interactive })
}

const destroyWidget = (richObjectType: string, el: HTMLElement) => {
	if (richObjectType === 'open-graph') {
		return
	}

	if (!window._vue_richtext_widgets[richObjectType]) {
		return
	}

	window._vue_richtext_widgets[richObjectType].onDestroy(el)
}

window._registerWidget = (id: string, callback: widgetRenderCallback, onDestroy: widgetDestroyCallback, props: WidgetPropsOptional) => {
	registerWidget(id, callback, onDestroy, props)
}

export {
	registerWidget,
	renderWidget,
	destroyWidget,
	isWidgetRegistered,
	hasInteractiveView,
}
