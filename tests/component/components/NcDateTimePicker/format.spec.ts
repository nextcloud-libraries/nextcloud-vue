/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import FormattingSnapshotStory from './FormattingSnapshot.story.vue'

// Snapshots testing of formatting for all possible locales.
//
// Part of "test:component" because tested code relies on `Intl.DateTime`,
// which is browser dependend.
//
// One big snapshot test to not infalte number of test cases.
// This keeps reporting clean and runs faster.
test('all locales format', async ({ mount }) => {
	const component = await mount(FormattingSnapshotStory)

	const snapshotString = await component.innerText()

	expect(snapshotString).toMatchSnapshot()
})
