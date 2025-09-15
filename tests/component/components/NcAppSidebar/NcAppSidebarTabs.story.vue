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
		<NcAppSidebarTab id="first" icon="icon-details" name="Tab1">
			Tab1
		</NcAppSidebarTab>
		<NcAppSidebarTab id="second" icon="icon-details" name="Tab2">
			Tab2
		</NcAppSidebarTab>
		<NcAppSidebarTab id="last" icon="icon-details" name="Tab3">
			Tab3
		</NcAppSidebarTab>
	</NcAppSidebarTabs>
</template>
