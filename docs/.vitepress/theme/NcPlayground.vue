<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import NcRepl from './NcRepl.vue'

const DEFAULT_CODE = `<script setup>
import { ref } from 'vue'

const count = ref(0)
${'<'}/script>

<template>
	<NcButton variant="primary" @click="count++">
		Clicked {{ count }} times
	</NcButton>
</template>
`

// The state of the playground is stored in the URL hash, so it can be shared
const state = window.location.hash.length > 1 ? window.location.hash : undefined

/**
 * Keep the URL in sync with the code
 *
 * @param newState - The serialized state
 */
function onChange(newState: string) {
	window.history.replaceState(window.history.state, '', newState)
}
</script>

<template>
	<NcRepl
		class="nc-playground"
		:code="DEFAULT_CODE"
		:state="state"
		layout="horizontal"
		@change="onChange" />
</template>

<style>
.nc-repl.nc-playground {
	height: calc(100vh - var(--vp-nav-height));
}
</style>
