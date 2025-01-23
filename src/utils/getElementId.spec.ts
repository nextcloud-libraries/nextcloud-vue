/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { beforeEach, describe, expect, test, vi } from 'vitest'
import { getElementId } from './getElementId.ts'

const vue = vi.hoisted(() => ({ useId: vi.fn() }))
vi.mock('vue', () => vue)

describe('getElementId', () => {

	beforeEach(() => vue.useId.mockReset())

	test('getting an id', () => {
		vue.useId.mockImplementationOnce(() => 'vueid')
		const id = getElementId()
		expect(id).toEqual('nextcloud-vue-vueid')
	})

	test('getting multiple ids', () => {
		let index = 0
		vue.useId.mockImplementation(() => index++)

		const id = getElementId()
		const id2 = getElementId()
		expect(id).not.toEqual(id2)
		expect(vue.useId).toBeCalledTimes(2)
	})

})
