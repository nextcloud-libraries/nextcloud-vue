<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { IUpload } from '@nextcloud/files/upload'

import { getUploader, UploaderStatus, UploadStatus } from '@nextcloud/files/upload'
import { basename } from '@nextcloud/paths'
import { computed, onMounted, onUnmounted, ref, shallowRef, triggerRef } from 'vue'
import NcButton from '../NcButton/NcButton.vue'
import NcProgressBar from '../NcProgressBar/NcProgressBar.vue'
import { t } from '../../l10n.ts'
import { createElementId } from '../../utils/createElementId.ts'

defineProps<{
	/** Whether the file picker is preparing a new batch. */
	preparing: boolean
	/** Whether the uploader has active work without file entries yet. */
	uploading?: boolean
}>()

const uploader = getUploader()
const trigger = ref<HTMLButtonElement>()
const open = ref(false)
const panelId = createElementId()
const limit = ref(50)
const uploads = shallowRef<IUpload[]>([])
const paused = ref(false)
const tracked = new Set<IUpload>()

/**
 * Capture queue membership while retaining terminal results after a reset.
 */
function synchronize() {
	paused.value = uploader.status === UploaderStatus.PAUSED
	let added = false
	for (const upload of uploader.queue) {
		if (!upload.source || tracked.has(upload)) {
			continue
		}
		tracked.add(upload)
		added = true
	}
	if (added) {
		uploads.value = [...tracked]
	}
	triggerRef(uploads)
}

const rows = computed(() => {
	return uploads.value.filter((upload) => !upload.children?.length || upload.status === UploadStatus.FAILED).map((upload) => {
		const status = upload.signal?.aborted && upload.status < UploadStatus.FINISHED
			? UploadStatus.CANCELLED
			: upload.status
		return {
			upload,
			name: basename(upload.source) || t('Upload preparation'),
			status,
			progress: status === UploadStatus.FINISHED
				? 100
				: upload.totalBytes > 0
					? Math.max(0, Math.min(100, Math.floor(100 * upload.uploadedBytes / upload.totalBytes)))
					: 0,
		}
	})
})
const files = computed(() => rows.value.filter((row) => !row.upload.children?.length))
const completed = computed(() => files.value.filter((row) => row.status === UploadStatus.FINISHED).length)
const failed = computed(() => rows.value.some((row) => row.status === UploadStatus.FAILED))
const active = computed(() => rows.value.some((row) => row.status < UploadStatus.FINISHED))
const progress = computed(() => {
	const total = files.value.reduce((sum, row) => sum + Math.max(0, row.upload.totalBytes), 0)
	const bytes = files.value.reduce((sum, row) => sum + (row.status === UploadStatus.FINISHED
		? Math.max(0, row.upload.totalBytes)
		: Math.max(0, Math.min(row.upload.totalBytes, row.upload.uploadedBytes))), 0)
	return total > 0
		? Math.floor(100 * bytes / total)
		: files.value.length > 0 ? Math.floor(100 * completed.value / files.value.length) : 0
})

/**
 * Translate the transport state without treating queued files as paused.
 *
 * @param status - The current upload state
 */
function statusLabel(status: number) {
	switch (status) {
		case UploadStatus.INITIALIZED: return paused.value ? t('Paused') : t('Preparing')
		case UploadStatus.SCHEDULED: return paused.value ? t('Paused') : t('Waiting for upload')
		case UploadStatus.UPLOADING: return t('Uploading')
		case UploadStatus.ASSEMBLING: return t('Assembling')
		case UploadStatus.FINISHED: return t('Completed')
		case UploadStatus.FAILED: return t('Failed')
		case UploadStatus.CANCELLED: return t('Cancelled')
		default: return t('Preparing')
	}
}

/**
 * Release retained results when no uploads are active.
 */
function clear() {
	tracked.clear()
	uploads.value = []
	limit.value = 50
	open.value = false
}

/**
 * Close the panel and return keyboard focus to its trigger.
 */
function close() {
	open.value = false
	trigger.value?.focus()
}

const events = ['uploadStarted', 'uploadProgress', 'uploadFinished', 'finished', 'reset', 'paused', 'resumed'] as const
onMounted(() => {
	synchronize()
	for (const event of events) {
		uploader.addEventListener(event, synchronize)
	}
})
onUnmounted(() => {
	for (const event of events) {
		uploader.removeEventListener(event, synchronize)
	}
})
</script>

<template>
	<div
		v-show="preparing || uploading || rows.length > 0"
		:class="$style.manager"
		@keydown.esc.stop="close">
		<button
			ref="trigger"
			type="button"
			:class="$style.summary"
			:aria-label="t('Upload manager')"
			:aria-expanded="open"
			:aria-controls="panelId"
			@click="open = !open">
			<span v-if="preparing" role="status">{{ t('Preparing uploads') }}</span>
			<span v-else-if="uploading && !rows.length">{{ t('Uploading') }}</span>
			<span v-if="files.length">{{ t('{completed} of {total} files uploaded', { completed, total: files.length }) }} · {{ progress }} %</span>
			<span v-if="failed" role="status">{{ t('Some uploads failed') }}</span>
		</button>
		<slot :progress="rows.length ? progress : undefined" />
		<section
			v-show="open"
			:id="panelId"
			:class="$style.panel"
			:aria-label="t('Upload manager')">
			<h2>{{ t('Upload manager') }}</h2>
			<ul :class="$style.list">
				<li
					v-for="(row, index) in rows.slice(0, limit)"
					:key="index"
					v-memo="[row.name, row.status, row.progress, paused]"
					:class="$style.row">
					<span dir="auto">{{ row.name }}</span>
					<span>{{ statusLabel(row.status) }} · {{ row.progress }} %</span>
					<NcProgressBar :value="row.progress" :error="row.status === UploadStatus.FAILED" :ariaLabel="row.name" />
					<span v-if="row.status === UploadStatus.FAILED">{{ t('Upload failed. Select this file again to retry.') }}</span>
				</li>
			</ul>
			<NcButton v-if="rows.length > limit" @click="limit += 50">
				{{ t('Show more') }}
			</NcButton>
			<NcButton v-if="!active && !preparing" @click="clear">
				{{ t('Clear completed uploads') }}
			</NcButton>
		</section>
	</div>
</template>

<style module>
.manager {
	position: relative;
	min-width: 0;
	max-width: 100%;
	flex: 0 1 260px;
}

.summary {
	cursor: pointer;
	padding: 4px 8px;
	overflow-wrap: anywhere;
	color: var(--color-main-text);
	background: transparent;
	border: 0;
}

.summary > span {
	display: block;
}

.panel {
	position: fixed;
	z-index: 1000;
	inset-inline: 16px;
	margin-inline: auto;
	width: min(420px, calc(100vw - 32px));
	max-height: min(480px, 60vh);
	overflow: auto;
	padding: 16px;
	background: var(--color-main-background);
	border-radius: var(--border-radius-large);
	box-shadow: 0 2px 8px var(--color-box-shadow);
}

.list {
	list-style: none;
	padding: 0;
	margin: 0;
}

.row {
	display: grid;
	gap: 4px;
	padding-block: 8px;
	overflow-wrap: anywhere;
}
</style>
