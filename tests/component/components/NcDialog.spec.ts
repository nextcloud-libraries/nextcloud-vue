/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import NcDialog from '../../../src/components/NcDialog/NcDialog.vue'

test('Dialog is correctly labelled', async ({ mount, page }) => {
	await mount(NcDialog, {
		props: {
			open: true,
			name: 'My dialog',
		},
		slots: {
			default: 'Text',
		},
	})

	await expect(page.getByRole('dialog', { name: 'My dialog' })).toBeVisible()
})
