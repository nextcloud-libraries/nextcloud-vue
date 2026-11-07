/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { IUpload } from '@nextcloud/files/upload'
import type { VueWrapper } from '@vue/test-utils'

import { UploadStatus } from '@nextcloud/files/upload'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import UploadManager from '../../../../src/components/NcUploadPicker/UploadManager.vue'

class FakeUploader extends EventTarget {
	queue: IUpload[] = []
	status: number = 0
}

let uploader: FakeUploader
vi.mock('@nextcloud/files/upload', async (original) => ({
	...await original<object>(),
	getUploader: () => uploader,
}))

// The popover content is only rendered while open, so always render trigger and content
const NcPopover = defineComponent({
	name: 'NcPopover',
	emits: ['update:shown'],
	setup: (_, { slots }) => () => h('div', [slots.trigger?.({}), slots.default?.({})]),
})

enableAutoUnmount(afterEach)
beforeEach(() => {
	uploader = new FakeUploader()
})

/**
 * Create a file upload.
 *
 * @param source - Source of the upload
 * @param status - Status of the upload
 * @param bytes - Already uploaded bytes
 */
function file(source: string, status: number = UploadStatus.SCHEDULED, bytes = 0): IUpload {
	return { source, status, uploadedBytes: bytes, totalBytes: 100, children: [], signal: new AbortController().signal } as IUpload
}

/**
 * Create a folder upload.
 *
 * @param source - Source of the upload
 * @param children - The uploads in the folder
 * @param status - Status of the folder itself
 */
function folder(source: string, children: IUpload[], status: number = UploadStatus.SCHEDULED): IUpload {
	return { ...file(source, status), children } as IUpload
}

/**
 * Get all uploads of a tree, the way the uploader does for its queue.
 *
 * @param upload - The upload
 */
function descendants(upload: IUpload): IUpload[] {
	return upload.children.flatMap((child) => [child, ...descendants(child)])
}

/**
 * Create the queue of one batch upload: all descendants followed by the root.
 *
 * @param children - The picked files and folders
 * @param status - Status of the root
 */
function batch(children: IUpload[], status: number = UploadStatus.SCHEDULED): IUpload[] {
	const root = folder('/', children, status)
	return [...descendants(root), root]
}

/**
 * Mount the manager with an always open popover.
 *
 * @param props - Props to override
 */
function mountManager(props: Record<string, unknown> = {}) {
	return mount(UploadManager, {
		props: { eta: 'in 20 seconds', paused: false, preparing: false, uploading: false, ...props },
		global: { stubs: { NcPopover } },
	})
}

/**
 * Get the status labels of all rows.
 *
 * @param wrapper - The mounted manager
 */
function statuses(wrapper: VueWrapper) {
	return wrapper.findAll('li [role="img"][aria-label]').map((status) => status.attributes('aria-label'))
}

/**
 * Find a button by its text.
 *
 * @param wrapper - The mounted manager
 * @param text - The text of the button
 */
function button(wrapper: VueWrapper, text: string) {
	return wrapper.findAll('button').find((candidate) => candidate.text() === text)
}

/**
 * Simulate an uploader event.
 *
 * @param event - Name of the event
 */
async function emit(event: string) {
	uploader.dispatchEvent(new CustomEvent(event))
	await nextTick()
}

