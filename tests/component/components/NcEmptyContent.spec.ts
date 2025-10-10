/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import NcEmptyContent from '../../../src/components/NcEmptyContent/NcEmptyContent.vue'

test('accessible label is set from props', async ({ mount, page }) => {
	await mount(NcEmptyContent, {
		props: {
			name: 'note name',
		},
	})

	await expect(page.getByRole('note', { name: 'note name' })).toBeVisible()
})

test('accessible label is set from slots', async ({ mount, page }) => {
	await mount(NcEmptyContent, {
		slots: {
			name: 'slot note name',
		},
	})

	await expect(page.getByRole('note', { name: 'slot note name' })).toBeVisible()
})
