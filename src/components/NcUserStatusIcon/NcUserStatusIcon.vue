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

<script setup lang="ts">
import axios from '@nextcloud/axios'
import { generateOcsUrl } from '@nextcloud/router'
import { getCapabilities } from '@nextcloud/capabilities'
import { computed, watch } from 'vue'
import { getUserStatusText } from '../../utils/UserStatus.ts'
import { t } from '../../l10n.ts'

import onlineSvg from '../../assets/status-icons/user-status-online.svg?raw'
import awaySvg from '../../assets/status-icons/user-status-away.svg?raw'
import busySvg from '../../assets/status-icons/user-status-busy.svg?raw'
import dndSvg from '../../assets/status-icons/user-status-dnd.svg?raw'
import invisibleSvg from '../../assets/status-icons/user-status-invisible.svg?raw'
import logger from '../../utils/logger.ts'

const props = withDefaults(defineProps<{
	/**
	 * Set the user id to fetch the status
	 */
	user?: string

	/**
	 * Set the `aria-hidden` attribute
	 */
	ariaHidden?: boolean | 'true' | 'false'
}>(), {
	user: undefined,
	ariaHidden: false,
})

/**
 * The user preloaded user status.
 */
const status = defineModel<'online' | 'away' | 'busy' | 'dnd' | 'invisible' | 'offline'>('status')
const isInvisible = computed(() => status.value && ['invisible', 'offline'].includes(status.value))

/**
 * Aria label to set on the element (will be set when ariaHidden is not set)
 */
const ariaLabel = computed(() => (
	status.value && (!props.ariaHidden || props.ariaHidden === 'false')
		? t('User status: {status}', { status: getUserStatusText(status.value) })
		: undefined
))

watch(() => props.user, async (user) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	if (!status.value && user && (getCapabilities() as any)?.user_status?.enabled) {
		try {
			const { data } = await axios.get(generateOcsUrl('/apps/user_status/api/v1/statuses/{user}', { user }))
			status.value = data.ocs?.data?.status
		} catch (error) {
			logger.debug('Error while fetching user status', { error })
		}
	}
}, { immediate: true })

const matchSvg = {
	online: onlineSvg,
	away: awaySvg,
	busy: busySvg,
	dnd: dndSvg,
	invisible: invisibleSvg,
	offline: invisibleSvg,
}
const activeSvg = computed(() => status.value && matchSvg[status.value])
</script>

<template>
	<span v-if="status"
		class="user-status-icon"
		:class="{
			'user-status-icon--invisible': isInvisible,
		}"
		:aria-hidden="!ariaLabel || undefined"
		:aria-label
		role="img"
		v-html="activeSvg" /> <!-- eslint-disable-line vue/no-v-html -->
</template>

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
