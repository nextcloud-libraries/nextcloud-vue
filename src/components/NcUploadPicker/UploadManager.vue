<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { IUpload } from '@nextcloud/files/upload'

import { mdiAlertCircle, mdiCheckCircle, mdiChevronDown, mdiChevronUp, mdiCloseCircle, mdiFile, mdiFolder } from '@mdi/js'
import { getUploader, UploadStatus } from '@nextcloud/files/upload'
import { basename } from '@nextcloud/paths'
import { computed, onMounted, onUnmounted, ref, shallowRef, triggerRef } from 'vue'
import NcButton from '../NcButton/NcButton.vue'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'
import NcLoadingIcon from '../NcLoadingIcon/NcLoadingIcon.vue'
import NcPopover from '../NcPopover/NcPopover.vue'
import NcProgressBar from '../NcProgressBar/NcProgressBar.vue'
import { n, t } from '../../l10n.ts'

interface IUploadRow {
	/** Stable key of the row */
	key: number
	/** Name of the file or folder */
	name: string
	/** Whether the row summarizes a folder */
	folder: boolean
	/** Effective upload status */
	status: number
	/** Progress in percent */
	progress: number
	/** Finished files of a folder */
	done: number
	/** All files of a folder */
	total: number
}

const props = defineProps<{
	/** Formatted remaining time of the current batch. */
	eta: string
	/** Whether the uploader is paused. */
	paused: boolean
	/** Whether the file picker is preparing a new batch. */
	preparing: boolean
	/** Whether the uploader has active work. */
	uploading: boolean
}>()

const emit = defineEmits<{
	/** The user asked to cancel all running uploads. */
	cancel: []
}>()

const uploader = getUploader()
const open = ref(false)
const limit = ref(50)
const uploads = shallowRef<IUpload[]>([])
const tracked = new Set<IUpload>()
const keys = new WeakMap<IUpload, number>()
let nextKey = 0

/**
 * Stable identity of an upload, to not re-render all rows on every update.
 *
 * @param upload - The upload
 */
function keyOf(upload: IUpload): number {
	if (!keys.has(upload)) {
		keys.set(upload, nextKey++)
	}
	return keys.get(upload)!
}

/**
 * Capture queue membership while retaining terminal results after a reset.
 */
