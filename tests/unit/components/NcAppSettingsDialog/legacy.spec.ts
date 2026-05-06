/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { expect, test, vi } from 'vitest'
import { nextTick } from 'vue'
import NcAppSettingsDialog from '../../../../src/components/NcAppSettingsDialog/NcAppSettingsDialog.vue'
import { resizeWindowWidth } from '../../testing-utils.ts'

vi.mock('../../../../src/utils/legacy.ts', () => ({ isLegacy: false, isLegacy34: false }))

test('NcAppSettingsDialog renders title in navigation column on Nextcloud >= 34', async () => {
	await resizeWindowWidth(1024)

	const wrapper = mount(NcAppSettingsDialog, {
		props: {
			open: true,
			showNavigation: true,
			name: 'My settings',
		},
		global: {
			stubs: { teleport: true },
		},
	})
	await nextTick()

	expect(wrapper.find('.app-settings--legacy').exists()).toBe(false)
	expect(wrapper.find('.app-settings__title').text()).toBe('My settings')
})
