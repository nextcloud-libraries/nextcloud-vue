/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export type {
	ReferenceWidgetProps,
	ReferenceWidgetRenderProperties,
} from './widgets.ts'

export type { ReferenceProvider } from './providerHelper.ts'
export type { CustomPickerElement } from './customPickerElements.ts'

export {
	hasInteractiveView,
	isWidgetRegistered,
	registerWidget,
	renderWidget,
} from './widgets.ts'

export {
	getLinkWithPicker,
	getReferenceWithPicker,
} from './referencePickerModal.ts'

export {
	anyLinkProviderId,
	getProvider,
	getProviders,
	searchProvider,
	sortProviders,
} from './providerHelper.ts'

export {
	isCustomPickerElementRegistered,
	NcCustomPickerRenderResult,
	registerCustomPickerElement,
	renderCustomPickerElement,
} from './customPickerElements.ts'
