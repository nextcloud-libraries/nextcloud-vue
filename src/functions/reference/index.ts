/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export {
	type ReferenceWidgetProps,
	type ReferenceWidgetRenderProperties,

	hasInteractiveView,
	isWidgetRegistered,
	registerWidget,
	renderWidget,
} from './widgets.ts'

export { getLinkWithPicker } from './referencePickerModal.ts'

export {
	type ReferenceProvider,

	anyLinkProviderId,
	getProvider,
	getProviders,
	searchProvider,
	sortProviders,
} from './providerHelper.ts'

export {
	type CustomPickerElement,

	isCustomPickerElementRegistered,
	NcCustomPickerRenderResult,
	registerCustomPickerElement,
	renderCustomPickerElement,
} from './customPickerElements.ts'
