<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<script setup lang="ts" generic="T extends string">
import { mdiUnfoldMoreHorizontal } from '@mdi/js'
import { computed, useTemplateRef } from 'vue'
import NcFormBoxItem from '../NcFormBox/NcFormBoxItem.vue'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'
import { createElementId } from '../../utils/createElementId.ts'

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

const selectId = createElementId()
const selectElement = useTemplateRef('select')

const selectedLabel = computed(() => options.find((option) => option.value === modelValue.value)?.label)

// .showPicker() is not available some browsers (e.g. Safari)
// When the method is not available, we keep select overlay clickable not invisible
// When the method is available, hidden select is not directly clickable but opens programmatically
// The last approach looks slightly better without focusing select by click
const isShowPickerAvailable = 'showPicker' in HTMLSelectElement.prototype

/**
 * Handle label click to open the native select picker if possible.
 *
 * @param event - Click event
 */
function onLabelClick(event: MouseEvent) {
	if (!isShowPickerAvailable) {
		return
	}
	event?.preventDefault()
	selectElement.value!.showPicker()
}
</script>

<template>
	<NcFormBoxItem
		tag="label"
		:for="selectId"
		:label
		:description="selectedLabel"
		:disabled
		:pure="!isShowPickerAvailable"
		inverted-accent
		@click="onLabelClick">
		<template #icon>
			<NcIconSvgWrapper :path="mdiUnfoldMoreHorizontal" inline />
		</template>
		<template #extra="{ descriptionId }">
			<select
				:id="selectId"
				ref="select"
				v-model="modelValue"
				:class="[$style.hiddenSelect, { [$style.hiddenSelect_manual]: isShowPickerAvailable }]"
				:aria-describedby="descriptionId">
				<option v-for="option in options" :key="option.value" :value="option.value">
					{{ option.label }}
				</option>
			</select>
		</template>
	</NcFormBoxItem>
</template>

<style lang="scss" module>
.hiddenSelect {
	position: absolute;
	inset: 0;
	margin: 0;
	height: auto;
	cursor: pointer;
	/* TODO: does it work well cross-browser? */
	opacity: 0;
}

// Select is open manual instead of opening by click on invisible select
.hiddenSelect_manual {
	pointer-events: none;
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
