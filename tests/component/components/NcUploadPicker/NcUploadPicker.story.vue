<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { INode } from '@nextcloud/files'
import type { IUpload } from '@nextcloud/files/upload'
import type { FilePickerItem, FilePickerItemGroup } from '../../../../src/components/NcFilePicker/NcFilePicker.vue'

import { Folder, File as NcFile, Permission } from '@nextcloud/files'
import { getUploader } from '@nextcloud/files/upload'
import { generateRemoteUrl } from '@nextcloud/router'
import { computed, useTemplateRef } from 'vue'
import NcUploadPicker from '../../../../src/components/NcUploadPicker/NcUploadPicker.vue'

// Note: The uploader requires a logged in user, which is provided by the test setup (`data-user` on the `head`).

const props = withDefaults(defineProps<{
	// Props forwarded to the upload picker
	accept?: string[]
	actions?: FilePickerItem[] | FilePickerItemGroup[]
	directory?: boolean
	disabled?: boolean
	iconOnly?: boolean
	label?: string
	multiple?: boolean
	variant?: 'primary' | 'secondary' | 'tertiary'

	/**
	 * WebDAV path of the upload destination, relative to `remote.php/dav/`.
	 */
	destinationPath?: string

	/**
	 * WebDAV path set by the "Set destination" control,
	 * used to test the exposed `setDestination` method.
	 */
	otherDestinationPath?: string

	/**
	 * Basenames of the nodes that already exist in the destination,
	 * used to trigger upload conflicts.
	 */
	existingFiles?: string[]

	/**
	 * Make fetching the content of the destination fail,
	 * used to test that conflicts cannot be resolved.
	 */
	failContent?: boolean

	/**
	 * Start with a paused uploader,
	 * so picked files are queued but only uploaded when using the "Resume uploads" control.
	 */
	startPaused?: boolean

	/**
	 * Number of parallel (chunk) uploads.
	 */
	maxParallelUploads?: number
}>(), {
	accept: undefined,
	actions: undefined,
	label: undefined,
	variant: undefined,
	otherDestinationPath: undefined,
	destinationPath: 'files/test/Folder',
	existingFiles: () => [],
	maxParallelUploads: 5,
})

const emit = defineEmits<{
	// The upload picker events, but with serializable payloads so they can be asserted from the tests
	'upload:started': [source: string]
	'upload:finished': [upload: { source: string, status: number }]
	paused: [queueLength: number]
	resumed: [queueLength: number]
}>()

// Make the number of parallel uploads independent of the server capabilities.
// This has to happen before the uploader is created.
Object.assign(window, {
	_oc_capabilities: {
		files: { chunked_upload: { max_parallel_count: props.maxParallelUploads } },
	},
})

const uploader = getUploader()
if (props.startPaused) {
	uploader.pause()
}

Object.assign(window, { _debugUploader: uploader })
const picker = useTemplateRef('picker')
const destination = computed(() => createFolder(props.destinationPath))

/**
 * Create an upload destination folder from a WebDAV path like `files/user/Folder`.
 *
 * @param path - The WebDAV path relative to `remote.php/dav/`
 */
function createFolder(path: string): Folder {
	const [service, user] = path.split('/')
	return new Folder({
		id: 56,
		owner: user,
		source: generateRemoteUrl(`dav/${path}`),
		permissions: Permission.ALL,
		root: `/${service}/${user}`,
	})
}

/**
 * Fake the content of the upload destination to be able to test conflict handling.
 */
async function fetchContent(): Promise<INode[]> {
	if (props.failContent) {
		throw new Error('Could not fetch the content of the destination')
	}

	return props.existingFiles.map((name) => new NcFile({
		owner: destination.value.owner!,
		source: `${destination.value.source}/${name}`,
		root: destination.value.root!,
		mime: 'text/plain',
	}))
}

/**
 * Map an upload to a payload that can be transferred to the test.
 *
 * @param upload - The upload of the event
 */
function serialize(upload: IUpload) {
	return { source: upload.source, status: upload.status }
}
</script>

<template>
	<div>
		<NcUploadPicker
			ref="picker"
			:accept
			:actions
			:content="fetchContent"
			:destination
			:directory
			:disabled
			:iconOnly
			:label
			:multiple
			:variant
			@paused="emit('paused', $event.length)"
			@resumed="emit('resumed', $event.length)"
			@upload:finished="emit('upload:finished', serialize($event))"
			@upload:started="emit('upload:started', $event.source)" />

		<button v-if="otherDestinationPath" type="button" @click="picker!.setDestination(createFolder(otherDestinationPath))">
			Set destination
		</button>
		<button type="button" @click="picker!.reset()">
			Reset picker
		</button>
		<button type="button" @click="uploader.pause()">
			Pause uploads
		</button>
		<button type="button" @click="uploader.start()">
			Resume uploads
		</button>
	</div>
</template>
