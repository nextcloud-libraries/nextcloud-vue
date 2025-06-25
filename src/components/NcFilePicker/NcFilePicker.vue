<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { Slot } from 'vue'

import { computed, nextTick, useTemplateRef } from 'vue'
import IconFolderUpload from 'vue-material-design-icons/FolderUpload.vue'
import IconPlus from 'vue-material-design-icons/Plus.vue'
import IconUpload from 'vue-material-design-icons/Upload.vue'
import NcActionButton from '../NcActionButton/NcActionButton.vue'
import NcActionCaption from '../NcActionCaption/NcActionCaption.vue'
import NcActions from '../NcActions/NcActions.vue'
import NcLoadingIcon from '../NcLoadingIcon/NcLoadingIcon.vue'
import { t } from '../../l10n.js'

const props = withDefaults(defineProps<{
	/**
	 * File types to accept
	 */
	accept?: string[]

	/**
	 * Optional menu caption to be shown above the actions
	 */
	actionCaption?: string

	/**
	 * Allow picking a directory
	 */
	directory?: boolean

	/**
	 * Disable picking files and only allow picking a directory
	 */
	directoryOnly?: boolean

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
	 *
	 * @default 'Pick file' or 'Pick files' depending on `multiple`
	 */
	label?: string

	/**
	 * If set then the picker will be set into a loading state.
	 * This means the picker is disabled, a loading spinner is shown and the label is adjusted.
	 */
	loading?: boolean

	/**
	 * Can the user pick multiple files.
	 * This is ignored when picking folder (by browser limitations).
	 */
	multiple?: boolean

	/**
	 * The variant of the button
	 */
	variant?: 'primary' | 'secondary' | 'tertiary'
}>(), {
	accept: undefined,
	actionCaption: '',
	label: undefined,
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
 * The current label to be used as menu name and accessible name of the picker.
 */
const currentLabel = computed(() => {
	if (props.loading) {
		return t('Uploading …')
	} else if (props.label) {
		return props.label
	} else if (props.directoryOnly) {
		return t('Pick folder')
	}
	return props.multiple ? t('Pick files') : t('Pick file')
})

/**
 * Check whether the current browser supports uploading directories
 * Hint: This does not check if the current connection supports this, as some browsers require a secure context!
 */
const canUploadFolders = computed(() => {
	return (props.directory || props.directoryOnly) && 'webkitdirectory' in HTMLInputElement.prototype
})

/**
 * Trigger file picker
 *
 * @param uploadFolders - Whether to upload folders or files
 */
function triggerPickFiles(uploadFolders: boolean) {
	// Without reset selecting the same file doesn't trigger the change event
	reset()

	// Only if the browser supports picking folders and the user selected "pick folder" we set the file input to directory picking.
	if (canUploadFolders.value) {
		inputElement.value!.webkitdirectory = uploadFolders
	}

	// Wait for the reset and the `webkitdirectory` to be dispatched in DOM
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
	<form
		ref="form"
		:class="$style.filePicker">
		<NcActions
			:aria-label="currentLabel"
			:disabled="disabled || loading"
			:menu-name="iconOnly ? undefined : currentLabel"
			:force-name="!iconOnly"
			:variant>
			<template #icon>
				<slot v-if="!loading" name="icon">
					<IconPlus :size="20" />
				</slot>
				<NcLoadingIcon v-else />
			</template>

			<NcActionCaption v-if="actionCaption" :name="actionCaption" />

			<NcActionButton
				v-if="!directoryOnly"
				close-after-click
				@click="triggerPickFiles(false)">
				<template #icon>
					<IconUpload :size="20" />
				</template>
				<!-- If this is not the only action in the NcActions this is a menu entry and we need a generic name - otherwise this will be a single button where we need to apply the label -->
				{{ canUploadFolders || $slots.actions ? (multiple ? t('Upload files') : t('Upload file')) : currentLabel }}
			</NcActionButton>

			<NcActionButton
				v-if="canUploadFolders"
				close-after-click
				@click="triggerPickFiles(true)">
				<template #icon>
					<IconFolderUpload style="color: var(--color-primary-element)" :size="20" />
				</template>
				<!-- If this is not the only action in the NcActions this is a menu entry and we need a generic name - otherwise this will be a single button where we need to apply the label -->
				{{ !directoryOnly || $slots.actions ? t('Upload folder') : currentLabel }}
			</NcActionButton>

			<!-- App defined upload actions -->
			<slot name="actions" />
		</NcActions>

		<!-- Hidden files picker input - also hidden for accessibility as otherwise such users also loose the ability to pick files -->
		<input
			ref="input"
			:accept="accept?.join(', ')"
			aria-hidden="true"
			class="hidden-visually"
			:multiple
			type="file"
			@change="onPick">

		<slot />
	</form>
</template>

<style module>
.filePicker {
	display: inline-flex;
	align-items: center;
	height: var(--default-clickable-area);
}
</style>

<docs>
This component allows to pick local files (or directories) which can be used to upload them to Nextcloud or directly process them in the browser.

### Exposed methods

- `function reset(): void`
  This method allows to reset the internal state of the file picker to clear the current selection

### Example

```vue
<template>
	<div>
		<div class="wrapper">
			<NcFilePicker ref="picker"
				directory
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
