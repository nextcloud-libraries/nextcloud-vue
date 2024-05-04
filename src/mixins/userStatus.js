/**
 * @copyright Copyright (c) 2020 Georg Ehrke <georg-nextcloud@ehrke.email>
 *
 * @author Georg Ehrke <georg-nextcloud@ehrke.email>
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

import { getCurrentUser } from '@nextcloud/auth'
import axios from '@nextcloud/axios'
import { getCapabilities } from '@nextcloud/capabilities'
import { generateOcsUrl } from '@nextcloud/router'

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
			if (
				!Object.prototype.hasOwnProperty.call(capabilities, 'user_status') ||
				!capabilities.user_status.enabled
			) {
				return
			}

			// User status endpoint is not available for guests.
			if (!getCurrentUser()) {
				return
			}

			try {
				const { data } = await axios.get(
					generateOcsUrl('apps/user_status/api/v1/statuses/{userId}', {
						userId,
					}),
				)
				const { status, message, icon } = data.ocs.data
				this.userStatus.status = status
				this.userStatus.message = message || ''
				this.userStatus.icon = icon || ''
				this.hasStatus = true
			} catch (e) {
				if (
					e.response.status === 404 &&
					e.response.data.ocs?.data?.length === 0
				) {
					// User just has no status set, so don't log it
					return
				}
				console.error(e)
			}
		},
	},
}
