<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<script setup lang="ts" generic="T extends string">
import { computed, useId, useTemplateRef } from 'vue'
import IconUnfoldMoreHorizontal from 'vue-material-design-icons/UnfoldMoreHorizontal.vue'
import NcFormBoxItem from '../NcFormBox/NcFormBoxItem.vue'

/** Selected value */
const modelValue = defineModel<T>({ required: true })

const {
	label = undefined,
	options,
	disabled = false,
} = defineProps<{
	/** Main label */
	label?: string
	/** Select options */
	options: {
		label: string
		value: T
	}[]
	/** Disabled state */
	disabled?: boolean
}>()

const selectId = useId()
const selectElement = useTemplateRef('select')
const selectedLabel = computed(() => options.find((option) => option.value === modelValue.value)?.label)
</script>

<template>
	<NcFormBoxItem
		tag="label"
		:for="selectId"
		:label
		:description="selectedLabel"
		:disabled
		inverted-accent
		@click.prevent="selectElement!.showPicker() /* Not available in old Safari */">
		<template #icon="{ descriptionId }">
			<IconUnfoldMoreHorizontal :size="20" />
			<select
				:id="selectId"
				ref="select"
				v-model="modelValue"
				class="hidden-select"
				:aria-describedby="descriptionId">
				<option v-for="option in options" :key="option.value" :value="option.value">
					{{ option.label }}
				</option>
			</select>
		</template>
	</NcFormBoxItem>
</template>

<!-- TODO: module -->
<style scoped>
.hidden-select {
	position: absolute;
	inset: 0;
	margin: 0;
	height: auto;
	/* TODO: does it work well cross-browser? */
	opacity: 0;
	pointer-events: none;

	option {
		pointer-events: all;
	}
}
</style>

<docs>
### General

Native select wrapper to be used inside `NcFormBox`.

```vue
<script>
export default {
	data() {
		return {
			playSoundChat: 'always',
			playSoundCall: 'always',
			enableCallbox: 'always',
			notificationLevelOptions: [
				{ label: 'Always', value: 'always' },
				{ label: 'Only when away', value: 'away' },
				{ label: 'Never', value: 'never' },
			],
		}
	}
}
</script>

<template>
	<NcFormGroup label="Notifications and sounds">
		<NcFormBox>
			<NcFormBoxSelectNative v-model="playSoundChat" label="Play chat notification sound" :options="notificationLevelOptions" />
			<NcFormBoxSelectNative v-model="playSoundCall" label="Play call notification sound" :options="notificationLevelOptions" />
			<NcFormBoxSelectNative v-model="enableCallbox" label="Show call notification popup" :options="notificationLevelOptions" />
		</NcFormBox>
	</NcFormGroup>
</template>
```
</docs>
