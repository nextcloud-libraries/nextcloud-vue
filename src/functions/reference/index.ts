/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export {
	type ReferenceWidgetProps,
	type ReferenceWidgetRenderProperties,

	registerWidget,
	renderWidget,
	isWidgetRegistered,
	hasInteractiveView,
} from './widgets.ts'

export { getLinkWithPicker } from './referencePickerModal.ts'

export {
	type ReferenceProvider,

	getProvider,
	getProviders,
	sortProviders,
	searchProvider,
	anyLinkProviderId,
} from './providerHelper.ts'

export {
	type CustomPickerElement,
	registerCustomPickerElement,
	renderCustomPickerElement,
	isCustomPickerElementRegistered,
	NcCustomPickerRenderResult,
} from './customPickerElements.ts'
