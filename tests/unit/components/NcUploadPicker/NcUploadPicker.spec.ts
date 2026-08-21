/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { IFolder, INode } from '@nextcloud/files'
import type { IUpload } from '@nextcloud/files/upload'
import type { ComponentPublicInstance } from 'vue'

import { Folder, File as NcFile, Permission } from '@nextcloud/files'
import { UploaderStatus, UploadStatus } from '@nextcloud/files/upload'
import { generateRemoteUrl } from '@nextcloud/router'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import NcProgressBar from '../../../../src/components/NcProgressBar/NcProgressBar.vue'
import NcUploadPicker from '../../../../src/components/NcUploadPicker/NcUploadPicker.vue'

const openConflictPicker = vi.hoisted(() => vi.fn())
vi.mock('@nextcloud/dialogs', () => ({ openConflictPicker }))

/**
 * The conflict resolution callback passed to the uploader.
 */
type ConflictsCallback = (nodes: string[], path: string) => Promise<false | Record<string, string>>

/**
 * A minimal uploader to be able to simulate all upload states without any network requests.
 */
class FakeUploader extends EventTarget {
	status: number = UploaderStatus.IDLE
	queue: Partial<IUpload>[] = []
	statistics = { eta: Infinity, progress: 0, speed: -1, speedReadable: '' }
	destination: IFolder | undefined = undefined
	batchUpload = vi.fn<(path: string, files: File[], options: { callback: ConflictsCallback }) => Promise<IUpload[]>>(async () => [])
	reset = vi.fn()

	/**
	 * Simulate an event of the uploader.
	 *
	 * @param name - Name of the event
	 * @param detail - The upload the event is about
	 */
	async emit(name: string, detail?: Partial<IUpload>): Promise<void> {
		this.dispatchEvent(new CustomEvent(name, { detail }))
		await nextTick()
	}
}

let uploader: FakeUploader
vi.mock('@nextcloud/files/upload', async (importOriginal) => ({
	...await importOriginal<object>(),
	getUploader: () => uploader,
}))

// the pickers register global event listeners, so they must not outlive their test
enableAutoUnmount(afterEach)

beforeEach(() => {
	uploader = new FakeUploader()
})

afterEach(() => {
	vi.restoreAllMocks()
	openConflictPicker.mockReset()
})

describe('NcUploadPicker: rendering', () => {
	it('has an accessible name and a visible label', () => {
		const wrapper = mountPicker()

		const button = pickerButton(wrapper)
		expect(button.attributes('aria-label')).toBe('New')
		expect(button.text()).toBe('New')
	})

	it('can use a custom label', () => {
		const wrapper = mountPicker({ label: 'Add attachment' })

		const button = pickerButton(wrapper)
		expect(button.attributes('aria-label')).toBe('Add attachment')
		expect(button.text()).toBe('Add attachment')
	})

	it('keeps the accessible name when only the icon is shown', () => {
		const wrapper = mountPicker({ iconOnly: true })

		const button = pickerButton(wrapper)
		expect(button.attributes('aria-label')).toBe('New')
		expect(button.text()).toBe('')
	})

	it('can be disabled', () => {
		const wrapper = mountPicker({ disabled: true })

		expect(pickerButton(wrapper).attributes('disabled')).toBeDefined()
	})

	it('forwards the allowed MIME types and multiple to the file input', () => {
		const wrapper = mountPicker({ accept: ['image/png', 'image/jpeg'], multiple: true })

		const input = wrapper.get('input[type="file"]')
		expect(input.attributes('accept')).toBe('image/png, image/jpeg')
		expect(input.attributes('multiple')).toBeDefined()
	})

	it('has no visible progress while idle', () => {
		const wrapper = mountPicker()

		expect(wrapper.get('progress').isVisible()).toBe(false)
		expect(wrapper.find('button[aria-label="Cancel uploads"]').exists()).toBe(false)
	})
})

