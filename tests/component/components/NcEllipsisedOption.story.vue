<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="story-wrapper">
		<NcEllipsisedOption :name="name" :search="search" />
	</div>
</template>

<script setup lang="ts">
import NcEllipsisedOption from '../../../src/components/NcEllipsisedOption/NcEllipsisedOption.vue'

defineProps<{
	name: string
	search?: string
}>()
</script>

<style scoped>
.story-wrapper {
	width: 220px;
	padding: 20px;
}
</style>
