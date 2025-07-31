<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="story-wrapper">
		<NcPasswordField
			:as-text
			label="Password"
			model-value="password"
			:visible />
	</div>
</template>

<script setup lang="ts">
import NcPasswordField from '../../../../src/components/NcPasswordField/NcPasswordField.vue'

withDefaults(defineProps<{
	asText?: boolean
	visible?: boolean
}>(), {
	asText: undefined,
	visible: undefined,
})
</script>

<style scoped>
.story-wrapper {
	margin-inline: auto;
	max-width: 300px;
	padding-top: 8px;
}
</style>
