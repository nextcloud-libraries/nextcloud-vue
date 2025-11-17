<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcFilePicker
		ref="filePicker"
		:accept
		:action-caption="t('Upload from device')"
		:directory
		:disabled
		:icon-only
		:multiple
		:variant
		@pick="onPick">
		<template #icon>
			<NcIconSvgWrapper :path="mdiPlus" />
		</template>

		<template #actions>
			<!-- App defined upload actions -->
			<NcActionButton
				v-for="entry in menuEntriesUpload"
				:key="entry.id"
				close-after-click
				class="upload-picker__menu-entry"
				@click="onClick(entry)">
				<template v-if="entry.iconSvg" #icon>
					<NcIconSvgWrapper :svg="entry.iconSvg" />
				</template>
				{{ entry.label }}
			</NcActionButton>

			<!-- Custom new file entries -->
			<template v-if="!noMenu && menuEntriesNew.length > 0">
				<NcActionSeparator />
				<NcActionCaption :name="t('Create new')" />
				<NcActionButton
					v-for="entry in menuEntriesNew"
					:key="entry.id"
					close-after-click
					class="upload-picker__menu-entry"
					@click="onClick(entry)">
					<template v-if="entry.iconSvg" #icon>
						<NcIconSvgWrapper :svg="entry.iconSvg" />
					</template>
					{{ entry.label }}
				</NcActionButton>
			</template>

			<!-- other file entries -->
			<template v-if="!noMenu && menuEntriesOther.length > 0">
				<NcActionSeparator />
				<NcActionButton
					v-for="entry in menuEntriesOther"
					:key="entry.id"
					close-after-click
					class="upload-picker__menu-entry"
					@click="onClick(entry)">
					<template v-if="entry.iconSvg" #icon>
						<NcIconSvgWrapper :svg="entry.iconSvg" />
					</template>
					{{ entry.label }}
				</NcActionButton>
			</template>
		</template>

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
				<NcIconSvgWrapper :path="mdiClose" />
			</template>
		</NcButton>
	</NcFilePicker>
</template>

<script setup lang="ts">
import type { Folder, IFolder, INode } from '@nextcloud/files'
import type { Upload } from '@nextcloud/upload'

import { mdiClose, mdiPlus } from '@mdi/js'
import { openConflictPicker } from '@nextcloud/dialogs'
import { getUniqueName } from '@nextcloud/files'
import { basename } from '@nextcloud/paths'
import { getConflicts, getUploader, UploaderStatus, UploadStatus } from '@nextcloud/upload'
import { computed, onBeforeMount, useTemplateRef, watch } from 'vue'
import NcActionButton from '../NcActionButton/NcActionButton.vue'
import NcActionCaption from '../NcActionCaption/NcActionCaption.vue'
import NcActionSeparator from '../NcActionSeparator/NcActionSeparator.vue'
import NcButton from '../NcButton/NcButton.vue'
import NcFilePicker from '../NcFilePicker/NcFilePicker.vue'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'
import NcProgressBar from '../NcProgressBar/NcProgressBar.vue'
import { t } from '../../l10n.ts'
import { createElementId } from '../../utils/createElementId.ts'
import { logger } from '../../utils/logger.ts'

export interface IUploadPickerMenuEntry {
	id: string
	category: 'upload' | 'create' | 'other'
	label: string
	iconSvg?: string
	callback: (destination: IFolder, content: INode[]) => Promise<void> | void
}

const props = withDefaults(defineProps<{
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
	 * Allow uploading multiple files
	 */
	multiple?: boolean

	/**
	 * Optional menu entries to add to the upload picker menu
	 */
	menuEntries?: IUploadPickerMenuEntry[]

	/**
	 * Allow to disable the actions menu for this UploadPicker instance
	 */
	noMenu?: boolean

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
	accept: () => [],
	menuEntries: () => [],
	variant: 'secondary',
})

const emit = defineEmits<{
	uploaded: [upload: Upload]
	failed: [upload: Upload]
	paused: [queue: Upload[]]
	resumed: [queue: Upload[]]
}>()

defineExpose({
	reset,
	setDestination,
})

const filePickerElement = useTemplateRef('filePicker')

const uploadManager = getUploader()
onBeforeMount(() => {
	uploadManager.addNotifier(onUploadCompletion)
})
watch(() => props.destination, () => {
	setDestination(props.destination!)
}, { immediate: true })

const progressTimeId = createElementId()

const menuEntriesUpload = computed(() => props.menuEntries?.filter((entry) => entry.category === 'upload'))
const menuEntriesNew = computed(() => props.menuEntries?.filter((entry) => entry.category === 'create'))
const menuEntriesOther = computed(() => props.menuEntries?.filter((entry) => entry.category === 'other'))

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

const isPaused = computed(() => uploadManager.info?.status === UploaderStatus.PAUSED)
watch(isPaused, (isPaused) => {
	if (isPaused) {
		emit('paused', queue.value)
	} else {
		emit('resumed', queue.value)
	}
})

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

/**
 * Get the current eta time and speed as a string
 */
function etaTimeAndSpeed(): string {
	const speed = uploadManager.eta.speedReadable
	if (speed) {
		return `${uploadManager.eta.timeReadable} (${speed})`
	}
	return uploadManager.eta.timeReadable
}

/**
 * Handle clicking a menu entry
 *
 * @param entry The entry that was clicked
 */
async function onClick(entry: IUploadPickerMenuEntry) {
	await entry.callback(
		props.destination!,
		await props.content().catch(() => []),
	)
}

/**
 * Start uploading
 *
 * @param files - The files to upload
 */
async function onPick(files: File[]) {
	try {
		await uploadManager
			.batchUpload('', files, async (nodes, currentPath) => {
				const content = await props.content(currentPath)
				// @ts-expect-error - types to be fixed in upload package
				const conflicts = getConflicts(nodes, content)
				if (conflicts.length === 0) {
					return nodes
				}

				const result = await openConflictPicker(basename(currentPath), conflicts, content, { recursive: props.directory })
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
		reset()
	}
}

/**
 * Cancel ongoing queue
 */
function onCancel() {
	uploadManager.queue.forEach((upload: Upload) => {
		upload.cancel()
	})
	reset()
}

/**
 * Handle upload completion
 *
 * @param upload - The completed upload
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
