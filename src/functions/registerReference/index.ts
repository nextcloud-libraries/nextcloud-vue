/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export {
	registerWidget,
	renderWidget,
	destroyWidget,
	isWidgetRegistered,
} from '../reference/widgets.ts'

export {
	NcCustomPickerRenderResult,
	registerCustomPickerElement,
	renderCustomPickerElement,
	destroyCustomPickerElement,
	isCustomPickerElementRegistered,
	getCustomPickerElementSize,
} from '../reference/customPickerElements.ts'
