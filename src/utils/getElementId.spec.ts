/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { beforeEach, describe, expect, test, vi } from 'vitest'

const md5 = vi.hoisted(() => vi.fn())
vi.mock('md5', () => ({ default: md5 }))

describe('getElementId', () => {

	beforeEach(() => {
		md5.mockReset()
		vi.resetModules()
	})

	test('getting an id', async () => {
		md5.mockImplementationOnce(() => 'hash')
		const { getElementId } = await import('./getElementId.ts')

		const id = getElementId()
		expect(id).toEqual('nchash-0')
		expect(md5).toHaveBeenCalledTimes(1)
	})

	test('getting multiple ids', async () => {
		md5.mockImplementationOnce(() => 'hash')
		const { getElementId } = await import('./getElementId.ts')

		const id = getElementId()
		const id2 = getElementId()

		// only once call the hash
		expect(md5).toHaveBeenCalledTimes(1)
		// both ids are different
		expect(id).not.toEqual(id2)
	})

})
