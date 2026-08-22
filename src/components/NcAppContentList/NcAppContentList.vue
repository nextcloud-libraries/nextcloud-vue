<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div
		class="app-content-list"
		:class="{ selection, showdetails: showDetails }">
		<slot />
	</div>
</template>

<script setup lang="ts">
import type { Slot } from 'vue'

defineProps<{
	/**
	 * Is the list selected
	 */
	selection?: boolean

	/**
	 * Is the details pane shown
	 */
	showDetails?: boolean
}>()

defineSlots<{
	/**
	 * The content of the list
	 */
	default?: Slot
}>()
</script>
