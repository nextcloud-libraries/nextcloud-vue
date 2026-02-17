<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import IconFolderUpload from 'vue-material-design-icons/FolderUpload.vue'
import IconPlus from 'vue-material-design-icons/Plus.vue'
import IconUpload from 'vue-material-design-icons/Upload.vue'
import NcActionButton from '../NcActionButton/NcActionButton.vue'
import NcActionCaption from '../NcActionCaption/NcActionCaption.vue'
import NcActions from '../NcActions/NcActions.vue'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'
import NcLoadingIcon from '../NcLoadingIcon/NcLoadingIcon.vue'
import { t } from '../../l10n.js'

export interface FilePickerItem {
	/**
	 * SVG icon (as string) for the action
	 */
	iconSvg: string
	/**
	 * Label of the action
	 */
	label: string
	/**
	 * Callback when the action is clicked
	 */
	onClick: () => void
}

export interface FilePickerItemGroup {
	/**
	 * Caption for the action group
	 */
	caption: string
	/**
	 * Actions within this group
	 */
	actions: FilePickerItem[]
}

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
	 * Additional actions to be shown within the picker menu
	 */
	actions?: FilePickerItem[] | FilePickerItemGroup[]

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
	actions: () => [],
	accept: undefined,
	actionCaption: '',
	label: undefined,
	variant: 'primary',
})

const emit = defineEmits<{
	(event: 'pick', files: File[]): void
}>()

defineExpose({
	reset,
})

const formElement = ref<HTMLFormElement | null>(null)
const inputElement = ref<HTMLInputElement | null>(null)

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
		ref="formElement"
		:class="$style.filePicker">
		<NcActions
			:aria-label="currentLabel"
			:disabled="disabled || loading"
			:menu-name="iconOnly ? undefined : currentLabel"
			:force-name="!iconOnly"
			:variant="variant">
			<template #icon>
				<!-- @slot Optional custom icon for the picker menu -->
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
				{{ (canUploadFolders || !!$slots.actions) ? (multiple ? t('Upload files') : t('Upload file')) : currentLabel }}
				<!-- If this is not the only action in the NcActions this is a menu entry and we need a generic name - otherwise this will be a single button where we need to apply the label -->
			</NcActionButton>

			<NcActionButton
				v-if="canUploadFolders"
				close-after-click
				@click="triggerPickFiles(true)">
				<template #icon>
					<IconFolderUpload style="color: var(--color-primary-element)" :size="20" />
				</template>
				{{ (!directoryOnly || !!$slots.actions) ? t('Upload folder') : currentLabel }}
				<!-- If this is not the only action in the NcActions this is a menu entry and we need a generic name - otherwise this will be a single button where we need to apply the label -->
			</NcActionButton>

			<template v-for="group of actions">
				<NcActionCaption
					v-if="group.caption"
					:key="group.caption"
					:name="group.caption" />

				<NcActionButton
					v-for="action of group.actions ?? [group]"
					:key="action.label"
					close-after-click
					@click="action.onClick">
					<template #icon>
						<NcIconSvgWrapper :svg="action.iconSvg" />
					</template>
					{{ action.label }}
				</NcActionButton>
			</template>
		</NcActions>

		<!-- Hidden files picker input - also hidden for accessibility as otherwise such users also loose the ability to pick files -->
		<input
			ref="inputElement"
			:accept="accept?.join(', ')"
			aria-hidden="true"
			class="hidden-visually"
			:multiple="multiple"
			type="file"
			@change="onPick">

		<!-- @slot Optional content to be shown in the picker. This can be used e.g. for a progress bar or similar. -->
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
			<li v-for="file in selectedFiles" :key="file.name">
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
