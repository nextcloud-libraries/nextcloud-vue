<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<form
		v-if="destination"
		ref="form"
		:class="{ 'upload-picker--uploading': isUploading, 'upload-picker--paused': isPaused }"
		class="upload-picker"
		data-cy-upload-picker>
		<!-- New button -->
		<NcButton
			v-if="!haveMenu"
			:aria-label="buttonLabel"
			:disabled="disabled"
			data-cy-upload-picker-add
			data-cy-upload-picker-menu-entry="upload-file"
			:variant="primary ? 'primary' : 'secondary'"
			@click="onTriggerPick()">
			<template #icon>
				<IconPlus :size="20" />
			</template>
			<template v-if="!isUploading" #default>
				{{ buttonLabel }}
			</template>
		</NcButton>

		<NcActions
			v-else
			v-model:open="openedMenu"
			:aria-label="buttonLabel"
			:menu-name="noLabel ? undefined : buttonLabel"
			:variant="primary ? 'primary' : 'secondary'">
			<template #icon>
				<IconPlus :size="20" />
			</template>

			<NcActionCaption :name="t('Upload from device')" />

			<NcActionButton
				data-cy-upload-picker-add
				data-cy-upload-picker-menu-entry="upload-file"
				:close-after-click="true"
				@click="onTriggerPick()">
				<template #icon>
					<IconUpload :size="20" />
				</template>
				{{ t('Upload files') }}
			</NcActionButton>
			<NcActionButton
				v-if="canUploadFolders"
				close-after-click
				data-cy-upload-picker-add-folders
				data-cy-upload-picker-menu-entry="upload-folder"
				@click="onTriggerPick(true)">
				<template #icon>
					<IconFolderUpload :size="20" />
				</template>
				{{ t('Upload folders') }}
			</NcActionButton>

			<!-- App defined upload actions -->
			<template v-if="!noMenu">
				<NcActionButton
					v-for="entry in menuEntriesUpload"
					:key="entry.id"
					:icon="entry.iconClass"
					:close-after-click="true"
					:data-cy-upload-picker-menu-entry="entry.id"
					class="upload-picker__menu-entry"
					@click="onClick(entry)">
					<template v-if="entry.iconSvgInline" #icon>
						<NcIconSvgWrapper :svg="entry.iconSvgInline" />
					</template>
					{{ entry.displayName }}
				</NcActionButton>
			</template>

			<!-- Custom new file entries -->
			<template v-if="!noMenu && menuEntriesNew.length > 0">
				<NcActionSeparator />
				<NcActionCaption :name="t('Create new')" />
				<NcActionButton
					v-for="entry in menuEntriesNew"
					:key="entry.id"
					:icon="entry.iconClass"
					:close-after-click="true"
					:data-cy-upload-picker-menu-entry="entry.id"
					class="upload-picker__menu-entry"
					@click="onClick(entry)">
					<template v-if="entry.iconSvgInline" #icon>
						<NcIconSvgWrapper :svg="entry.iconSvgInline" />
					</template>
					{{ entry.displayName }}
				</NcActionButton>
			</template>

			<!-- other file entries -->
			<template v-if="!noMenu && menuEntriesOther.length > 0">
				<NcActionSeparator />
				<NcActionButton
					v-for="entry in menuEntriesOther"
					:key="entry.id"
					:icon="entry.iconClass"
					:close-after-click="true"
					:data-cy-upload-picker-menu-entry="entry.id"
					class="upload-picker__menu-entry"
					@click="onClick(entry)">
					<template v-if="entry.iconSvgInline" #icon>
						<NcIconSvgWrapper :svg="entry.iconSvgInline" />
					</template>
					{{ entry.displayName }}
				</NcActionButton>
			</template>
		</NcActions>

		<!-- Progressbar and status -->
		<div v-show="isUploading" class="upload-picker__progress">
			<NcProgressBar
				:aria-label="t('Upload progress')"
				:aria-describedby="progressTimeId"
				data-cy-upload-picker-progress
				:error="hasFailure"
				:value="uploadManager.eta.progress"
				size="medium" />
			<p :id="progressTimeId" data-cy-upload-picker-progress-label>
				<span v-if="isPaused">
					{{ t('paused') }}
				</span>
				<span v-else-if="isOnlyAssembling">
					<!-- TRANSLATORS: Chunks are assembled and the process runs -->
					{{ t('assembling') }}
				</span>
				<span v-else :title="etaTimeAndSpeed()">
					{{ uploadManager.eta.timeReadable }}
					<!-- the speed is included in the tooltip / title so we only show it in the text content if there is enough space (not showing "a few seconds left") -->
					<span v-if="uploadManager.eta.speedReadable && uploadManager.eta.time >= 60">
						({{ uploadManager.eta.speedReadable }})
					</span>
				</span>
			</p>
		</div>

		<!-- Cancel upload button -->
		<NcButton
			v-if="isUploading && !isOnlyAssembling"
			class="upload-picker__cancel"
			variant="tertiary"
			:aria-label="t('Cancel uploads')"
			data-cy-upload-picker-cancel
			@click="onCancel">
			<template #icon>
				<IconCancel :size="20" />
			</template>
		</NcButton>

		<!-- Hidden files picker input -->
		<input
			ref="input"
			:accept="accept?.join?.(', ')"
			:multiple="multiple"
			class="hidden-visually"
			data-cy-upload-picker-input
			type="file"
			@change="onPick">
	</form>