describe('NcUploadPicker: destination', () => {
	it('sets the destination on the uploader', () => {
		mountPicker({ destination: createFolder('files/user/Documents') })

		expect(uploader.destination!.source).toContain('/files/user/Documents')
	})

	it('updates the destination when the prop changes', async () => {
		const wrapper = mountPicker()

		await wrapper.setProps({ destination: createFolder('files/user/Photos') })

		expect(uploader.destination!.source).toContain('/files/user/Photos')
	})

	it('updates the destination using the exposed method', () => {
		const wrapper = mountPicker()

		;(wrapper.vm as ComponentPublicInstance<unknown, { setDestination: (folder: IFolder) => void }>)
			.setDestination(createFolder('photos/user/albums/Vacation'))

		expect(uploader.destination!.source).toContain('/photos/user/albums/Vacation')
	})

	it('ignores an invalid destination', () => {
		const wrapper = mountPicker({ destination: createFolder('files/user/Documents') })

		;(wrapper.vm as ComponentPublicInstance<unknown, { setDestination: (folder?: IFolder) => void }>)
			.setDestination(undefined)

		expect(uploader.destination!.source).toContain('/files/user/Documents')
	})
})

describe('NcUploadPicker: uploading', () => {
	/**
	 * Pick files using the hidden file input.
	 *
	 * @param wrapper - The mounted picker
	 * @param files - The files to pick
	 */
	async function pickFiles(wrapper: ReturnType<typeof mountPicker>, ...files: File[]) {
		const input = wrapper.get<HTMLInputElement>('input[type="file"]')
		Object.defineProperty(input.element, 'files', { configurable: true, value: files })
		await input.trigger('change')
	}

	const file = () => new File(['content'], 'file.txt', { type: 'text/plain' })

	it('uploads the picked files to the destination', async () => {
		const wrapper = mountPicker()

		await pickFiles(wrapper, file())

		expect(uploader.batchUpload).toHaveBeenCalledOnce()
		const [path, files] = uploader.batchUpload.mock.calls[0]
		expect(path).toBe('')
		expect(files.map(({ name }) => name)).toEqual(['file.txt'])
	})

	it('resets the file input after uploading', async () => {
		const reset = vi.spyOn(HTMLFormElement.prototype, 'reset')
		const wrapper = mountPicker()

		await pickFiles(wrapper, file())
		await nextTick()

		expect(reset).toHaveBeenCalled()
	})

	it('resets the file input if the upload failed', async () => {
		const reset = vi.spyOn(HTMLFormElement.prototype, 'reset')
		uploader.batchUpload.mockRejectedValueOnce(new Error('upload failed'))
		const wrapper = mountPicker()

		await pickFiles(wrapper, file())
		await nextTick()

		expect(reset).toHaveBeenCalled()
	})

	it('resets the file input using the exposed method', () => {
		const reset = vi.spyOn(HTMLFormElement.prototype, 'reset')
		const wrapper = mountPicker()

		;(wrapper.vm as ComponentPublicInstance<unknown, { reset: () => void }>).reset()

		expect(reset).toHaveBeenCalledOnce()
	})

	it('shows the progress and the cancel button while uploading', async () => {
		const wrapper = mountPicker()

		uploader.status = UploaderStatus.UPLOADING
		await uploader.emit('uploadStarted', { source: 'file.txt' })

		const progress = wrapper.get('progress')
		expect(progress.isVisible()).toBe(true)
		expect(wrapper.get('button[aria-label="Cancel uploads"]').isVisible()).toBe(true)
		// the progress bar is labelled and described by the remaining time
		expect(progress.attributes('aria-label')).toBe('Upload progress')
		expect(progress.attributes('aria-describedby')).toBe(wrapper.get('p').attributes('id'))
		expect(progressLabel(wrapper)).toBe('Estimating …')
	})

	it('hides the progress when all uploads are done', async () => {
		const wrapper = mountPicker()
		uploader.status = UploaderStatus.UPLOADING
		await uploader.emit('uploadStarted', { source: 'file.txt' })

		uploader.status = UploaderStatus.IDLE
		await uploader.emit('finished')

		expect(wrapper.get('progress').isVisible()).toBe(false)
		expect(wrapper.find('button[aria-label="Cancel uploads"]').exists()).toBe(false)
	})

	it('shows the remaining time and the upload speed', async () => {
		vi.useFakeTimers({ now: new Date('2025-08-19T10:00:00Z') })
		const wrapper = mountPicker()
		uploader.status = UploaderStatus.UPLOADING
		await uploader.emit('uploadStarted', { source: 'file.txt' })

		uploader.statistics = { eta: 300, progress: 42, speed: 1024 * 1024, speedReadable: '1 MB∕s' }
		await uploader.emit('uploadProgress', { source: 'file.txt' })

		expect(wrapper.get('progress').attributes('value')).toBe('42')
		expect(progressLabel(wrapper)).toBe('in 5 minutes (1 MB∕s)')
		expect(wrapper.get('p span').attributes('title')).toBe('in 5 minutes (1 MB∕s)')
		vi.useRealTimers()
	})

	it('shows the progress bar as failed if an upload failed', async () => {
		const wrapper = mountPicker()

		uploader.status = UploaderStatus.UPLOADING
		uploader.queue = [{ status: UploadStatus.FAILED, children: [] }]
		await uploader.emit('uploadFinished', { source: 'file.txt', status: UploadStatus.FAILED })

		// there is no accessible state for a failed progress bar, so the prop is checked instead
		expect(wrapper.getComponent(NcProgressBar).props('error')).toBe(true)
	})

	it('shows the assembling state and hides the cancel button', async () => {
		const wrapper = mountPicker()

		uploader.status = UploaderStatus.UPLOADING
		uploader.queue = [
			{ status: UploadStatus.ASSEMBLING, children: [] },
			{ status: UploadStatus.FINISHED, children: [{} as IUpload] },
		]
		await uploader.emit('uploadFinished', { source: 'file.txt', status: UploadStatus.FINISHED })

		expect(progressLabel(wrapper)).toBe('assembling')
		expect(wrapper.find('button[aria-label="Cancel uploads"]').exists()).toBe(false)
	})

	it('cancels all uploads', async () => {
		const wrapper = mountPicker()
		uploader.status = UploaderStatus.UPLOADING
		await uploader.emit('uploadStarted', { source: 'file.txt' })

		await wrapper.get('button[aria-label="Cancel uploads"]').trigger('click')

		expect(uploader.reset).toHaveBeenCalledOnce()
	})

	it('emits the upload events', async () => {
		const wrapper = mountPicker()

		const upload = { source: 'file.txt', status: UploadStatus.FINISHED }
		await uploader.emit('uploadStarted', upload)
		await uploader.emit('uploadFinished', upload)

		expect(wrapper.emitted('upload:started')).toEqual([[upload]])
		expect(wrapper.emitted('upload:finished')).toEqual([[upload]])
	})

	it('emits the finished event when the queue is done', async () => {
		const wrapper = mountPicker()

		uploader.status = UploaderStatus.UPLOADING
		await uploader.emit('uploadStarted', { source: 'file.txt' })
		uploader.status = UploaderStatus.IDLE
		await uploader.emit('finished')

		expect(wrapper.emitted('finished')).toHaveLength(1)
	})

	it('shows the paused state and emits the paused and resumed events', async () => {
		const wrapper = mountPicker()
		uploader.status = UploaderStatus.UPLOADING
		await uploader.emit('uploadStarted', { source: 'file.txt' })

		const queued = { source: 'file.txt', status: UploadStatus.SCHEDULED }
		uploader.queue = [queued]
		uploader.status = UploaderStatus.PAUSED
		await uploader.emit('paused')

		expect(wrapper.get('progress').isVisible()).toBe(true)
		expect(progressLabel(wrapper)).toBe('paused')
		expect(wrapper.emitted('paused')).toEqual([[[queued]]])

		uploader.status = UploaderStatus.UPLOADING
		await uploader.emit('resumed')

		expect(progressLabel(wrapper)).not.toBe('paused')
		expect(wrapper.emitted('resumed')).toEqual([[[queued]]])
	})

	it('shows uploads that are queued while paused', async () => {
		const wrapper = mountPicker()

		// the uploader is paused, so the queued upload is not started
		uploader.status = UploaderStatus.PAUSED
		uploader.queue = [{ source: 'file.txt', status: UploadStatus.INITIALIZED, children: [] }]
		await uploader.emit('uploadStarted', uploader.queue[0])

		expect(wrapper.get('progress').isVisible()).toBe(true)
		expect(wrapper.get('progress').attributes('value')).toBe('0')
		expect(progressLabel(wrapper)).toBe('paused')
		// the queued uploads can still be cancelled
		expect(wrapper.get('button[aria-label="Cancel uploads"]').isVisible()).toBe(true)
	})

	it('hides the progress when the queue is reset', async () => {
		const wrapper = mountPicker()
		uploader.status = UploaderStatus.PAUSED
		uploader.queue = [{ source: 'file.txt', status: UploadStatus.INITIALIZED, children: [] }]
		await uploader.emit('uploadStarted', uploader.queue[0])

		// resetting the uploader empties the queue and continues the queue processing
		uploader.status = UploaderStatus.IDLE
		uploader.queue = []
		await uploader.emit('reset')

		expect(wrapper.get('progress').isVisible()).toBe(false)
		expect(wrapper.find('button[aria-label="Cancel uploads"]').exists()).toBe(false)
	})
})

