<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="story-wrapper">
		<NcSelect
			v-model="value"
			:inputLabel="inputLabel"
			:multiple="multiple"
			:disabled="disabled"
			:placeholder="placeholder"
			:options="options"
			@update:modelValue="$emit('selected', $event)" />
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NcSelect from '../../../../src/components/NcSelect/NcSelect.vue'

const props = withDefaults(defineProps<{
	inputLabel?: string
	multiple?: boolean
	disabled?: boolean
	placeholder?: string
	options?: string[]
	preselected?: boolean
}>(), {
	inputLabel: 'Choose an option',
	multiple: false,
	disabled: false,
	placeholder: '',
	options: () => (['foo', 'bar', 'baz', 'qux', 'quux']),
	preselected: false,
})

defineEmits<{
	selected: [data?: string | string[]]
}>()

const value = ref<string | string[] | undefined>(props.preselected
	? props.multiple ? ['foo', 'bar'] : 'foo'
	: undefined)
</script>

<style scoped>
.story-wrapper {
	padding: 20px;
	max-width: 400px;
}
</style>
