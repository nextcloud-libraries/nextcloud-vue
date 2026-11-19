<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import { ref } from 'vue'
import NcAppSidebarTabs from '../../../../src/components/NcAppSidebar/NcAppSidebarTabs.vue'
import NcAppSidebarTab from '../../../../src/components/NcAppSidebarTab/NcAppSidebarTab.vue'

const active = ref('second')
</script>

<template>
	<NcAppSidebarTabs v-model:active="active">
		<NcAppSidebarTab id="first" name="Tab1">
			<!-- The active tab renders the filled icon variant, others the outline -->
			<template #icon="{ selected }">
				<span :data-testid="selected ? 'first-filled' : 'first-outline'" />
			</template>
			Tab1
		</NcAppSidebarTab>
		<NcAppSidebarTab id="second" name="Tab2">
			<template #icon="{ selected }">
				<span :data-testid="selected ? 'second-filled' : 'second-outline'" />
			</template>
			Tab2
		</NcAppSidebarTab>
	</NcAppSidebarTabs>
</template>
