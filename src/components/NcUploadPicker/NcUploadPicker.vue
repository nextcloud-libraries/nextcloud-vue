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
import { computed, onBeforeMount, onUnmounted, ref, useTemplateRef, watch } from 'vue'
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
	/**
	 * Emitted when an upload has started.
	 */
	'upload:started': [upload: IUpload]
	/**
	 * Emitted when an upload has finished successfully.
	 */
	'upload:finished': [upload: IUpload]
	/**
	 * The queue has been paused, and no more uploads will be processed until resumed.
	 */
	paused: [queue: IUpload[]]
	/**
	 * The queue has resumed uploading after being paused.
	 */
	resumed: [queue: IUpload[]]
	/**
	 * The queue has finished uploading all files.
	 */
	finished: []
}>()

defineExpose({
	reset,
})

const filePickerElement = useTemplateRef('filePicker')
const progressTimeId = createElementId()

const uploadManager = getUploader()
onBeforeMount(() => {
	window.addEventListener('beforeunload', onBeforePageUnload)
	uploadManager.addEventListener('uploadFinished', onUploadFinished)
	uploadManager.addEventListener('uploadStarted', onUploadStarted)
	uploadManager.addEventListener('uploadProgress', updateEta)
	uploadManager.addEventListener('finished', onUploaderFinished)
	uploadManager.addEventListener('paused', onUploaderPaused)
	uploadManager.addEventListener('reset', updateUploadStatus)
	uploadManager.addEventListener('resumed', onUploaderResumed)
	updateUploadStatus()
})
onUnmounted(() => {
	window.removeEventListener('beforeunload', onBeforePageUnload)
	uploadManager.removeEventListener('uploadFinished', onUploadFinished)
	uploadManager.removeEventListener('uploadStarted', onUploadStarted)
	uploadManager.removeEventListener('uploadProgress', updateEta)
	uploadManager.removeEventListener('finished', onUploaderFinished)
	uploadManager.removeEventListener('paused', onUploaderPaused)
	uploadManager.removeEventListener('reset', updateUploadStatus)
	uploadManager.removeEventListener('resumed', onUploaderResumed)
})

watch(() => props.destination, () => setDestination(props.destination), { immediate: true })

