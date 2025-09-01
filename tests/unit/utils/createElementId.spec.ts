/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { beforeEach, describe, expect, jest, test } from '@jest/globals'

describe('createElementId', () => {
	beforeEach(() => {
		delete window._nc_vue_element_id
		jest.resetModules()
	})

	test('getting an id', async () => {
		const { createElementId } = await import('../../../src/utils/createElementId.ts')

		const id = createElementId()
		expect(id).toEqual('nc-vue-0')
	})

	test('getting an id when already initialized', async () => {
		window._nc_vue_element_id = 5
		const { createElementId } = await import('../../../src/utils/createElementId.ts')

		const id = createElementId()
		expect(id).toEqual('nc-vue-5')
	})

	test('getting multiple ids', async () => {
		const { createElementId } = await import('../../../src/utils/createElementId.ts')

		const id = createElementId()
		const id2 = createElementId()

		expect(id).toBe('nc-vue-0')
		expect(id2).toBe('nc-vue-1')
	})
})