describe('NcUploadPicker: unloading the page', () => {
	/**
	 * Try to unload the page.
	 */
	function unloadPage(): boolean {
		return !window.dispatchEvent(new Event('beforeunload', { cancelable: true }))
	}

	it('blocks unloading the page while there are uploads', () => {
		mountPicker()
		uploader.queue = [{ status: UploadStatus.UPLOADING }]

		expect(unloadPage()).toBe(true)
	})

	it('does not block unloading the page without uploads', () => {
		mountPicker()

		expect(unloadPage()).toBe(false)
	})

	it('does not block unloading the page after being unmounted', () => {
		const wrapper = mountPicker()
		uploader.queue = [{ status: UploadStatus.UPLOADING }]
		wrapper.unmount()

		expect(unloadPage()).toBe(false)
	})
})

describe('NcUploadPicker: conflict handling', () => {
	/**
	 * Mount the picker and resolve conflicts like the uploader would do.
	 *
	 * @param nodes - Basenames of the files to upload
	 * @param options - The existing content of the destination and the props of the picker
	 */
	async function resolveConflicts(
		nodes: string[],
		{ content = [], ...props }: { content?: string[] } & Record<string, unknown> = {},
	) {
		const wrapper = mountPicker({ content: async () => content.map(createNode), ...props })
		const input = wrapper.get<HTMLInputElement>('input[type="file"]')
		const files = nodes.map((name) => new File(['content'], name))
		Object.defineProperty(input.element, 'files', { configurable: true, value: files })
		await input.trigger('change')

		const { callback } = uploader.batchUpload.mock.calls[0][2]
		return await callback(nodes, `${createFolder().source}/`)
	}

	it('uploads all files if there are no conflicts', async () => {
		const resolution = await resolveConflicts(['first.txt', 'second.txt'], { content: ['other.txt'] })

		expect(openConflictPicker).not.toHaveBeenCalled()
		expect(resolution).toEqual({ 'first.txt': 'first.txt', 'second.txt': 'second.txt' })
	})

	it('asks the user how to resolve conflicts', async () => {
		openConflictPicker.mockResolvedValue({ selected: [createNode('file.txt')], renamed: [], skipped: [] })

		const resolution = await resolveConflicts(['file.txt', 'other.txt'], { content: ['file.txt'] })

		expect(openConflictPicker).toHaveBeenCalledOnce()
		const [, conflicts, content] = openConflictPicker.mock.calls[0]
		expect((conflicts as INode[]).map(({ basename }) => basename)).toEqual(['file.txt'])
		expect((content as INode[]).map(({ basename }) => basename)).toEqual(['file.txt'])
		// the selected files overwrite the existing ones
		expect(resolution).toEqual({ 'file.txt': 'file.txt', 'other.txt': 'other.txt' })
	})

	it('resolves conflicts recursively when uploading directories', async () => {
		openConflictPicker.mockResolvedValue({ selected: [createNode('file.txt')], renamed: [], skipped: [] })

		await resolveConflicts(['file.txt'], { content: ['file.txt'], directory: true })

		expect(openConflictPicker).toHaveBeenCalledWith(
			expect.anything(),
			expect.anything(),
			expect.anything(),
			{ recursive: true },
		)
	})

	it('skips the files the user does not want to upload', async () => {
		openConflictPicker.mockResolvedValue({ selected: [], renamed: [], skipped: [createNode('file.txt')] })

		const resolution = await resolveConflicts(['file.txt', 'other.txt'], { content: ['file.txt'] })

		expect(resolution).toEqual({ 'other.txt': 'other.txt' })
	})

	it('renames the files the user wants to keep both versions of', async () => {
		openConflictPicker.mockResolvedValue({ selected: [], renamed: [createNode('file.txt')], skipped: [] })

		const resolution = await resolveConflicts(['file.txt'], { content: ['file.txt'] })

		expect(resolution).toEqual({ 'file.txt': 'file (1).txt' })
	})

	it('cancels the upload if the user aborts the conflict resolution', async () => {
		openConflictPicker.mockResolvedValue(null)

		const resolution = await resolveConflicts(['file.txt'], { content: ['file.txt'] })

		expect(resolution).toBe(false)
	})
})

