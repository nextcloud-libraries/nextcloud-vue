/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { registerWidget, renderWidget, isWidgetRegistered, hasInteractiveView } from './widgets.ts'
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
	hasInteractiveView,

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