</template>

<script setup lang="ts">
import type { NewMenuEntry, Node } from '@nextcloud/files'
import type { Upload } from '@nextcloud/upload'
import type { PropType } from 'vue'

import { openConflictPicker } from '@nextcloud/dialogs'
import { Folder, getNewFileMenuEntries, getUniqueName, NewMenuEntryCategory } from '@nextcloud/files'
import { getConflicts, getUploader, UploaderStatus, UploadStatus } from '@nextcloud/upload'
import { basename } from 'node:path'
import { computed, getCurrentInstance, nextTick, onBeforeMount, ref, watch } from 'vue'
import IconCancel from 'vue-material-design-icons/Cancel.vue'
import IconFolderUpload from 'vue-material-design-icons/FolderUpload.vue'
import IconPlus from 'vue-material-design-icons/Plus.vue'
import IconUpload from 'vue-material-design-icons/Upload.vue'
import NcActionButton from '../NcActionButton/NcActionButton.vue'
import NcActionCaption from '../NcActionCaption/NcActionCaption.vue'
import NcActions from '../NcActions/NcActions.vue'
import NcActionSeparator from '../NcActionSeparator/NcActionSeparator.vue'
import NcButton from '../NcButton/NcButton.vue'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'
import NcProgressBar from '../NcProgressBar/NcProgressBar.vue'
import { t } from '../../l10n.ts'
import { logger } from '../../utils/logger.ts'

const props = defineProps({
	accept: {
		type: Array as PropType<string[]>,
		default: null,
	},

	disabled: {
		type: Boolean,
		default: false,
	},

	multiple: {
		type: Boolean,
		default: false,
	},

	/**
	 * Allow to disable the "new"-menu for this UploadPicker instance
	 */
	noMenu: {
		type: Boolean,
		default: false,
	},

	/**
	 * Allow to disable the button label
	 */
	noLabel: {
		type: Boolean,
		default: false,
	},

	/**
	 * Make the "New"-button primary color.
	 */
	primary: {
		type: Boolean,
		default: false,
	},

	destination: {
		type: Folder,
		required: true,
	},

	allowFolders: {
		type: Boolean,
		default: false,
	},

	/**
	 * A callback function to get the list of files present in the destination folder.
	 */
	content: {
		type: Function as PropType<(relativePath?: string) => Promise<Node[]>>,
		required: true,
	},
})

const emit = defineEmits<{
	uploaded: [upload: Upload]
	failed: [upload: Upload]
	paused: [queue: Upload[]]
	resumed: [queue: Upload[]]
}>()

const uploadManager = getUploader()
onBeforeMount(() => {
	uploadManager.addNotifier(onUploadCompletion)
})
watch(() => props.destination, () => {
	setDestination(props.destination!)
}, { immediate: true })

const progressTimeId = `nc-uploader-progress-${Math.random().toString(36).slice(7)}`

const newFileMenuEntries = ref<NewMenuEntry[]>([])
const openedMenu = ref(false)

const menuEntriesUpload = computed(() => newFileMenuEntries.value.filter((entry) => entry.category === NewMenuEntryCategory.UploadFromDevice))
const menuEntriesNew = computed(() => newFileMenuEntries.value.filter((entry) => entry.category === NewMenuEntryCategory.CreateNew))
const menuEntriesOther = computed(() => newFileMenuEntries.value.filter((entry) => entry.category === NewMenuEntryCategory.Other))

/**
 * Check whether the current browser supports uploading directories
 * Hint: This does not check if the current connection supports this, as some browsers require a secure context!
 */
