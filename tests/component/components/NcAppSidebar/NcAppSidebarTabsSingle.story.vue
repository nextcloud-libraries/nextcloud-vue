<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import NcAppSidebarTabs from '../../../../src/components/NcAppSidebar/NcAppSidebarTabs.vue'
import NcAppSidebarTab from '../../../../src/components/NcAppSidebarTab/NcAppSidebarTab.vue'
</script>

<template>
	<NcAppSidebarTabs>
		<NcAppSidebarTab id="first" icon="icon-details" name="tab name">
			Tab content
		</NcAppSidebarTab>
	</NcAppSidebarTabs>
</template>