describe('UploadManager', () => {
	it('shows immediate preparation feedback without a queue', async () => {
		const wrapper = mountManager({ preparing: true })
		expect(wrapper.get('button[aria-label="Upload manager"]').isVisible()).toBe(true)
		expect(wrapper.get('h2').text()).toBe('Preparing uploads')
	})

	it('is hidden without uploads', async () => {
		const wrapper = mountManager()
		expect(wrapper.find('button').exists()).toBe(false)
	})

	it('shows one row per picked file and never the root of the batch', async () => {
		const first = file('/one', UploadStatus.FINISHED, 100)
		const second = file('/two', UploadStatus.UPLOADING, 100)
		uploader.queue = batch([first, second])
		const wrapper = mountManager({ uploading: true })
		await nextTick()
		expect(wrapper.findAll('li')).toHaveLength(2)
		expect(wrapper.get('h2').text()).toBe('Uploading 2 items')
		expect(statuses(wrapper)).toEqual(['Completed', 'Uploading'])
	})

	it('shows one row for a folder with the number of finished files', async () => {
		const nested = folder('/folder/sub', [file('/folder/sub/c', UploadStatus.FINISHED, 100)])
		const directory = folder('/folder', [
			file('/folder/a', UploadStatus.FINISHED, 100),
			file('/folder/b', UploadStatus.UPLOADING, 50),
			nested,
		], UploadStatus.FINISHED)
		uploader.queue = batch([directory, file('/single', UploadStatus.SCHEDULED)])
		const wrapper = mountManager({ uploading: true })
		await nextTick()
		const rows = wrapper.findAll('li')
		expect(rows).toHaveLength(2)
		expect(rows[0]!.text()).toContain('folder')
		expect(rows[0]!.text()).toContain('2 of 3')
		expect(statuses(wrapper)).toEqual(['Uploading', 'Waiting for upload'])
		expect(wrapper.get('h2').text()).toBe('Uploading 2 items')
	})

	it('updates states and distinguishes waiting from an actually paused queue', async () => {
		const upload = file('/one')
		uploader.queue = [upload]
		const wrapper = mountManager()
		await nextTick()
		expect(statuses(wrapper)).toEqual(['Waiting for upload'])
		await wrapper.setProps({ paused: true })
		expect(statuses(wrapper)).toEqual(['Paused'])
		await wrapper.setProps({ paused: false })
		Object.assign(upload, { status: UploadStatus.UPLOADING, uploadedBytes: 30 })
		await emit('uploadProgress')
		expect(statuses(wrapper)).toEqual(['Uploading'])
		Object.assign(upload, { status: UploadStatus.ASSEMBLING, uploadedBytes: 100 })
		await emit('uploadProgress')
		expect(statuses(wrapper)).toEqual(['Assembling'])
		Object.assign(upload, { status: UploadStatus.FINISHED })
		await emit('uploadFinished')
		expect(statuses(wrapper)).toEqual(['Completed'])
	})

	it('retains failed and successful results after automatic reset', async () => {
		uploader.queue = batch([file('/good', UploadStatus.FINISHED, 100), file('/bad', UploadStatus.FAILED)])
		const wrapper = mountManager()
		await nextTick()
		uploader.queue = []
		await emit('reset')
		expect(wrapper.text()).toContain('good')
		expect(wrapper.text()).toContain('bad')
		expect(wrapper.get('h2').text()).toBe('Some uploads failed')
		expect(wrapper.get('[role="status"]').text()).toBe('Some uploads failed')
		expect(wrapper.text()).toContain('Select this file again to retry.')
		expect(statuses(wrapper)).toEqual(['Completed', 'Failed'])
	})

	it('tracks a fresh attempt for the same path separately', async () => {
		uploader.queue = [file('/bad', UploadStatus.FAILED)]
		const wrapper = mountManager()
		await nextTick()
		uploader.queue = [file('/bad', UploadStatus.FINISHED, 100)]
		await emit('uploadStarted')
		expect(statuses(wrapper)).toEqual(['Failed', 'Completed'])
	})

	it('shows a folder that could not be prepared as failed', async () => {
		uploader.queue = batch([folder('/folder', [file('/folder/one')], UploadStatus.FAILED)])
		const wrapper = mountManager()
		await nextTick()
		expect(wrapper.findAll('li')).toHaveLength(1)
		expect(statuses(wrapper)).toEqual(['Failed'])
		expect(wrapper.get('li').text()).toContain('0 of 1')
		expect(wrapper.get('h2').text()).toBe('Some uploads failed')
	})

	it('shows a failed batch root as an additional row', async () => {
		uploader.queue = batch([file('/one', UploadStatus.FINISHED, 100)], UploadStatus.FAILED)
		const wrapper = mountManager()
		await nextTick()
		// the failure is listed first, so it is not hidden behind many successful files
		expect(statuses(wrapper)).toEqual(['Failed', 'Completed'])
		expect(wrapper.findAll('li')[0]!.text()).toContain('Upload preparation')
	})

	it('keeps cancelled transfers after reset', async () => {
		const controller = new AbortController()
		uploader.queue = [{ ...file('/cancel'), signal: controller.signal } as IUpload]
		const wrapper = mountManager()
		await nextTick()
		controller.abort()
		uploader.queue = []
		await emit('reset')
		expect(statuses(wrapper)).toEqual(['Cancelled'])
	})

	it('limits rendered rows for 500 files and can show more', async () => {
		uploader.queue = batch(Array.from({ length: 500 }, (_, index) => file(`/file-${index}`)))
		const wrapper = mountManager({ uploading: true })
		await nextTick()
		expect(wrapper.findAll('li')).toHaveLength(50)
		expect(wrapper.get('h2').text()).toBe('Uploading 500 items')
		await button(wrapper, 'Show more')!.trigger('click')
		expect(wrapper.findAll('li')).toHaveLength(100)
	})

	it('includes files still preparing with unknown byte counts', async () => {
		uploader.queue = [{ ...file('/preparing', UploadStatus.INITIALIZED), totalBytes: -1 } as IUpload]
		const wrapper = mountManager()
		await nextTick()
		expect(statuses(wrapper)).toEqual(['Preparing'])
		expect(wrapper.text()).not.toContain('NaN')
	})

	it('cancels all uploads while uploading', async () => {
		uploader.queue = batch([file('/one', UploadStatus.UPLOADING, 10)])
		const wrapper = mountManager({ uploading: true })
		await nextTick()
		expect(wrapper.text()).toContain('in 20 seconds')
		expect(button(wrapper, 'Clear completed uploads')).toBeUndefined()
		await button(wrapper, 'Cancel')!.trigger('click')
		expect(wrapper.emitted('cancel')).toHaveLength(1)
	})

	it('shows that uploads are paused instead of the remaining time', async () => {
		uploader.queue = batch([file('/one')])
		const wrapper = mountManager({ uploading: true, paused: true })
		await nextTick()
		expect(wrapper.text()).not.toContain('in 20 seconds')
		expect(wrapper.get('h2').text()).toBe('Uploading 1 item')
	})

	it('handles empty files and clears retained terminal results', async () => {
		uploader.queue = batch([{ ...file('/empty', UploadStatus.FINISHED), totalBytes: 0 } as IUpload])
		const wrapper = mountManager()
		await nextTick()
		expect(wrapper.get('h2').text()).toBe('1 item uploaded')
		expect(button(wrapper, 'Cancel')).toBeUndefined()
		await button(wrapper, 'Clear completed uploads')!.trigger('click')
		expect(wrapper.findAll('li')).toHaveLength(0)
		expect(wrapper.find('button').exists()).toBe(false)
	})

	it('describes the popover for assistive technology', async () => {
		uploader.queue = [file('/one')]
		const wrapper = mountManager()
		await nextTick()
		expect(wrapper.get('[role="dialog"]').attributes('aria-label')).toBe('Upload manager')
		expect(wrapper.get('button[aria-label="Upload manager"]').isVisible()).toBe(true)
	})

	it('cleans up every registered event listener', async () => {
		const add = vi.spyOn(uploader, 'addEventListener')
		const remove = vi.spyOn(uploader, 'removeEventListener')
		const wrapper = mountManager()
		await nextTick()
		wrapper.unmount()
		for (const [event, listener] of add.mock.calls) {
			expect(remove).toHaveBeenCalledWith(event, listener)
		}
	})
})