/**
 * Create an upload destination folder.
 *
 * @param path - The WebDAV path relative to `remote.php/dav/`
 */
function createFolder(path = 'files/user/Folder'): Folder {
	return new Folder({
		id: 56,
		owner: 'user',
		source: generateRemoteUrl(`dav/${path}`),
		permissions: Permission.ALL,
		root: `/${path.split('/').slice(0, 2).join('/')}`,
	})
}

/**
 * Create an existing node of the upload destination.
 *
 * @param name - Basename of the node
 */
function createNode(name: string): INode {
	return new NcFile({
		owner: 'user',
		source: `${createFolder().source}/${name}`,
		root: '/files/user',
		mime: 'text/plain',
	})
}

/**
 * Mount the upload picker.
 *
 * @param props - Props of the picker, the destination and the content are provided by default
 */
function mountPicker(props: Record<string, unknown> = {}) {
	return mount(NcUploadPicker, {
		props: {
			content: async () => [],
			destination: createFolder(),
			...props,
		},
	})
}

/**
 * The picker button, the accessible name is either the label or the `aria-label`.
 *
 * @param wrapper - The mounted picker
 */
function pickerButton(wrapper: ReturnType<typeof mountPicker>) {
	return wrapper.get('button[aria-label]')
}

/**
 * The progress label, showing the remaining time or the current state of the uploads.
 *
 * @param wrapper - The mounted picker
 */
function progressLabel(wrapper: ReturnType<typeof mountPicker>): string {
	// collapse the whitespace of the template, but keep non-breaking spaces
	return wrapper.get('p').text().replace(/[\n\t ]+/g, ' ')
}
