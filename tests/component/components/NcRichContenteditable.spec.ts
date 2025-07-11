/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import NcRichContenteditable from '../../../src/components/NcRichContenteditable/NcRichContenteditable.vue'

test('Placeholder is set', async ({ mount, page }) => {
	await mount(NcRichContenteditable, {
		props: {
			modelValue: '',
		},
	})

	await expect(page.getByRole('textbox')).toBeVisible()
	await expect(page.getByRole('textbox')).toHaveAttribute('aria-placeholder', 'Write a message …')
})

test('Placeholder is correctly translated', async ({ mount, page }) => {
	await page.addScriptTag({ content: 'document.documentElement.lang = "de";' })

	await mount(NcRichContenteditable, {
		props: {
			modelValue: '',
		},
	})

	await expect(page.getByRole('textbox')).toBeVisible()
	await expect(page.getByRole('textbox')).toHaveAttribute('aria-placeholder', 'Nachricht schreiben …')
})
