/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { UploadStatus as UpstreamUploadStatus } from '@nextcloud/files/upload'
import type { Page } from '@playwright/test'

import { expect, test } from '@playwright/experimental-ct-vue'

const DAV_ROOT = /^.*?\/remote\.php\/dav/

/**
 * Mirror of `UploadStatus` from `@nextcloud/files/upload`.
 *
 * The upstream module cannot be imported at runtime here, as it is only usable in a browser
 * (it accesses `window` on import), while the test bodies themselves run in Node.
 * The `satisfies` clause makes the type checker fail if the upstream values ever change,
 * so this mirror cannot silently drift.
 */
export const UploadStatus = {
	INITIALIZED: 0,
	SCHEDULED: 1,
	UPLOADING: 2,
	ASSEMBLING: 3,
	FINISHED: 4,
	CANCELLED: 5,
	FAILED: 6,
} as const satisfies typeof UpstreamUploadStatus

/**
 * Skip the surrounding tests on browsers that cannot drive a file picker.
 *
 * Call this at the top of a `test.describe` that picks files.
 */
export function skipWithoutFilePicker(): void {
	test.skip(({ browserName }) => browserName === 'webkit', 'WebKit does not support file pickers in Playwright yet')
}

export interface FakeFile {
	name: string
	mimeType: string
	buffer: Buffer
}

/**
 * Create a fake file of the given size.
 *
 * @param name - Name of the file
 * @param sizeInMiB - Size of the file in MiB
 * @param mimeType - MIME type of the file
 */
export function createFile(name: string, sizeInMiB: number, mimeType = 'text/plain'): FakeFile {
	return {
		name,
		mimeType,
		buffer: Buffer.alloc(sizeInMiB * 1024 * 1024),
	}
}

/**
 * Pick files using the upload picker button.
 *
 * @param page - The page of the test
 * @param files - The files to pick
 */
export async function pickFiles(page: Page, ...files: FakeFile[]): Promise<void> {
	const fileChooser = page.waitForEvent('filechooser')
	await page.getByRole('button', { name: 'New' }).click()
	await (await fileChooser).setFiles(files)
}

export interface DavRequest {
	/**
	 * The HTTP method, e.g. `PUT`.
	 */
	method: string

	/**
	 * The decoded path relative to the WebDAV root, e.g. `/files/user/Folder/image.jpg`.
	 */
	path: string

	/**
	 * The full requested URL, as sent by the browser.
	 */
	url: string

	/**
	 * Send the response of this request.
	 * Only needed for requests that are hold back.
	 */
	respond: () => void
}

export interface DavMockOptions {
	/**
	 * Hold back the response of matching requests until they are released.
	 *
	 * @default false
	 */
	hold?: (request: DavRequest) => boolean

	/**
	 * The status code used to respond to a request.
	 *
	 * @default 200 for `HEAD` on the destination, 404 for any other `HEAD`, 204 for `MOVE` and 201 otherwise
	 */
	status?: (request: DavRequest) => number

	/**
	 * Abort matching requests with a network error instead of responding to them.
	 *
	 * @default false
	 */
	fail?: (request: DavRequest) => boolean
}

export interface DavMock {
	/**
	 * All requests that have been received, in the order they were received.
	 */
	requests: DavRequest[]

	/**
	 * Get all received requests matching the given method and path.
	 *
	 * @param method - The HTTP method
	 * @param path - Pattern the path has to match
	 */
	received(method: string, path?: RegExp): DavRequest[]

	/**
	 * Wait until the expected number of matching requests was received and return them.
	 *
	 * @param method - The HTTP method
	 * @param options - Number of expected requests, pattern the path has to match and the timeout in milliseconds
	 */
	waitFor(method: string, options?: { count?: number, path?: RegExp, timeout?: number }): Promise<DavRequest[]>

	/**
	 * Assert that no further matching requests arrive within the given duration.
	 *
	 * Unlike `received()`, which only looks at the requests received so far, this waits,
	 * so the assertion does not pass just because a request the uploader is about to send
	 * has not been sent yet.
	 *
	 * @param method - The HTTP method
	 * @param options - Pattern the path has to match and how long to wait in milliseconds
	 */
	expectNoMore(method: string, options?: { path?: RegExp, timeout?: number }): Promise<void>

	/**
	 * Stop holding back responses:
	 * all requests that are currently hold back are answered, as are all following requests.
	 */
	releaseAll(): void
}

/**
 * The status code a WebDAV server would answer with.
 *
 * @param request - The request to answer
 */
function defaultStatus(request: DavRequest): number {
	if (request.method === 'HEAD') {
		// the upload destination exists, any other folder (e.g. an uploaded directory) does not
		return request.path.endsWith('/') ? 200 : 404
	}
	return request.method === 'MOVE' ? 204 : 201
}

/**
 * Fake the WebDAV endpoints used for uploading.
 *
 * @param page - The page of the test
 * @param options - Options to adjust the responses
 */
export async function mockDav(page: Page, options: DavMockOptions = {}): Promise<DavMock> {
	const requests: DavRequest[] = []
	let holdResponses = true

	await page.route('**/remote.php/dav/**', async (route) => {
		const { promise, resolve } = Promise.withResolvers<void>()

		const url = route.request().url()
		const request: DavRequest = {
			method: route.request().method(),
			path: decodeURIComponent(new URL(url).pathname.replace(DAV_ROOT, '')),
			url,
			respond: resolve,
		}
		requests.push(request)

		if (!holdResponses || !options.hold?.(request)) {
			request.respond()
		}
		await promise

		try {
			if (options.fail?.(request)) {
				await route.abort('connectionreset')
			} else {
				await route.fulfill({ status: options.status?.(request) ?? defaultStatus(request) })
			}
		} catch {
			// The request was aborted, e.g. because the upload was cancelled, or the page is already closed
		}
	})

	const received = (method: string, path?: RegExp) => requests
		.filter((request) => request.method === method && (path === undefined || path.test(request.path)))

	return {
		requests,

		received,

		async waitFor(method, { count = 1, path, timeout = 15000 } = {}) {
			await expect
				.poll(() => received(method, path).length, { message: `Waiting for ${count} ${method} request(s)`, timeout })
				.toBeGreaterThanOrEqual(count)
			return received(method, path)
		},

		async expectNoMore(method, { path, timeout = 2000 } = {}) {
			const count = received(method, path).length
			await page.waitForTimeout(timeout)
			expect(received(method, path), `Expected no further ${method} request`).toHaveLength(count)
		},

		releaseAll() {
			holdResponses = false
			requests.forEach((request) => request.respond())
		},
	}
}
