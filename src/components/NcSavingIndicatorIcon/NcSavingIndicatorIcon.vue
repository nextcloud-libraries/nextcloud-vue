<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
# Usage

```
<template>
<div>
	<div>
		<NcSavingIndicatorIcon :name="`${savingState === 'error' ? 'Error saving' : savingState} file`"
			:error="savingState === 'error'"
			:saving="savingState === 'saving'" />
	</div>
	<br />
	<div style="display: flex; justify-content: space-around;">
		<NcCheckboxRadioSwitch v-model="savingState"
			value="saved"
			name="saving_radio"
			type="radio">
			Saved
		</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch v-model="savingState"
			value="saving"
			name="saving_radio"
			type="radio">
			Saving
		</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch v-model="savingState"
			value="error"
			name="saving_radio"
			type="radio">
			Error
		</NcCheckboxRadioSwitch>
	</div>
</div>
</template>
<script>
export default {
	data() {
		return {
			savingState: 'saved',
		}
	},
}
</script>

```
</docs>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
	/**
	 * Specify the size of the saving icon.
	 */
	size?: number

	/**
	 * Specify what is saved.
	 * If not set the element will be hidden from accessibility tree.
	 */
	name?: string

	/**
	 * Set to true when saving is in progress.
	 */
	saving?: boolean

	/**
	 * Set to true if an error occured while saving.
	 */
	error?: boolean
}>(), {
	error: false,
	name: '',
	saving: false,
	size: 20,
})

defineEmits<{
	/**
	 * Click event on the icon.
	 */
	click: [MouseEvent]
}>()

const indicatorColor = computed(() => {
	if (props.error) {
		return 'var(--color-text-error, var(--color-error))'
	}
	if (props.saving) {
		return 'var(--color-primary-element)'
	}
	return 'none'
})
</script>

<template>
	<span :aria-label="name"
		class="material-design-icon"
		role="img"
		@click="$emit('click', $event)">
		<svg class="material-design-icon__svg"
			:width="size"
			:height="size"
			viewBox="0 0 24 24">
			<path :fill="indicatorColor" d="m19 15a4 4 0 0 0-4 4 4 4 0 0 0 4 4 4 4 0 0 0 4-4 4 4 0 0 0-4-4z" />
			<path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z">
				<title v-if="name">{{ name }}</title>
			</path>
		</svg>
	</span>
</template>
