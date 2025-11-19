/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { getCurrentUser } from '@nextcloud/auth'
import axios from '@nextcloud/axios'
import { getCapabilities } from '@nextcloud/capabilities'
import { generateOcsUrl } from '@nextcloud/router'
import { logger } from '../utils/logger.ts'

export default {
	data() {
		return {
			hasStatus: false,
			userStatus: {
				status: null,
				message: null,
				icon: null,
			},
		}
	},
	methods: {
		/**
		 * Fetches the user-status from the server
		 *
		 * @param {string} userId UserId of the user to fetch the status for
		 *
		 * @return {Promise<void>}
		 */
		async fetchUserStatus(userId) {
			if (!userId) {
				return
			}
			const capabilities = getCapabilities()
			if (!Object.hasOwn(capabilities, 'user_status') || !capabilities.user_status.enabled) {
				return
			}

			// User status endpoint is not available for guests.
			if (!getCurrentUser()) {
				return
			}

			try {
				const { data } = await axios.get(generateOcsUrl('apps/user_status/api/v1/statuses/{userId}', { userId }))
				this.setUserStatus(data.ocs.data)
			} catch (error) {
				if (error.response.status === 404 && error.response.data.ocs?.data?.length === 0) {
					// User just has no status set, so don't log it
					return
				}
				logger.error('Could not fetch user status', { error })
			}
		},

		/**
		 * Sets the user status
		 *
		 * @param {string} status user's status
		 * @param {string} message user's message
		 * @param {string} icon user's icon
		 */
		setUserStatus({ status, message, icon }) {
			this.userStatus.status = status || ''
			this.userStatus.message = message || ''
			this.userStatus.icon = icon || ''
			this.hasStatus = !!status
		},
	},
}
