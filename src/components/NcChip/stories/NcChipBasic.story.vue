<!--
 - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<script setup>
import { mdiClock, mdiFile, mdiPalette } from '@mdi/js'
import NcChip from '../NcChip.vue'
</script>

<template>
	<div class="wrapper">
		<NcChip text="Notes.txt" />
		<NcChip text="Files" :icon-path="mdiFile" />
		<NcChip text="Color" :icon-path="mdiPalette" variant="tertiary" />
		<NcChip text="Current time"
			:icon-path="mdiClock"
			no-close
			variant="primary" />
	</div>
</template>

<style scoped>
.wrapper {
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
}
</style>
