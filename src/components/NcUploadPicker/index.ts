/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

// re-export to allow importing everything from the same path if only this component is used
export type {
	FilePickerItem,
	FilePickerItemGroup,
} from '../NcFilePicker/index.ts'

export { default } from './NcUploadPicker.vue'
