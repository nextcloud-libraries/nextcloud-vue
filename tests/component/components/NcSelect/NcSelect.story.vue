<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcSelect
		v-model="selection"
		:inputLabel="inputLabel"
		:options="options"
		:multiple="multiple"
		:keepOpen="keepOpen" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NcSelect from '../../../../src/components/NcSelect/NcSelect.vue'

const props = withDefaults(defineProps<{
	inputLabel?: string
	options?: string[]
	multiple?: boolean
	keepOpen?: boolean
	initialValue?: string | string[] | null
}>(), {
	inputLabel: 'Choose a fruit',
	options: () => ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'],
	multiple: false,
	keepOpen: false,
	initialValue: null,
})

const selection = ref(props.initialValue)
</script>
