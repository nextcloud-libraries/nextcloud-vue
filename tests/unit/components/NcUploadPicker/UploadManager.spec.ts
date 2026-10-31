/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { IUpload } from '@nextcloud/files/upload'

import { UploaderStatus, UploadStatus } from '@nextcloud/files/upload'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import UploadManager from '../../../../src/components/NcUploadPicker/UploadManager.vue'

class FakeUploader extends EventTarget {
	queue: IUpload[] = []
	status: number = UploaderStatus.IDLE
}

let uploader: FakeUploader
vi.mock('@nextcloud/files/upload', async (original) => ({
	...await original<object>(),
	getUploader: () => uploader,
}))

enableAutoUnmount(afterEach)
beforeEach(() => {
	uploader = new FakeUploader()
})

function file(source: string, status: number = UploadStatus.SCHEDULED, bytes = 0): IUpload {
	return { source, status, uploadedBytes: bytes, totalBytes: 100, children: [], signal: new AbortController().signal } as IUpload
}

async function emit(event: string) {
	uploader.dispatchEvent(new CustomEvent(event))
	await nextTick()
}

describe('UploadManager', () => {
	it('shows immediate preparation feedback without a queue', async () => {
		const wrapper = mount(UploadManager, { props: { preparing: true } })
		expect(wrapper.get('button[aria-expanded]').isVisible()).toBe(true)
		expect(wrapper.text()).toContain('Preparing uploads')
	})

	it('counts files without counting directory parents and weights progress by bytes', async () => {
		const first = file('/one', UploadStatus.FINISHED, 100)
		const second = { ...file('/two', UploadStatus.UPLOADING, 100), totalBytes: 300 } as IUpload
		uploader.queue = [first, second, { ...file('/'), children: [first, second] } as IUpload]
		const wrapper = mount(UploadManager, { props: { preparing: false } })
		await nextTick()
		expect(wrapper.get('button[aria-expanded]').text()).toContain('1 of 2 files uploaded · 50 %')
		expect(wrapper.findAll('li')).toHaveLength(2)
	})

	it('updates states and distinguishes waiting from an actually paused queue', async () => {
		const upload = file('/one')
		uploader.queue = [upload]
		const wrapper = mount(UploadManager, { props: { preparing: false } })
		await nextTick()
		expect(wrapper.text()).toContain('Waiting for upload')
		expect(wrapper.text()).not.toContain('Paused')
		uploader.status = UploaderStatus.PAUSED
		await emit('paused')
		expect(wrapper.text()).toContain('Paused')
		uploader.status = UploaderStatus.UPLOADING
		Object.assign(upload, { status: UploadStatus.UPLOADING, uploadedBytes: 30 })
		await emit('uploadProgress')
		expect(wrapper.text()).toContain('Uploading · 30 %')
		Object.assign(upload, { status: UploadStatus.ASSEMBLING, uploadedBytes: 100 })
		await emit('uploadProgress')
		expect(wrapper.text()).toContain('Assembling · 100 %')
		Object.assign(upload, { status: UploadStatus.FINISHED })
		await emit('uploadFinished')
		expect(wrapper.text()).toContain('Completed · 100 %')
	})

	it('retains failed and successful results after automatic reset', async () => {
		uploader.queue = [file('/good', UploadStatus.FINISHED, 100), file('/bad', UploadStatus.FAILED)]
		const wrapper = mount(UploadManager, { props: { preparing: false } })
		await nextTick()
		uploader.queue = []
		await emit('reset')
		expect(wrapper.text()).toContain('good')
		expect(wrapper.text()).toContain('bad')
		expect(wrapper.text()).toContain('Some uploads failed')
		expect(wrapper.text()).toContain('Select this file again to retry.')
	})

	it('tracks a fresh attempt for the same path separately', async () => {
		uploader.queue = [file('/bad', UploadStatus.FAILED)]
		const wrapper = mount(UploadManager, { props: { preparing: false } })
		await nextTick()
		uploader.queue = [file('/bad', UploadStatus.FINISHED, 100)]
		await emit('uploadStarted')
		expect(wrapper.findAll('li')).toHaveLength(2)
		expect(wrapper.get('button[aria-expanded]').text()).toContain('1 of 2')
	})

	it('shows directory preparation failures without counting their bookkeeping as files', async () => {
		const child = file('/folder/one')
		uploader.queue = [child, { ...file('/folder', UploadStatus.FAILED), children: [child] } as IUpload]
		const wrapper = mount(UploadManager, { props: { preparing: false } })
		await nextTick()
		expect(wrapper.get('button[aria-expanded]').text()).toContain('0 of 1 files')
		expect(wrapper.text()).toContain('Some uploads failed')
		expect(wrapper.findAll('li')).toHaveLength(2)
	})

	it('keeps cancelled transfers after reset', async () => {
		const controller = new AbortController()
		uploader.queue = [{ ...file('/cancel'), signal: controller.signal } as IUpload]
		const wrapper = mount(UploadManager, { props: { preparing: false } })
		await nextTick()
		controller.abort()
		uploader.queue = []
		await emit('reset')
		expect(wrapper.text()).toContain('Cancelled')
	})

	it('limits rendered rows for 500 files and can show more', async () => {
		uploader.queue = Array.from({ length: 500 }, (_, index) => file(`/file-${index}`))
		const wrapper = mount(UploadManager, { props: { preparing: false } })
		await nextTick()
		expect(wrapper.findAll('li')).toHaveLength(50)
		expect(wrapper.get('button[aria-expanded]').text()).toContain('0 of 500')
		await wrapper.get('button[aria-expanded]').trigger('click')
		await wrapper.get('section button').trigger('click')
		expect(wrapper.findAll('li')).toHaveLength(100)
	})

	it('includes files still preparing with unknown byte counts', async () => {
		uploader.queue = [{ ...file('/preparing', UploadStatus.INITIALIZED, -1), totalBytes: -1 } as IUpload]
		const wrapper = mount(UploadManager, { props: { preparing: false } })
		await nextTick()
		expect(wrapper.text()).toContain('Preparing · 0 %')
		expect(wrapper.text()).not.toContain('NaN')
	})

	it('handles empty files and clears retained terminal results', async () => {
		uploader.queue = [{ ...file('/empty', UploadStatus.FINISHED), totalBytes: 0 } as IUpload]
		const wrapper = mount(UploadManager, { props: { preparing: false } })
		await nextTick()
		expect(wrapper.get('button[aria-expanded]').text()).toContain('100 %')
		await wrapper.get('button[aria-expanded]').trigger('click')
		await wrapper.get('section button').trigger('click')
		expect(wrapper.findAll('li')).toHaveLength(0)
		expect(wrapper.get('button[aria-expanded]').isVisible()).toBe(false)
	})

	it('opens and closes independently of the uploader and supports Escape', async () => {
		uploader.queue = [file('/one')]
		const wrapper = mount(UploadManager, { props: { preparing: false }, attachTo: document.body })
		await wrapper.get('button[aria-expanded]').trigger('click')
		expect(wrapper.get('section').isVisible()).toBe(true)
		await wrapper.get('button[aria-expanded]').trigger('keydown', { key: 'Escape' })
		expect(wrapper.get('button[aria-expanded]').attributes('aria-expanded')).toBe('false')
		expect(document.activeElement).toBe(wrapper.get('button[aria-expanded]').element)
		expect(uploader.queue).toHaveLength(1)
		expect(wrapper.get('section').attributes('aria-label')).toBe('Upload manager')
		expect(wrapper.get('progress').attributes('aria-label')).toBe('one')
	})

	it('cleans up every registered event listener', async () => {
		const add = vi.spyOn(uploader, 'addEventListener')
		const remove = vi.spyOn(uploader, 'removeEventListener')
		const wrapper = mount(UploadManager, { props: { preparing: false } })
		await nextTick()
		wrapper.unmount()
		for (const [event, listener] of add.mock.calls) {
			expect(remove).toHaveBeenCalledWith(event, listener)
		}
	})
})
