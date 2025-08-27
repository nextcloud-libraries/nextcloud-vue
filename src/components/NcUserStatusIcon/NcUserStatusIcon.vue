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
	<div class="flex">
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

		<NcThemeProvider dark>
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
		</NcThemeProvider>
	</div>
</template>

<style>
.flex {
	display: flex;
	gap: 4px;
}

.grid {
	display: grid;
	grid-template-columns: 20px 1fr;
	gap: 8px;
	align-items: center;
	padding: 4px;
	width: fit-content;
	background-color: var(--color-main-background);
	color: var(--color-main-text);
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
import { isLegacy32 } from '../../utils/legacy.ts'
import { t } from '../../l10n.js'

const matchSvg = {
	online: isLegacy32 ? onlineLegacySvg : onlineSvg,
	away: isLegacy32 ? awayLegacySvg : awaySvg,
	busy: isLegacy32 ? awayLegacySvg : busySvg,
	dnd: isLegacy32 ? dndLegacySvg : dndSvg,
	invisible: isLegacy32 ? invisibleLegacySvg : invisibleSvg,
	offline: isLegacy32 ? invisibleLegacySvg : invisibleSvg,
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
	// Custom colors for the svg icons, to not rely on server variables
	--color-icon-online: #2D7B41;
	--color-icon-busy: #DB0606;
	--color-icon-away: #C88800;
	--color-icon-offline: #6B6B6B;
	display: flex;
	justify-content: center;
	align-items: center;

	&--invisible {
		filter: var(--background-invert-if-dark);
	}

	:deep(svg) {
		width: 100%;
		height: 100%;
	}
}
</style>