function synchronize() {
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

/**
 * Status of an upload, an aborted but unfinished upload counts as cancelled.
 *
 * @param upload - The upload
 */
function statusOf(upload: IUpload): number {
	return upload.signal?.aborted && upload.status < UploadStatus.FINISHED
		? UploadStatus.CANCELLED
		: upload.status
}

/**
 * Get all uploads of a tree that do not have children, so all files and empty folders.
 *
 * @param upload - The upload
 */
function leavesOf(upload: IUpload): IUpload[] {
	const children = upload.children ?? []
	return children.length > 0 ? children.flatMap(leavesOf) : [upload]
}

/**
 * Combine the status of many uploads: failures first, then running uploads, then the least advanced one.
 *
 * @param statuses - The status of all leaves
 */
function combineStatus(statuses: number[]): number {
	if (statuses.includes(UploadStatus.FAILED)) {
		return UploadStatus.FAILED
	}
	if (statuses.every((status) => status === UploadStatus.FINISHED)) {
		return UploadStatus.FINISHED
	}
	if (statuses.includes(UploadStatus.UPLOADING)) {
		return UploadStatus.UPLOADING
	}
	if (statuses.includes(UploadStatus.ASSEMBLING)) {
		return UploadStatus.ASSEMBLING
	}
	const unfinished = statuses.filter((status) => status < UploadStatus.FINISHED)
	return unfinished.length > 0 ? Math.min(...unfinished) : UploadStatus.CANCELLED
}

/**
 * Byte-weighted progress in percent, or the share of finished entries if the sizes are unknown.
 *
 * @param leaves - The file uploads
 */
function progressOf(leaves: IUpload[]): number {
	const total = leaves.reduce((sum, upload) => sum + Math.max(0, upload.totalBytes), 0)
	if (total === 0) {
		const done = leaves.filter((upload) => statusOf(upload) === UploadStatus.FINISHED).length
		return leaves.length > 0 ? Math.floor(100 * done / leaves.length) : 0
	}
	const bytes = leaves.reduce((sum, upload) => sum + (statusOf(upload) === UploadStatus.FINISHED
		? Math.max(0, upload.totalBytes)
		: Math.max(0, Math.min(upload.totalBytes, upload.uploadedBytes))), 0)
	return Math.max(0, Math.min(100, Math.floor(100 * bytes / total)))
}

/**
 * Create the row for a single upload, folders are summarized by their files.
 *
 * @param upload - The upload
 */
function createRow(upload: IUpload): IUploadRow {
	const leaves = leavesOf(upload)
	const folder = (upload.children?.length ?? 0) > 0
	const statuses = leaves.map(statusOf)
	if (folder && statusOf(upload) === UploadStatus.FAILED) {
		// the folder itself could not be prepared
		statuses.push(UploadStatus.FAILED)
	}
	return {
		key: keyOf(upload),
		name: basename(upload.source) || t('Upload preparation'),
		folder,
		status: combineStatus(statuses),
		progress: progressOf(leaves),
		done: statuses.filter((status) => status === UploadStatus.FINISHED).length,
		total: leaves.length,
	}
}

/**
 * All uploads that are part of a tracked tree, so not top level entries.
 */
const nested = computed(() => {
	const set = new Set<IUpload>()
	for (const upload of uploads.value) {
		for (const child of upload.children ?? []) {
			set.add(child)
		}
	}
	return set
})

/**
 * One row per picked file or folder. The root of a batch is only shown if it failed itself.
 */
const rows = computed<IUploadRow[]>(() => {
	const result: IUploadRow[] = []
	for (const root of uploads.value) {
		if (nested.value.has(root)) {
			continue
		}
		const children = root.children ?? []
		if (children.length === 0) {
			result.push(createRow(root))
			continue
		}
		if (statusOf(root) === UploadStatus.FAILED) {
			result.push({ ...createRow(root), folder: false, total: 0 })
		}
		result.push(...children.map(createRow))
	}
	return result
})

const active = computed(() => rows.value.some((row) => row.status < UploadStatus.FINISHED))
const failed = computed(() => rows.value.some((row) => row.status === UploadStatus.FAILED))
const visible = computed(() => props.preparing || props.uploading || rows.value.length > 0)
const title = computed(() => {
	if (props.preparing && rows.value.length === 0) {
		return t('Preparing uploads')
	}
	if (active.value) {
		return n('Uploading {count} item', 'Uploading {count} items', rows.value.length, { count: rows.value.length })
	}
	return failed.value
		? t('Some uploads failed')
		: n('{count} item uploaded', '{count} items uploaded', rows.value.length, { count: rows.value.length })
})
const triggerIcon = computed(() => failed.value ? mdiAlertCircle : open.value ? mdiChevronUp : mdiChevronDown)

/**
 * Translate the transport state without treating queued files as paused.
 *
 * @param status - The current upload state
 */
function statusLabel(status: number) {
	switch (status) {
		case UploadStatus.INITIALIZED: return props.paused ? t('Paused') : t('Preparing')
		case UploadStatus.SCHEDULED: return props.paused ? t('Paused') : t('Waiting for upload')
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
	<div v-if="visible" :class="$style.manager">
		<NcPopover
			popupRole="dialog"
			placement="bottom-end"
			@update:shown="open = $event">
			<template #trigger>
				<NcButton
					:aria-label="t('Upload manager')"
					:title="title"
					variant="tertiary">
					<template #icon>
						<NcIconSvgWrapper :path="triggerIcon" />
					</template>
				</NcButton>
			</template>

			<div
				:class="$style.popover"
				role="dialog"
				:aria-label="t('Upload manager')">
				<h2 :class="$style.title">
					{{ title }}
				</h2>
				<div v-if="uploading || (!active && !preparing)" :class="$style.header">
					<template v-if="uploading">
						<span :class="$style.eta">{{ paused ? t('Paused') : eta }}</span>
						<NcButton variant="tertiary" @click="emit('cancel')">
							{{ t('Cancel') }}
						</NcButton>
					</template>
					<NcButton v-else variant="tertiary" @click="clear">
						{{ t('Clear completed uploads') }}
					</NcButton>
				</div>
				<ul :class="$style.list">
					<li
						v-for="row in rows.slice(0, limit)"
						:key="row.key"
						:class="$style.row">
						<NcIconSvgWrapper :class="$style.kind" :path="row.folder ? mdiFolder : mdiFile" />
						<span :class="$style.name" dir="auto" :title="row.name">{{ row.name }}</span>
						<span v-if="row.folder" :class="$style.count">
							{{ t('{done} of {total}', { done: row.done, total: row.total }) }}
						</span>
						<span :class="$style.status" role="img" :aria-label="statusLabel(row.status)">
							<NcIconSvgWrapper v-if="row.status === UploadStatus.FINISHED" :class="$style.success" :path="mdiCheckCircle" />
							<NcIconSvgWrapper v-else-if="row.status === UploadStatus.FAILED" :class="$style.error" :path="mdiAlertCircle" />
							<NcIconSvgWrapper v-else-if="row.status === UploadStatus.CANCELLED" :path="mdiCloseCircle" />
							<NcLoadingIcon v-else-if="row.status === UploadStatus.ASSEMBLING" :size="20" />
							<NcProgressBar
								v-else
								type="circular"
								:size="20"
								:value="row.status === UploadStatus.UPLOADING ? row.progress : 0" />
						</span>
						<span v-if="row.status === UploadStatus.FAILED" :class="$style.failure">
							{{ t('Upload failed. Select this file again to retry.') }}
						</span>
					</li>
				</ul>
				<NcButton v-if="rows.length > limit" variant="tertiary" @click="limit += 50">
					{{ t('Show more') }}
				</NcButton>
			</div>
		</NcPopover>
		<span v-if="failed" role="status" :class="$style.hidden">{{ t('Some uploads failed') }}</span>
	</div>
</template>

<style module>
.manager {
	flex: 0 0 auto;
}

.popover {
	box-sizing: border-box;
	width: min(360px, calc(100vw - 32px));
	max-height: min(480px, 60vh);
	overflow: auto;
	padding: 8px 16px 16px;
}

.title {
	margin: 8px 0;
	font-size: var(--default-font-size);
	font-weight: bold;
}

.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
	margin-inline: -16px;
	padding: 0 16px;
	background-color: var(--color-background-hover);
}

.eta {
	color: var(--color-text-maxcontrast);
	overflow-wrap: anywhere;
}

.list {
	list-style: none;
	padding: 0;
	margin: 8px 0 0;
}

.row {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 8px;
	min-height: var(--default-clickable-area);
}

.kind {
	flex: 0 0 auto;
	color: var(--color-text-maxcontrast);
}

.name {
	flex: 1 1 0;
	min-width: 0;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.count {
	flex: 0 0 auto;
	color: var(--color-text-maxcontrast);
}

.status {
	display: flex;
	flex: 0 0 auto;
	align-items: center;
	justify-content: center;
	width: var(--default-clickable-area);
}

.success {
	color: var(--color-element-success);
}

.error {
	color: var(--color-element-error);
}

.failure {
	flex: 1 0 100%;
	padding-inline-start: 32px;
	color: var(--color-text-error);
	overflow-wrap: anywhere;
}

.hidden {
	position: absolute;
	width: 1px;
	height: 1px;
	overflow: hidden;
	clip-path: inset(50%);
	white-space: nowrap;
}
</style>
