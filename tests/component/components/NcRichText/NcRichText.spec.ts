/**
 * SPDX-FileCopyrightText: Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue';
import NcRichText from '../../../../src/components/NcRichText/NcRichText.vue'

test('XML-like text (escaped and unescaped)', async ({ mount }) => {
	const component = await mount(NcRichText, {
		props: {
			text: '<span>text&lt;/span&gt;',
			useMarkdown: true,
		},
	})

	await expect(component).toHaveText('<span>text</span>')
})
