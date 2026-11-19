<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcActions ariaLabel="Actions">
		<NcActionButton>Edit</NcActionButton>
		<NcActionButton>Delete</NcActionButton>
	</NcActions>
</template>

<script setup lang="ts">
import NcActionButton from '../../../../src/components/NcActionButton/NcActionButton.vue'
import NcActions from '../../../../src/components/NcActions/NcActions.vue'
</script>
