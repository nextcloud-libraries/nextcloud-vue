/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import PQueue from 'p-queue'

const queue = new PQueue({ concurrency: 5 })

/**
 * Preload an image URL
 * @param url URL of the image
 */
export function preloadImage(url: string): Promise<boolean> {
	const { resolve, promise } = Promise.withResolvers<boolean>()
	queue.add(() => {
		const image = new Image()
		image.onerror = () => resolve(false)
		image.onload = () => resolve(true)
		image.src = url
		return promise
	})

	return promise
}
