<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { Folder, IFolder, INode } from '@nextcloud/files'
import type { IUpload } from '@nextcloud/files/upload'
import type { FilePickerItem, FilePickerItemGroup } from '../NcFilePicker/NcFilePicker.vue'

import { mdiClose, mdiPlus } from '@mdi/js'
import { openConflictPicker } from '@nextcloud/dialogs'
import { getUniqueName } from '@nextcloud/files'
import { getUploader, UploaderStatus, UploadStatus } from '@nextcloud/files/upload'
import { basename } from '@nextcloud/paths'
import { onBeforeMount, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import NcButton from '../NcButton/NcButton.vue'
import NcFilePicker from '../NcFilePicker/NcFilePicker.vue'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'
import NcProgressBar from '../NcProgressBar/NcProgressBar.vue'
import { useFormatRelativeTime } from '../../composables/index.ts'
import { t } from '../../l10n.ts'
import { createElementId } from '../../utils/createElementId.ts'
import { logger } from '../../utils/logger.ts'

const props = withDefaults(defineProps<{
	/**
	 * Actions to be shown in the upload picker menu.
	 */
	actions?: FilePickerItem[] | FilePickerItemGroup[]

	/**
	 * The upload destination folder
	 */
	destination: IFolder

	/**
	 * A callback function to get the list of files present in the destination folder.
	 */
	content: (relativePath?: string) => Promise<INode[]>

	/**
	 * Allowed MIME types to upload
	 */
	accept?: string[]

	/**
	 * Disable the upload picker
	 */
	disabled?: boolean

	/**
	 * The label of the upload picker button
	 */
	label?: string

	/**
	 * Allow uploading multiple files
	 */
	multiple?: boolean

	/**
	 * Only show the icon without text label
	 */
	iconOnly?: boolean

	/**
	 * The variant of the menu button
	 */
	variant?: 'primary' | 'secondary' | 'tertiary'

	/**
	 * Allow uploading directories
	 */
	directory?: boolean
}>(), {
	actions: () => [],
	accept: () => [],
	label: () => t('New'),
	variant: 'secondary',
})

const emit = defineEmits<{
	paused: [queue: IUpload[]]
	resumed: [queue: IUpload[]]
}>()

defineExpose({
	reset,
	setDestination,
})

const filePickerElement = useTemplateRef('filePicker')
const progressTimeId = createElementId()

const uploadManager = getUploader()
onBeforeMount(() => {
	uploadManager.addEventListener('uploadFinished', updateUploadStatus)
	uploadManager.addEventListener('uploadStarted', updateUploadStatus)
	uploadManager.addEventListener('uploadProgress', updateEta)
	uploadManager.addEventListener('paused', onUploaderPaused)
	uploadManager.addEventListener('resumed', onUploaderResumed)
	updateUploadStatus()
})
onUnmounted(() => {
	uploadManager.removeEventListener('uploadFinished', updateUploadStatus)
	uploadManager.removeEventListener('uploadStarted', updateUploadStatus)
	uploadManager.removeEventListener('uploadProgress', updateEta)
	uploadManager.removeEventListener('paused', onUploaderPaused)
	uploadManager.removeEventListener('resumed', onUploaderResumed)
})

watch(() => props.destination, () => setDestination(props.destination), { immediate: true })

const isPaused = ref(uploadManager.status === UploaderStatus.PAUSED)
/** Handle uploader paused event */
function onUploaderPaused() {
	isPaused.value = true
	emit('paused', [...uploadManager.queue])
}
/** Handle uploader resumed event */
function onUploaderResumed() {
	isPaused.value = false
	emit('resumed', [...uploadManager.queue])
}

const hasFailure = ref(false)
const isUploading = ref(false)
const isAssembling = ref(false)
const isOnlyAssembling = ref(false)

/**
 * Update the upload status flags based on the current queue
 */
function updateUploadStatus() {
	hasFailure.value = uploadManager.queue.some((upload: IUpload) => upload.status === UploadStatus.FAILED)
	isUploading.value = uploadManager.queue.some((upload: IUpload) => upload.status !== UploadStatus.CANCELLED)
	isAssembling.value = uploadManager.queue.some((upload: IUpload) => upload.status === UploadStatus.ASSEMBLING)
	isOnlyAssembling.value = isAssembling.value
		&& uploadManager.queue.every((upload: IUpload) => (
			// either a meta upload
			upload.children.length === 0
			// or all the uploads are assembling or finished
			|| upload.status === UploadStatus.ASSEMBLING
			|| upload.status === UploadStatus.FINISHED
		))
}

/**
 * Reset the file input form
 */
function reset() {
	filePickerElement.value?.reset()
}

/**
 * Set the upload destination
 *
 * @param destination - The new upload destination
 */
function setDestination(destination: IFolder) {
	if (!destination) {
		logger.debug('Invalid destination')
		return
	}

	uploadManager.destination = destination as Folder
}

const etaProgress = ref(0)
const etaSpeed = ref('')
const etaTimeRaw = ref(0)
const etaTime = useFormatRelativeTime(etaTimeRaw, { ignoreSeconds: true })
/** Update the ETA and speed values */
function updateEta() {
	etaTimeRaw.value = uploadManager.statistics.eta === Infinity ? Infinity : uploadManager.statistics.eta * 1000
	etaSpeed.value = uploadManager.statistics.speedReadable
	etaProgress.value = uploadManager.statistics.eta.progress
}

/**
 * Start uploading
 *
 * @param files - The files to upload
 */
async function onPick(files: File[]) {
	try {
		await uploadManager
			.batchUpload('', files, { callback: handleConflicts })
	} catch (error) {
		logger.debug('Error while uploading', { error })
	} finally {
		reset()
	}
}

/**
 * Handle conflicts during upload
 *
 * @param nodes - The nodes that might conflict
 * @param currentPath - The path of the current directory
 */
async function handleConflicts(nodes: string[], currentPath: string): Promise<Record<string, string> | false> {
	const content = await props.content(currentPath)
	const conflicts = content.filter((node) => nodes.includes(node.basename))
	const uploadMapping = Object.fromEntries(nodes.map((name) => [name, name]))
	if (conflicts.length === 0) {
		return uploadMapping
	}

	const result = await openConflictPicker(basename(currentPath), conflicts, content, { recursive: props.directory })
	if (result) {
		const usedNames = content.map((node) => node.basename)
		for (const node of conflicts) {
			if ((result.skipped as unknown as INode[]).some((skipped) => skipped.basename === node.basename)) {
				delete uploadMapping[node.basename]
			} else if ((result.renamed as unknown as INode[]).some((renamed) => renamed.basename === node.basename)) {
				const newName = getUniqueName(basename(node.basename), usedNames)
				uploadMapping[node.basename] = newName
				usedNames.push(newName)
			}
		}
		return uploadMapping
	}
	return false
}

/**
 * Cancel ongoing queue
 */
function onCancel() {
	uploadManager.queue.forEach((upload: IUpload) => {
		upload.cancel()
	})
	reset()
}
</script>

<template>
	<NcFilePicker
		ref="filePicker"
		:accept
		:actionCaption="actions.length > 0 || directory ? t('Upload from device') : undefined"
		:actions
		:directory
		:disabled
		:iconOnly
		:label
		:multiple
		:variant
		@pick="onPick">
		<template #icon>
			<NcIconSvgWrapper :path="mdiPlus" />
		</template>

		<!-- Progressbar and status -->
		<div
			v-show="isUploading"
			:class="[$style.uploadPicker_progress, {
				[$style.uploadPicker_progress__uploading]: isUploading,
				[$style.uploadPicker_progress__paused]: isPaused,
			}]">
			<NcProgressBar
				:aria-label="t('Upload progress')"
				:aria-describedby="progressTimeId"
				:error="hasFailure"
				:value="etaProgress"
				size="medium" />
			<p :id="progressTimeId" :class="$style.uploadPicker_progressLabel">
				<span v-if="isPaused">
					{{ t('paused') }}
				</span>
				<span v-else-if="isOnlyAssembling">
					<!-- TRANSLATORS: Chunks are assembled and the process runs -->
					{{ t('assembling') }}
				</span>
				<span v-else :title="`${etaTime} (${etaSpeed})`">
					{{ etaTimeRaw === Infinity ? t('Estimating …') : etaTime }}
					<!-- the speed is included in the tooltip / title so we only show it in the text content if there is enough space (not showing "a few seconds left") -->
					<span v-if="etaSpeed && etaTimeRaw > 60000">
						({{ etaSpeed }})
					</span>
				</span>
			</p>
		</div>

		<!-- Cancel upload button -->
		<NcButton
			v-if="isUploading && !isOnlyAssembling"
			:class="$style.uploadPicker_cancelButton"
			:aria-label="t('Cancel uploads')"
			variant="tertiary"
			@click="onCancel">
			<template #icon>
				<NcIconSvgWrapper :path="mdiClose" />
			</template>
		</NcButton>
	</NcFilePicker>
</template>

<style module>
.uploadPicker_progress {
	--upload-picker-progress-width: 200px;
	width: var(--upload-picker-progress-width);
	/* Animate show/hide */
	max-width: 0;
	transition: max-width var(--animation-quick) ease-in-out;
	/* Align progress/text separation with the middle */
	margin-top: 8px;
}

.uploadPicker_progress__uploading {
	max-width: var(--upload-picker-progress-width);

	/* Visually more pleasing spacing */
	margin-inline: 8px 20px;
}

.uploadPicker_progress__paused {
	animation: breathing 3s ease-out infinite normal;
}

.uploadPicker_progressLabel {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
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

<docs>
## Requirements

To use the `NcUploadPicker` component, you need to install the following packages:
- `@nextcloud/dialogs`
- `@nextcloud/files`

## Usage

**TODO**: Add usage example here
</docs>
