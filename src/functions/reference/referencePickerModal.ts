/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import NcReferencePickerModal from './../../components/NcRichText/NcReferencePicker/NcReferencePickerModal.vue'
import { getProvider } from './providerHelper.js'

import { createApp } from 'vue'

/**
 * Creates a reference picker modal and return a promise which provides the result
 *
 * @param providerId - Optional ID of initial selected provider
 * @param isInsideViewer - Should be true if this function is called while the Viewer is displayed
 */
export async function getLinkWithPicker(providerId?: string, isInsideViewer?: boolean): Promise<string> {
	const modalId = 'referencePickerModal'
	const modalElement = document.createElement('div')
	modalElement.id = modalId
	document.body.append(modalElement)

	const { promise, reject, resolve } = Promise.withResolvers<string>()
	const initialProvider = (providerId && getProvider(providerId)) || null
	const view = createApp(NcReferencePickerModal, {
		initialProvider,
		isInsideViewer,
		onCancel() {
			view.unmount()
			reject(new Error('User cancellation'))
		},
		onSubmit(link: string) {
			view.unmount()
			resolve(link)
		},
	})
	view.mount(modalElement)

	return promise
}
