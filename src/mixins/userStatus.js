/**
 * @copyright Copyright (c) 2020 Georg Ehrke <georg-nextcloud@ehrke.email>
 *
 * @author Georg Ehrke <georg-nextcloud@ehrke.email>
 *
 * @license GNU AGPL version 3 or any later version
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
import axios from '@nextcloud/axios'
import { generateOcsUrl } from '@nextcloud/router'
import { getCapabilities } from '@nextcloud/capabilities'
import { getCurrentUser } from '@nextcloud/auth'

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
		 * @param {String} userId UserId of the user to fetch the status for
		 *
		 * @returns {Promise<void>}
		 */
		async fetchUserStatus(userId) {
			const capabilities = getCapabilities()
			if (!Object.prototype.hasOwnProperty.call(capabilities, 'user_status') || !capabilities.user_status.enabled) {
				return
			}

			// User status endpoint is not available for guests.
			if (!getCurrentUser()) {
				return
			}

			try {
				const { data } = await axios.get(generateOcsUrl('apps/user_status/api/v1', 2) + `statuses/${encodeURIComponent(userId)}`)
				const {
					status,
					message,
					icon,
				} = data.ocs.data
				this.userStatus.status = status
				this.userStatus.message = message || ''
				this.userStatus.icon = icon || ''
				this.hasStatus = true
			} catch (e) {
				if (e.response.status === 404 && e.response.data.ocs?.data?.length === 0) {
					// User just has no status set, so don't log it
					return
				}
				console.error(e)
			}
		},
	},
}