const isPaused = ref(uploadManager.status === UploaderStatus.PAUSED)
/** Handle uploader paused event */
function onUploaderPaused() {
	updateUploadStatus()
	emit('paused', [...uploadManager.queue])
}
/** Handle uploader resumed event */
function onUploaderResumed() {
	updateUploadStatus()
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
	isPaused.value = uploadManager.status === UploaderStatus.PAUSED
	// While paused the queue is not processed, but the queued uploads are still pending
	isUploading.value = uploadManager.status === UploaderStatus.UPLOADING
		|| (isPaused.value && uploadManager.queue.length > 0)
	hasFailure.value = uploadManager.queue.some((upload: IUpload) => upload.status === UploadStatus.FAILED)
	isAssembling.value = uploadManager.queue.some((upload: IUpload) => upload.status === UploadStatus.ASSEMBLING)
	// only assembling if assembling at all AND all other uploads are already finished (or failed)
	isOnlyAssembling.value = isAssembling.value
		&& uploadManager.queue.every((upload: IUpload) => upload.status >= UploadStatus.ASSEMBLING)
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
const etaRaw = ref<number>(Infinity)
const etaTimeRaw = computed(() => etaRaw.value === Infinity ? Infinity : new Date(Date.now() + etaRaw.value))
const etaTimeFormatted = useFormatRelativeTime(etaTimeRaw, { ignoreSeconds: true })
const etaTime = computed(() => etaTimeRaw.value === Infinity ? t('Estimating …') : etaTimeFormatted.value)
/** Update the ETA and speed values */
function updateEta() {
	etaRaw.value = uploadManager.statistics.eta === Infinity ? Infinity : (uploadManager.statistics.eta * 1000)
	etaSpeed.value = uploadManager.statistics.speedReadable
	etaProgress.value = uploadManager.statistics.progress
}

/**
 * Handle uploader finished event
 */
function onUploaderFinished() {
	updateUploadStatus()
	emit('finished')
}

/**
 * Handle upload finished event
 *
 * @param event - The upload finished event
 */
function onUploadFinished(event: CustomEvent<IUpload>) {
	updateUploadStatus()
	emit('upload:finished', event.detail)
}

/**
 * Handle upload started event
 *
 * @param event - The upload started event
 */
function onUploadStarted(event: CustomEvent<IUpload>) {
	updateUploadStatus()
	emit('upload:started', event.detail)
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
	try {
		const content = await props.content(currentPath)
		const conflicts = content.filter((node) => nodes.includes(node.displayname) || nodes.includes(node.basename))
		const uploadMapping = Object.fromEntries(nodes.map((name) => [name, name]))
		if (conflicts.length === 0) {
			return uploadMapping
		}

		// The conflict picker requires the incoming and the existing nodes to be aligned,
		// so the existing content has to be filtered to only contain the conflicting nodes.
		const existingNodes = content.filter((node) => nodes.includes(node.displayname) || nodes.includes(node.basename))
		// @ts-expect-error -- conflict between versons of dependencies - needs to be fixed in @nextcloud/dialogs
		const result = await openConflictPicker(basename(currentPath), conflicts, existingNodes, { recursive: props.directory })
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
	} catch (error) {
		logger.error('Error during conflict resolution - skipping upload', { error })
	}
	return false
}

/**
 * Cancel ongoing queue
 */
function onCancel() {
	uploadManager.reset()
	reset()
}

/**
 * Handle page unload.
 * Block the unload if there are ongoing uploads.
 *
 * @param event - The event
 */
function onBeforePageUnload(event: BeforeUnloadEvent) {
	if (uploadManager.queue.length > 0) {
		event.preventDefault()
		event.returnValue = ''
	}
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
				:ariaLabel="t('Upload progress')"
				:ariaDescribedby="progressTimeId"
				:error="hasFailure"
				:value="etaProgress"
				size="medium" />
			<p :id="progressTimeId" :class="$style.uploadPicker_progressLabel">
				<span v-if="isPaused">
					{{ t('paused') /* TRANSLATORS: State of the current upload - it is paused */ }}
				</span>
				<span v-else-if="isOnlyAssembling">
					{{ t('assembling') /* TRANSLATORS: State of the current upload - chunks of the uploaded files are being assembled into the final file */ }}
				</span>
				<span v-else :title="`${etaTime} (${etaSpeed})`">
					{{ etaTime }}
					<!-- the speed is included in the tooltip / title so we only show it in the text content if there is enough space (not showing "a few seconds left") -->
					<span v-if="etaSpeed && etaRaw > 31000" :class="$style.uploadPicker_progressLabelSpeed">
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

.uploadPicker_progressLabelSpeed{
	color: var(--color-text-maxcontrast);
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

The upload picker lets users pick files – or whole directories – from their device and uploads them
to a folder on the Nextcloud server, using the shared uploader of `@nextcloud/files/upload`.
While uploading it shows the progress, the estimated remaining time and a button to cancel all queued uploads.

Two props are required to set it up:

- `destination`: The folder to upload into, as an `IFolder` of `@nextcloud/files`.
- `content`: A callback that resolves with the nodes that already exist in a folder that is uploaded into.
  It is called with the path relative to the `destination` – the empty string for the destination itself –
  and is used to detect upload conflicts. If there are conflicts, the user is asked to skip or rename
  the conflicting files.

### Exposed methods

- `function reset(): void`
  Reset the internal state of the picker, e.g. to clear the current selection.

**Note**: All upload pickers share the global uploader instance of `getUploader()`,
including its queue and its destination. Because of that only a single upload picker
should be mounted at a time – in the examples below the picker that was mounted last defines the destination.

**Note about the examples**: There is no Nextcloud server behind the styleguide,
so the examples use a fake WebDAV server that simulates slow – but always successful – uploads.
Uploading a file called `Photo.jpg` or `Notes.md` triggers the conflict dialog,
files larger than 10 MiB are uploaded in chunks.

### Basic usage

```vue
<template>
	<div>
		<NcUploadPicker
			:content="fetchContent"
			:destination="destination"
			multiple
			@finished="log('finished')"
			@upload:finished="log('upload:finished', $event)"
			@upload:started="log('upload:started', $event)" />

		<NcNoteCard v-if="events.length === 0" type="info">
			Pick some files to upload them to <code>{{ destination.path }}</code>.
		</NcNoteCard>
		<ul v-else>
			<li v-for="(event, index) in events" :key="index">
				{{ event }}
			</li>
		</ul>
	</div>
</template>
<script>
import { File as NcFile, Folder, Permission } from '@nextcloud/files'
import { generateRemoteUrl } from '@nextcloud/router'
import { ref } from 'vue'

// The folder the picked files are uploaded into
const destination = new Folder({
	id: 42,
	owner: 'admin',
	permissions: Permission.ALL,
	root: '/files/admin',
	source: generateRemoteUrl('dav/files/admin/Uploads'),
})

// The nodes that already exist in the destination, in a real app this is the result of a PROPFIND
const existingNodes = ['Photo.jpg', 'Notes.md'].map((name) => new NcFile({
	mime: 'application/octet-stream',
	owner: 'admin',
	root: '/files/admin',
	source: `${destination.source}/${name}`,
}))

export default {
	setup() {
		const events = ref([])

		return {
			destination,
			events,

			// Provide the content of the folder that is uploaded into to allow detecting conflicts
			async fetchContent(relativePath) {
				// Folders created by the upload itself are empty, so they never conflict
				return relativePath ? [] : existingNodes
			},

			log(name, upload) {
				// One `upload:*` event is emitted for the destination itself - shown as `/` - and one per picked file
				const path = upload && decodeURIComponent(upload.source.slice(destination.source.length))
				events.value.unshift(upload ? `${name}: ${path}` : name)
			},
		}
	},
}
</script>
```

### Directories and custom actions

Setting `directory` adds an entry to upload a whole directory tree, which is recreated in the destination.
Additional entries – like the "New folder" action of the Files app – can be added using the `actions` prop,
either as a flat list or grouped with a caption.
The `accept` prop restricts the file types that can be picked.

```vue
<template>
	<div>
		<NcUploadPicker
			:accept="['image/jpeg', 'image/png']"
			:actions="actions"
			:content="fetchContent"
			:destination="destination"
			directory
			label="Add media"
			multiple
			variant="primary" />

		<NcNoteCard v-if="lastAction" type="success">
			{{ lastAction }}
		</NcNoteCard>
	</div>
</template>
<script>
import svgFolderPlus from '@mdi/svg/svg/folder-plus-outline.svg?raw'
import svgLink from '@mdi/svg/svg/link-plus.svg?raw'
import { Folder, Permission } from '@nextcloud/files'
import { generateRemoteUrl } from '@nextcloud/router'
import { ref } from 'vue'

const destination = new Folder({
	id: 42,
	owner: 'admin',
	permissions: Permission.ALL,
	root: '/files/admin',
	source: generateRemoteUrl('dav/files/admin/Uploads'),
})

export default {
	setup() {
		const lastAction = ref('')

		return {
			destination,
			lastAction,

			// The destination is empty, so no upload will ever conflict
			async fetchContent() {
				return []
			},

			actions: [
				{
					caption: 'Create new',
					actions: [
						{
							label: 'New folder',
							iconSvg: svgFolderPlus,
							onClick: () => {
								lastAction.value = 'Clicked "New folder"'
							},
						},
						{
							label: 'Add from link',
							iconSvg: svgLink,
							onClick: () => {
								lastAction.value = 'Clicked "Add from link"'
							},
						},
					],
				},
			],
		}
	},
}
</script>
```

### Controlling the uploader

The uploader itself is not owned by the picker, so it can also be controlled directly.
This is useful to pause the queue – picked files are queued but not uploaded until it is resumed –
or to change the destination while the picker is mounted.

```vue
<template>
	<div class="uploader-controls">
		<NcUploadPicker
			ref="picker"
			:content="fetchContent"
			:destination="destination"
			multiple />

		<NcButton @click="uploader.pause()">
			Pause
		</NcButton>
		<NcButton @click="uploader.start()">
			Resume
		</NcButton>
	</div>
</template>
<script>
import { Folder, Permission } from '@nextcloud/files'
import { getUploader } from '@nextcloud/files/upload'
import { generateRemoteUrl } from '@nextcloud/router'

/**
 * Create a folder for the given path within the users files.
 *
 * @param {string} path - Path of the folder, e.g. `/Documents`
 */
function createFolder(path) {
	return new Folder({
		id: 42,
		owner: 'admin',
		permissions: Permission.ALL,
		root: '/files/admin',
		source: generateRemoteUrl(`dav/files/admin${path}`),
	})
}

export default {
	setup() {
		return {
			destination: createFolder('/Uploads'),
			otherDestination: createFolder('/Documents'),
			uploader: getUploader(),

			async fetchContent() {
				return []
			},
		}
	},
}
</script>
<style scoped>
.uploader-controls {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	align-items: center;
}
</style>
```
</docs>
