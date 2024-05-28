/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import NcRichText from './NcRichText.vue'

import { registerWidget, renderWidget, isWidgetRegistered } from './../../functions/reference/widgets.ts'
import NcReferenceList from './NcReferenceList.vue'
import NcReferenceWidget from './NcReferenceWidget.vue'
import NcReferencePicker from './NcReferencePicker/NcReferencePicker.vue'
import NcReferencePickerModal from './NcReferencePicker/NcReferencePickerModal.vue'
import NcSearch from './NcReferencePicker/NcSearch.vue'
import { getLinkWithPicker } from './../../functions/reference/referencePickerModal.js'
import {
	getProvider,
	getProviders,
	sortProviders,
	searchProvider,
	anyLinkProviderId,
} from '../../functions/reference/providerHelper.js'
import {
	registerCustomPickerElement,
	renderCustomPickerElement,
	isCustomPickerElementRegistered,
	NcCustomPickerRenderResult,
} from '../../functions/reference/customPickerElements.js'

export default NcRichText

export {
	NcRichText,
	NcReferenceList,
	NcReferenceWidget,
	NcReferencePicker,
	NcReferencePickerModal,
	NcSearch,

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
