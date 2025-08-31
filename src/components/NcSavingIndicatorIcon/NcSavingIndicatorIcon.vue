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
		<NcCheckboxRadioSwitch :checked.sync="savingState"
			value="saved"
			name="saving_radio"
			type="radio">
			Saved
		</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch :checked.sync="savingState"
			value="saving"
			name="saving_radio"
			type="radio">
			Saving
		</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch :checked.sync="savingState"
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

<template>
	<span
		:aria-label="name"
		class="material-design-icon"
		role="img"
		@click="$emit('click', $event)">
		<svg
			:fill="fillColor"
			class="material-design-icon__svg"
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

<script>
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'NcSavingIndicatorIcon',
	props: {
		/**
		 * Specify the size of the saving icon.
		 */
		size: {
			type: Number,
			default: 20,
		},

		/**
		 * Specify what is saved.
		 */
		name: {
			type: String,
			default: '',
		},

		/**
		 * Set to true when saving is in progress.
		 */
		saving: {
			type: Boolean,
			default: false,
			required: false,
		},

		/**
		 * Set to true if an error occured while saving.
		 */
		error: {
			type: Boolean,
			default: false,
			required: false,
		},
	},

	emits: ['click'],
	computed: {
		indicatorColor() {
			return this.error ? 'var(--color-text-error, var(--color-error))' : (this.saving ? 'var(--color-primary-element)' : 'none')
		},
	},
})
</script>
