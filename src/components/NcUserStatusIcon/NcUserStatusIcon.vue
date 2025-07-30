<!--
  - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### Description

This component displays a user status icon.

### Example

```vue
<template>
	<div class="grid">
		<NcUserStatusIcon status="online" />
		<span>Online</span>
		<NcUserStatusIcon status="away" />
		<span>Away</span>
		<NcUserStatusIcon status="busy" />
		<span>Busy</span>
		<NcUserStatusIcon status="dnd" />
		<span>Do not disturb</span>
		<NcUserStatusIcon status="invisible" />
		<span>Invisible</span>
		<NcUserStatusIcon status="offline" />
		<span>Offline</span>
	</div>
</template>

<style>
.grid {
	display: grid;
	grid-template-columns: 20px 1fr;
	gap: 8px;
	align-items: center;
	width: fit-content;
}
</style>
```
</docs>

<template>
	<span v-if="activeStatus"
		class="user-status-icon"
		:class="{
			'user-status-icon--invisible': ['invisible', 'offline'].includes(status),
		}"
		role="img"
		:aria-hidden="ariaHidden"
		:aria-label="ariaLabel"
		v-html="activeSvg" /> <!-- eslint-disable-line vue/no-v-html -->
</template>

<script>
import axios from '@nextcloud/axios'
import { generateOcsUrl } from '@nextcloud/router'
import { getCapabilities } from '@nextcloud/capabilities'
import { loadState } from '@nextcloud/initial-state'

import onlineSvg from '../../assets/status-icons/user-status-online.svg?raw'
import onlineLegacySvg from '../../assets/status-icons/user-status-online-legacy.svg?raw'
import awaySvg from '../../assets/status-icons/user-status-away.svg?raw'
import awayLegacySvg from '../../assets/status-icons/user-status-away-legacy.svg?raw'
import busySvg from '../../assets/status-icons/user-status-busy.svg?raw'
import dndSvg from '../../assets/status-icons/user-status-dnd.svg?raw'
import dndLegacySvg from '../../assets/status-icons/user-status-dnd-legacy.svg?raw'
import invisibleSvg from '../../assets/status-icons/user-status-invisible.svg?raw'
import invisibleLegacySvg from '../../assets/status-icons/user-status-invisible-legacy.svg?raw'

import { getUserStatusText } from '../../utils/UserStatus.ts'
import { t } from '../../l10n.js'

const [major] = loadState('core', 'config', { version: '32.0' }).version.split('.', 2) ?? []
const isLegacy = major && Number.parseInt(major) < 32
const matchSvg = {
	online: isLegacy ? onlineLegacySvg : onlineSvg,
	away: isLegacy ? awayLegacySvg : awaySvg,
	busy: isLegacy ? awayLegacySvg : busySvg,
	dnd: isLegacy ? dndLegacySvg : dndSvg,
	invisible: isLegacy ? invisibleLegacySvg : invisibleSvg,
	offline: isLegacy ? invisibleLegacySvg : invisibleSvg,
}

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
			validator: (value) => [
				'online',
				'away',
				'busy',
				'dnd',
				'invisible',
				'offline',
			].includes(value),
		},

		/**
		 * Set the `aria-hidden` attribute
		 *
		 * @type {'true' | 'false'}
		 */
		ariaHidden: {
			type: String,
			default: null,
			validator: (value) => [
				'true',
				'false',
			].includes(value),
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
			return matchSvg[this.activeStatus] ?? null
		},

		ariaLabel() {
			if (this.ariaHidden === 'true') {
				return null
			}
			return t('User status: {status}', { status: getUserStatusText(this.activeStatus) })
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
					const { data } = await axios.get(generateOcsUrl('/apps/user_status/api/v1/statuses/{user}', { user }))
					this.fetchedUserStatus = data.ocs?.data?.status
				} catch (error) {
					this.fetchedUserStatus = null
				}
			},
		},
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
