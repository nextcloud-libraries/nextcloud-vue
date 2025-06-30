<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
This component allows to pick local files (or folders) which can be used to upload them to Nextcloud.

### Exposed methods

- `function reset(): void`
  This method allows to reset the internal state of the file picker to clear the current selection

### Example

```vue
<template>
	<div>
		<div class="wrapper">
			<NcFilePicker ref="picker"
				allow-folders
				@pick="selectedFiles = $event" />

			<NcButton variant="tertiary"
				@click="clearPicker">
				Clear
			</NcButton>
		</div>

		<h3>Selected files:</h3>
		<ul>
			<li v-for="file in selectedFiles" key="file.name">
				{{ file.webkitRelativePath || file.name }}
			</li>
		</ul>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				selectedFiles: [],
			}
		},
		methods: {
			/**
			 * This will clear the selected files from the picker.
			 */
			clearPicker() {
				this.$refs.picker.reset()
			},
		},
	}
</script>
<style scoped>
.wrapper {
	display: flex;
	gap: 10px;
}
</style>
```
</docs>

<script setup lang="ts">
import type { Slot } from 'vue'

import { computed, nextTick, useTemplateRef } from 'vue'
import { t } from '../../l10n.js'
import IconFolderUpload from 'vue-material-design-icons/FolderUpload.vue'
import IconPlus from 'vue-material-design-icons/Plus.vue'
import IconUpload from 'vue-material-design-icons/Upload.vue'
import NcActionButton from '../NcActionButton/index.js'
import NcActions from '../NcActions/index.js'

const props = withDefaults(defineProps<{
	/**
	 * File types to accept
	 */
	accept?: string[]

	/**
	 * Allow picking a folder
	 */
	allowFolders?: boolean

	/**
	 * Disabled state of the picker
	 */
	disabled?: boolean

	/**
	 * If set then the label is only used for accessibility but not shown visually
	 */
	iconOnly?: boolean

	/**
	 * Label of the picker
	 */
	label?: string

	/**
	 * Can the user pick multiple files
	 */
	multiple?: boolean

	/**
	 * The variant of the button
	 */
	variant?: 'primary' | 'secondary' | 'tertiary'
}>(), {
	accept: undefined,
	label: () => t('Pick files'),
	variant: 'primary',
})

const emit = defineEmits<{
	pick: [files: File[]]
}>()

defineSlots<{
	/**
	 * Custom NcAction* to be shown within the picker menu
	 */
	actions?: Slot

	/**
	 * Optional custom icon for the picker menu
	 */
	icon?: Slot

	/**
	 * Optional content to be shown in the picker.
	 * This can be used e.g. for a progress bar or similar.
	 */
	default?: Slot
}>()

defineExpose({
	reset,
})

const formElement = useTemplateRef('form')
const inputElement = useTemplateRef('input')

/**
 * Check whether the current browser supports uploading directories
 * Hint: This does not check if the current connection supports this, as some browsers require a secure context!
 */
const canUploadFolders = computed(() => {
	return props.allowFolders && 'webkitdirectory' in document.createElement('input')
})

/**
 * Trigger file picker
 *
 * @param uploadFolders - Whether to upload folders or files
 */
function triggerPickFiles(uploadFolders: boolean) {
	// reset the form
	reset()

	// Setup directory picking if enabled
	if (canUploadFolders.value) {
		inputElement.value!.webkitdirectory = uploadFolders
	}
	// Trigger click on the input to open the file picker
	nextTick(() => inputElement.value!.click())
}

/**
 * Handle picking some local files
 */
function onPick() {
	const files = inputElement.value?.files ? Array.from(inputElement.value.files) : []
	emit('pick', files)
}

/**
 * Reset the picker state of the currently selected files.
 */
function reset() {
	formElement.value!.reset()
}
</script>

<template>
	<form ref="form"
		class="vue-file-picker">
		<NcActions :aria-label="label"
			:menu-name="iconOnly ? undefined : label"
			:force-name="!iconOnly"
			:variant>
			<template #icon>
				<slot name="icon">
					<IconPlus :size="20" />
				</slot>
			</template>

			<NcActionButton close-after-click
				@click="triggerPickFiles(false)">
				<template #icon>
					<IconUpload :size="20" />
				</template>
				{{ t('Upload files') }}
			</NcActionButton>

			<NcActionButton v-if="canUploadFolders"
				close-after-click
				@click="triggerPickFiles(true)">
				<template #icon>
					<IconFolderUpload style="color: var(--color-primary-element)" :size="20" />
				</template>
				{{ t('Upload folders') }}
			</NcActionButton>

			<!-- App defined upload actions -->
			<slot name="actions" />
		</NcActions>

		<!-- Hidden files picker input -->
		<input ref="input"
			:accept="accept?.join(', ')"
			:multiple
			class="hidden-visually"
			type="file"
			@change="onPick">

		<slot />
	</form>
</template>

<style lang="scss" scoped>
.vue-file-picker {
	display: inline-flex;
	align-items: center;
	height: var(--default-clickable-area);
}
</style>
