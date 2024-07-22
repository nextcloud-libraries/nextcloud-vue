<!--
  - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcAppNavigation>
		<NcAppNavigationItem name="First" />
		<NcAppNavigationSpacer />
		<NcAppNavigationItem name="Second" />
	</NcAppNavigation>
</template>

<script setup lang="ts">
import NcAppNavigation from '../../../../src/components/NcAppNavigation/NcAppNavigation.vue'
import NcAppNavigationItem from '../../../../src/components/NcAppNavigationItem/NcAppNavigationItem.vue'
import NcAppNavigationSpacer from '../../../../src/components/NcAppNavigationSpacer/NcAppNavigationSpacer.vue'
</script>
