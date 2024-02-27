/**
 * @copyright Copyright (c) 2023 Raimund Schlüßler <raimund.schluessler@mailbox.org>
 *
 * @author Raimund Schlüßler <raimund.schluessler@mailbox.org>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
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
