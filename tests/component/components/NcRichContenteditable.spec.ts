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
	await expect(page.getByRole('textbox')).toHaveAttribute('aria-placeholder', 'Write a message …')
})

test('Placeholder is correctly translated', async ({ mount, page }) => {
	await page.addScriptTag({ content: 'document.documentElement.lang = "de";' })

	await mount(NcRichContenteditable, {
		props: {
			modelValue: '',
		},
	})

	await expect(page.getByRole('textbox')).toBeVisible()
	await expect(page.getByRole('textbox')).toHaveAttribute('aria-placeholder', 'Nachricht schreiben …')
})

test('Paste, undo, redo events works as expected from input', async ({ mount, page }) => {
	await mount(NcRichContenteditable, {
		props: {
			modelValue: '',
		},
	})

	const editor = page.getByRole('textbox')
	await editor.focus()

	// Manually type the 'hello ', paste 'world' from clipboard, type '!'
	await page.keyboard.type('hello ')
	await page.evaluate(() => navigator.clipboard.writeText('world'))
	await page.keyboard.press('Control+V')
	await page.keyboard.type('!')

	await expect(editor).toHaveText('hello world!')

	// Undo operations and ensure the correct order on it
	await page.keyboard.press('Control+Z')
	await expect(editor).toHaveText('hello world')
	await page.keyboard.press('Control+Z')
	await expect(editor).toHaveText('hello ')
	await page.keyboard.press('Control+Y')
	await expect(editor).toHaveText('hello world')
})
