<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { Slot } from 'vue'

defineSlots<{
	/**
	 * Provide content to the details view.
	 * Passing content to this slot is required!
	 */
	default?: Slot
}>()
</script>

<template>
	<div class="app-content-details">
		<slot />
	</div>
</template>
