/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import NcNoteCard from '../../../src/components/NcNoteCard/NcNoteCard.vue'

test('keeps the same space around a button as around the text', async ({ mount }) => {
	const card = await mount(NcNoteCard, {
		props: { type: 'neutral', text: 'You are editing this.', style: 'width: 500px' },
		slots: { actions: '<button type="button" style="height: var(--default-clickable-area); margin: 0">Unlock</button>' },
	})
	const [box, button] = await Promise.all([card.boundingBox(), card.getByRole('button').boundingBox()])
	const padding = await card.evaluate((element) => parseFloat(getComputedStyle(element).paddingInlineEnd))
	expect(button!.y - box!.y).toBeCloseTo(padding, 0)
	expect(box!.y + box!.height - (button!.y + button!.height)).toBeCloseTo(padding, 0)
	expect(box!.x + box!.width - (button!.x + button!.width)).toBeCloseTo(padding, 0)
})

test('centers the text on the button', async ({ mount }) => {
	const card = await mount(NcNoteCard, {
		props: { type: 'neutral', text: 'You are editing this.', style: 'width: 500px' },
		slots: { actions: '<button type="button" style="height: var(--default-clickable-area); margin: 0">Unlock</button>' },
	})
	const [text, button] = await Promise.all([card.getByText('You are editing this.').boundingBox(), card.getByRole('button').boundingBox()])
	expect(text!.y + text!.height / 2).toBeCloseTo(button!.y + button!.height / 2, 0)
})
