<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="story-wrapper">
		<NcPasswordField
			:as-text="asText"
			label="Password"
			model-value="password"
			:visible="visible" />
	</div>
</template>

<script setup>
import NcPasswordField from '../../../src/components/NcPasswordField/NcPasswordField.vue'

defineProps({
	asText: {
		type: Boolean,
		default: undefined,
	},
	visible: {
		type: Boolean,
		default: undefined,
	},
})
</script>

<style scoped>
.story-wrapper {
	margin-inline: auto;
	max-width: 300px;
	padding-top: 8px;
}
</style>
