<!--
  - @copyright 2024 Christopher Ng <chrng8@gmail.com>
  -
  - @author Christopher Ng <chrng8@gmail.com>
  -
  - @license AGPL-3.0-or-later
  -
  - This program is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as
  - published by the Free Software Foundation, either version 3 of the
  - License, or (at your option) any later version.
  -
  - This program is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
  -
-->

<docs>
### Description

This component displays a user status icon.

### Example

```vue
<template>
	<div class="row">
		<NcUserStatusIcon status="online" />
		<NcUserStatusIcon status="away" />
		<NcUserStatusIcon status="dnd" />
		<NcUserStatusIcon status="invisible" />
	</div>
</template>

<style>
.row {
	display: flex;
	gap: 10px;
}
</style>
```
</docs>

<template>
	<span
		v-if="activeStatus"
		class="user-status-icon"
		:class="{
			'user-status-icon--invisible': ['invisible', 'offline'].includes(status),
		}"
		role="img"
		:aria-hidden="ariaHidden"
		:aria-label="ariaLabel"
		v-html="activeSvg" /><!-- eslint-disable-line vue/no-v-html -->
</template>

<script>
import Vue from 'vue'
import axios from '@nextcloud/axios'
import { generateOcsUrl } from '@nextcloud/router'
import { getCapabilities } from '@nextcloud/capabilities'

import onlineSvg from '../../assets/status-icons/user-status-online.svg?raw'
import awaySvg from '../../assets/status-icons/user-status-away.svg?raw'
import dndSvg from '../../assets/status-icons/user-status-dnd.svg?raw'
import invisibleSvg from '../../assets/status-icons/user-status-invisible.svg?raw'

import { getUserStatusText } from '../../utils/UserStatus.ts'
import { t } from '../../l10n.js'

export default {
	name: 'NcUserStatusIcon',

	props: {
		/**
		 * Set the user id to fetch the status
		 */
		user: {
			type: String,
			default: null,
		},

		/**
		 * Set the status
		 *
		 * @type {'online' | 'away' | 'busy' | 'dnd' | 'invisible' | 'offline'}
		 */
		status: {
			type: String,
			default: null,
			validator: (value) =>
				['online', 'away', 'busy', 'dnd', 'invisible', 'offline'].includes(
					value,
				),
		},

		/**
		 * Set the `aria-hidden` attribute
		 *
		 * @type {'true' | 'false'}
		 */
		ariaHidden: {
			type: String,
			default: null,
			validator: (value) => ['true', 'false'].includes(value),
		},
	},

	data() {
		return {
			fetchedUserStatus: null,
		}
	},

	computed: {
		activeStatus() {
			return this.status ?? this.fetchedUserStatus
		},

		activeSvg() {
			const matchSvg = {
				online: onlineSvg,
				away: awaySvg,
				busy: awaySvg,
				dnd: dndSvg,
				invisible: invisibleSvg,
				offline: invisibleSvg,
			}
			return matchSvg[this.activeStatus] ?? null
		},

		ariaLabel() {
			if (this.ariaHidden === 'true') {
				return null
			}
			return t('User status: {status}', {
				status: getUserStatusText(this.activeStatus),
			})
		},
	},

	watch: {
		user: {
			immediate: true,
			async handler(user, _oldUser) {
				if (!user || !getCapabilities()?.user_status?.enabled) {
					this.fetchedUserStatus = null
					return
				}
				try {
					const { data } = await axios.get(
						generateOcsUrl('/apps/user_status/api/v1/statuses/{user}', {
							user,
						}),
					)
					this.fetchedUserStatus = data.ocs?.data?.status
				} catch (error) {
					this.fetchedUserStatus = null
				}
			},
		},
	},

	mounted() {
		if (!this.user && !this.status) {
			Vue.util.warn(
				'[NcUserStatusIcon] The `user` or `status` prop should be set.',
			)
		}
	},
}
</script>

<style lang="scss" scoped>
.user-status-icon {
	display: flex;
	justify-content: center;
	align-items: center;
	min-width: 16px;
	min-height: 16px;
	max-width: 20px;
	max-height: 20px;

	&--invisible {
		filter: var(--background-invert-if-dark);
	}
}
</style>
