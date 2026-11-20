<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div>
		<!-- Resets the open state on `closed` like the file list row actions do -->
		<NcActions
			v-model:open="open"
			ariaLabel="Actions"
			@opened="opened++"
			@closed="onClosed">
			<NcActionButton>Edit</NcActionButton>
			<NcActionButton>Delete</NcActionButton>
		</NcActions>
		<p data-testid="opened">
			{{ opened }}
		</p>
		<p data-testid="closed">
			{{ closed }}
		</p>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NcActionButton from '../../../../src/components/NcActionButton/NcActionButton.vue'
import NcActions from '../../../../src/components/NcActions/NcActions.vue'

const open = ref(false)
const opened = ref(0)
const closed = ref(0)

/**
 * Count the event and reset the open state.
 */
function onClosed() {
	closed.value++
	open.value = false
}
</script>
