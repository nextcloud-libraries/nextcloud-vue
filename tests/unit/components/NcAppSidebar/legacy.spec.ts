/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { expect, test, vi } from 'vitest'
import { nextTick } from 'vue'
import NcAppSidebarTabs from '../../../../src/components/NcAppSidebar/NcAppSidebarTabs.vue'
import NcAppSidebarTab from '../../../../src/components/NcAppSidebarTab/NcAppSidebarTab.vue'

vi.mock('../../../../src/utils/legacy.ts', () => ({ isLegacy: false, isLegacy34: true }))

/**
 * Mount the tabs with two child tabs so the tab navigation is rendered.
 */
function mountTabs() {
	return mount(NcAppSidebarTabs, {
		slots: {
			default: [
				'<NcAppSidebarTab id="first" name="Tab1">Tab1</NcAppSidebarTab>',
				'<NcAppSidebarTab id="second" name="Tab2">Tab2</NcAppSidebarTab>',
			].join(''),
		},
		global: {
			components: { NcAppSidebarTab },
		},
	})
}

test('the sliding highlight is not rendered on Nextcloud < 34', async () => {
	const wrapper = mountTabs()
	await nextTick()

	// The legacy tab design keeps its own look, so the moving highlight is off
	expect(wrapper.find('.app-sidebar-tabs__nav--legacy').exists()).toBe(true)
	expect(wrapper.find('.app-sidebar-tabs__highlight').exists()).toBe(false)
})

test('hovering a tab does not create a highlight on Nextcloud < 34', async () => {
	const wrapper = mountTabs()
	await nextTick()

	await wrapper.find('[role="tab"]').trigger('pointerover')
	await nextTick()

	expect(wrapper.find('.app-sidebar-tabs__highlight').exists()).toBe(false)
})
