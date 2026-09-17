/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import NcEllipsisedOptionStory from './NcEllipsisedOption.story.vue'

test.describe('NcEllipsisedOption visual', { tag: '@visual' }, () => {
	// Visual tests only run on chromium
	test.skip(({ browserName }) => browserName !== 'chromium')

	test('truncates long names while keeping the suffix visible', async ({ mount }) => {
		const component = await mount(NcEllipsisedOptionStory, {
			props: {
				name: 'row with a very very very laaaaaaaaaaarge nameeeeee2',
			},
		})

		await expect(component).toHaveScreenshot()
	})
})
