/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import NcReferenceList from './NcReferenceList.vue'
import NcReferencePicker from './NcReferencePicker/NcReferencePicker.vue'
import NcReferencePickerModal from './NcReferencePicker/NcReferencePickerModal.vue'
import NcSearch from './NcReferencePicker/NcSearch.vue'
import NcReferenceWidget from './NcReferenceWidget.vue'
import NcRichText from './NcRichText.vue'
import {
	isCustomPickerElementRegistered,
	NcCustomPickerRenderResult,
	registerCustomPickerElement,
	renderCustomPickerElement,
} from '../../functions/reference/customPickerElements.ts'
import {
	anyLinkProviderId,
	getProvider,
	getProviders,
	searchProvider,
	sortProviders,
} from '../../functions/reference/providerHelper.ts'
import { getLinkWithPicker } from '../../functions/reference/referencePickerModal.ts'
import { isWidgetRegistered, registerWidget, renderWidget } from './../../functions/reference/widgets.ts'

export default NcRichText

export {
	anyLinkProviderId,
	getLinkWithPicker,
	getProvider,
	getProviders,
	isCustomPickerElementRegistered,
	isWidgetRegistered,
	NcCustomPickerRenderResult,
	NcReferenceList,
	NcReferencePicker,
	NcReferencePickerModal,
	NcReferenceWidget,
	NcRichText,
	NcSearch,
	registerCustomPickerElement,
	registerWidget,
	renderCustomPickerElement,
	renderWidget,
	searchProvider,
	sortProviders,
}
