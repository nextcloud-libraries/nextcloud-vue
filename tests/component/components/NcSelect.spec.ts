/**
 * SPDX-FileCopyrightText: Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import NcSelect from '../../../src/components/NcSelect/NcSelect.vue'

/**
 * Previously due to NcEllipsedOption long option names
 * were shown as "Verylongo ptionname" due to whitespace between <span> elements.
 */
test('Options have proper accessible names', async ({ mount, page }) => {
	const component = await mount(NcSelect, {
		props: {
			options: ['Short', 'Verylongoptionnamethatlikelyoverflows'],
		},
	})

	await expect(component.getByRole('combobox')).toBeVisible()
	await component.getByRole('combobox').fill('Very')

	console.error(await page.getByRole('option', { name: /Veryl/ }).innerHTML())
	await expect(page.getByRole('option', { name: 'Verylongoptionnamethatlikelyoverflows' })).toBeVisible()
})
