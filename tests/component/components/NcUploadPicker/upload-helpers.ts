/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Page } from '@playwright/test'

import { expect } from '@playwright/experimental-ct-vue'

const DAV_ROOT = /^.*\/remote\.php\/dav/

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
 */
export function createFile(name: string, sizeInMiB: number): FakeFile {
	return {
		name,
		mimeType: 'text/plain',
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
			await route.fulfill({ status: options.status?.(request) ?? defaultStatus(request) })
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

		releaseAll() {
			holdResponses = false
			requests.forEach((request) => request.respond())
		},
	}
}
