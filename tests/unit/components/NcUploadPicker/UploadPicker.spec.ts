/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Folder, Permission } from '@nextcloud/files'
import { generateRemoteUrl } from '@nextcloud/router'
import { cleanup, render } from '@testing-library/vue'
import { afterEach, beforeAll, expect, test, vi } from 'vitest'
import NcUploadPicker from '../../../../src/components/NcUploadPicker/NcUploadPicker.vue'

const openConflictPicker = vi.hoisted(() => vi.fn())
vi.mock('@nextcloud/dialogs', () => ({ openConflictPicker }))

beforeAll(() => {
	document.head.dataset.user = 'test'
})

afterEach(() => cleanup())

test('UploadPicker: renders', async () => {
	const props = {
		destination: new Folder({
			id: 56,
			owner: 'user',
			source: generateRemoteUrl('dav/files/user/Folder'),
			permissions: Permission.ALL,
			root: '/files/user',
		}),
		content: async () => [],
	}

	const component = render(NcUploadPicker, { props })
	expect(component.getByRole('button', { name: 'New' })).toBeInstanceOf(HTMLElement)
})
