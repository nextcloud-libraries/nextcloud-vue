<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<!-- Ensure NcActions work with Composition API components (nextcloud/nextcloud-vue#3719) -->

<template>
	<NcActions :force-menu="true">
		<NcActionButton />
	</NcActions>
</template>

<script setup>
import NcActionButton from '../../../../src/components/NcActionButton/NcActionButton.vue'
import NcActions from '../../../../src/components/NcActions/NcActions.vue'
</script>
