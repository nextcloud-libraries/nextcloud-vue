/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import axios from '@nextcloud/axios'

/** Requests to this endpoint are answered by the fake WebDAV server */
const DAV_ENDPOINT = /\/(remote|public)\.php\/dav\//

/** Simulated transfer speed in bytes per second */
const UPLOAD_SPEED = 4 * 1024 * 1024

/** Minimum duration of a simulated upload in milliseconds, so the progress stays visible for small files */
const MIN_UPLOAD_DURATION = 2500

/** Delay between two simulated upload progress events in milliseconds */
const PROGRESS_INTERVAL = 100

/** Simulated duration of assembling the chunks of a chunked upload in milliseconds */
const ASSEMBLE_DURATION = 1500

/** Simulated duration of all other requests in milliseconds */
const REQUEST_DURATION = 250

/**
 * Fake the WebDAV endpoints used for uploading files.
 *
 * There is no Nextcloud server behind the styleguide, so all requests of the uploader
 * (`@nextcloud/files/upload`, used by `NcUploadPicker`) are answered locally
 * by simulating a slow but successful upload.
 */
export function mockWebDav() {
	axios.interceptors.request.use((config) => {
		if (DAV_ENDPOINT.test(config.url ?? '')) {
			config.adapter = davAdapter
		}
		return config
	})
}

/**
 * Custom Axios adapter answering WebDAV requests without any network access.
 *
 * @param {object} config - The Axios request config
 * @return {Promise<object>} The simulated Axios response
 */
async function davAdapter(config) {
	switch (config.method?.toUpperCase()) {
		case 'HEAD':
			// The upload destination exists, any other directory (e.g. an uploaded one) has to be created first
			await wait(REQUEST_DURATION, config.signal)
			return respond(config, config.url.endsWith('/') ? 200 : 404)
		case 'PUT':
			// Uploading a file or one chunk of it
			await simulateUpload(config)
			return respond(config, 201)
		case 'MOVE':
			// Assembling the chunks of a chunked upload
			await wait(ASSEMBLE_DURATION, config.signal)
			return respond(config, 204)
		default:
			// MKCOL to create a directory or the temporary workspace of a chunked upload
			await wait(REQUEST_DURATION, config.signal)
			return respond(config, 201)
	}
}

/**
 * Simulate transferring the data of a request, including the upload progress events.
 *
 * @param {object} config - The Axios request config
 */
async function simulateUpload(config) {
	const total = config.data?.size ?? 0
	const duration = Math.max(MIN_UPLOAD_DURATION, (total / UPLOAD_SPEED) * 1000)
	const steps = Math.ceil(duration / PROGRESS_INTERVAL)

	let loaded = 0
	for (let step = 1; step <= steps; step++) {
		await wait(PROGRESS_INTERVAL, config.signal)
		const bytes = Math.round((total * step) / steps) - loaded
		loaded += bytes
		config.onUploadProgress?.({ bytes, loaded, total, lengthComputable: true })
	}
}

/**
 * Create the response of a simulated request.
 * Just like Axios, responses with an error status are rejected.
 *
 * @param {object} config - The Axios request config
 * @param {number} status - The HTTP status to respond with
 * @return {object} The simulated Axios response
 */
function respond(config, status) {
	const response = {
		config,
		data: '',
		headers: {},
		request: { responseURL: config.url },
		status,
		statusText: '',
	}

	if (status >= 200 && status < 300) {
		return response
	}

	// Mimic an `AxiosError` so the failure is handled like the one of a real request
	return Promise.reject(Object.assign(new Error(`Request failed with status code ${status}`), {
		config,
		isAxiosError: true,
		request: response.request,
		response,
		status,
	}))
}

/**
 * Wait for the given duration, but reject as soon as the request is aborted.
 *
 * @param {number} duration - Time to wait in milliseconds
 * @param {AbortSignal} [signal] - Signal used to abort the request
 * @return {Promise<void>}
 */
function wait(duration, signal) {
	if (signal?.aborted) {
		return Promise.reject(signal.reason)
	}

	const { promise, resolve, reject } = Promise.withResolvers()
	const onAbort = () => reject(signal.reason)

	const timeout = setTimeout(resolve, duration)
	signal?.addEventListener('abort', onAbort, { once: true })

	return promise.finally(() => {
		clearTimeout(timeout)
		signal?.removeEventListener('abort', onAbort)
	})
}