const canUploadFolders = computed(() => props.allowFolders && 'webkitdirectory' in document.createElement('input'))
const queue = computed(() => uploadManager.queue as Upload[])
const hasFailure = computed(() => queue.value.some((upload: Upload) => upload.status === UploadStatus.FAILED))
const isUploading = computed(() => queue.value.some((upload: Upload) => upload.status !== UploadStatus.CANCELLED))
const isAssembling = computed(() => queue.value.some((upload: Upload) => upload.status === UploadStatus.ASSEMBLING))
const isOnlyAssembling = computed(() => {
	return isAssembling.value
		&& queue.value.every((upload: Upload) => (
			// ignore empty uploads or meta uploads
			upload.size === 0
			// all the uploads are assembling or finished
			|| upload.status === UploadStatus.ASSEMBLING
			|| upload.status === UploadStatus.FINISHED
		))
})
const buttonLabel = computed(() => {
	return props.noMenu ? t('Upload') : t('New')
})
const haveMenu = computed(() => {
	return !((props.noMenu || newFileMenuEntries.value.length === 0) && !canUploadFolders.value)
})

const isPaused = computed(() => uploadManager.info?.status === UploaderStatus.PAUSED)
watch(isPaused, (isPaused) => {
	if (isPaused) {
		emit('paused', queue.value)
	} else {
		emit('resumed', queue.value)
	}
})

/**
 *
 */
function etaTimeAndSpeed(): string {
	const speed = uploadManager.eta.speedReadable
	if (speed) {
		return `${uploadManager.eta.timeReadable} (${speed})`
	}
	return uploadManager.eta.timeReadable
}

/**
 * Handle clicking a new-menu entry
 *
 * @param entry The entry that was clicked
 */
async function onClick(entry: NewMenuEntry) {
	entry.handler(
		props.destination!,
		await props.content().catch(() => []),
	)
}

/**
 * Trigger file picker
 *
 * @param uploadFolders Upload folders
 */
function onTriggerPick(uploadFolders: boolean = false) {
	const input = getCurrentInstance()!.refs.input as HTMLInputElement
	// Setup directory picking if enabled
	if (canUploadFolders.value) {
		input.webkitdirectory = uploadFolders
	}
	// Trigger click on the input to open the file picker
	nextTick(() => input.click())
}

/**
 * Start uploading
 */
async function onPick() {
	const input = getCurrentInstance()!.refs.input as HTMLInputElement
	const files = input.files ? Array.from(input.files) : []

	try {
		await uploadManager
			.batchUpload('', files, async (nodes, currentPath) => {
				const content = await props.content(currentPath)
				const conflicts = getConflicts(nodes, content)
				if (conflicts.length === 0) {
					return nodes
				}

				const result = await openConflictPicker(basename(currentPath), conflicts, content, { recursive: props.allowFolders })
				if (result) {
					const names: string[] = content.map((n) => n.displayname)
					for (const node of result.renamed) {
						const newName = getUniqueName(node.name, names)
						names.push(newName)
						Object.defineProperty(node, 'name', newName)
					}
					return [
						...result.selected,
						...result.renamed,
					]
				}
				return false
			})
	} catch (error) {
		logger.debug('Error while uploading', { error })
	} finally {
		resetForm()
	}
}

/**
 *
 */
function resetForm() {
	const form = getCurrentInstance()!.refs.form as HTMLFormElement
	form?.reset()
}

/**
 * Cancel ongoing queue
 */
function onCancel() {
	uploadManager.queue.forEach((upload: Upload) => {
		upload.cancel()
	})
	resetForm()
}

/**
 *
 * @param destination
 */
function setDestination(destination: Folder) {
	if (!props.destination) {
		logger.debug('Invalid destination')
		return
	}

	uploadManager.destination = destination

	// If the destination change, we need to refresh the menu
	newFileMenuEntries.value = getNewFileMenuEntries(destination)
}

/**
 *
 * @param upload
 */
function onUploadCompletion(upload: Upload) {
	if (upload.status === UploadStatus.FAILED) {
		emit('failed', upload)
	} else {
		emit('uploaded', upload)
	}
}
</script>

<style lang="scss" scoped>
$progress-width: 200px;

.upload-picker {
	display: inline-flex;
	align-items: center;
	height: var(--default-clickable-area);

	&__progress {
		width: $progress-width;
		// Animate show/hide
		max-width: 0;
		transition: max-width var(--animation-quick) ease-in-out;

		// Align progress/text separation with the middle
		margin-top: 8px;

		p {
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
	}

	&--uploading &__progress {
		max-width: $progress-width;

		// Visually more pleasing
		margin-right: 20px;
		margin-left: 8px;
	}

	&--paused &__progress {
		animation: breathing 3s ease-out infinite normal;
	}
}

@keyframes breathing {
	0% {
		opacity: .5;
	}
	25% {
		opacity: 1;
	}
	60% {
		opacity: .5;
	}
	100% {
		opacity: .5;
	}
}

</style>
