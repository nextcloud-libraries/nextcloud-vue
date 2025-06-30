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
 * @param {string} providerId Optional ID of initial selected provider
 * @param {boolean} isInsideViewer Should be true if this function is called while the Viewer is displayed
 * @return {Promise<unknown>}
 */
export async function getLinkWithPicker(providerId = null, isInsideViewer = undefined) {
	return await new Promise((resolve, reject) => {
		const modalId = 'referencePickerModal'
		const modalElement = document.createElement('div')
		modalElement.id = modalId
		document.body.append(modalElement)

		const initialProvider = providerId === null
			? null
			: (getProvider(providerId) ?? null)

		const view = createApp(NcReferencePickerModal, {
			initialProvider,
			isInsideViewer,
			onCancel() {
				view.unmount()
				reject(new Error('User cancellation'))
			},
			onSubmit(link) {
				view.unmount()
				resolve(link)
			},
		})
		view.mount(modalElement)
	})
}
