import { registerWidget, renderWidget, isWidgetRegistered } from './widgets.js'
import { getLinkWithPicker } from './referencePickerModal.js'
import {
	getProvider,
	getProviders,
	sortProviders,
	searchProvider,
	anyLinkProviderId,
} from './providerHelper.js'
import {
	registerCustomPickerElement,
	renderCustomPickerElement,
	isCustomPickerElementRegistered,
	NcCustomPickerRenderResult,
} from './customPickerElements.js'

export {
	registerWidget,
	renderWidget,
	isWidgetRegistered,

	NcCustomPickerRenderResult,
	registerCustomPickerElement,
	renderCustomPickerElement,
	isCustomPickerElementRegistered,
	getLinkWithPicker,
	anyLinkProviderId,
	getProvider,
	getProviders,
	sortProviders,
	searchProvider,
}
