/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { subscribe, unsubscribe } from '@nextcloud/event-bus'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import NcAppNavigationItem from '../../../../src/components/NcAppNavigationItem/NcAppNavigationItem.vue'
import { resizeWindowWidth } from '../../testing-utils.ts'

describe('NcAppNavigationItem.vue', () => {
	describe('router-link navigation on mobile', () => {
		it('closes the app navigation after navigating', async () => {
			await resizeWindowWidth(500)
			const wrapper = mount(NcAppNavigationItem, { props: { name: 'Item' } })
			const handler = vi.fn()
			subscribe('toggle-navigation', handler)

			wrapper.vm.onClick(new MouseEvent('click'), vi.fn(), '/href')

			expect(handler).toHaveBeenCalledWith({ open: false })
			unsubscribe('toggle-navigation', handler)
		})

		it('does not close the app navigation on desktop', async () => {
			await resizeWindowWidth(1024)
			const wrapper = mount(NcAppNavigationItem, { props: { name: 'Item' } })
			const handler = vi.fn()
			subscribe('toggle-navigation', handler)

			wrapper.vm.onClick(new MouseEvent('click'), vi.fn(), '/href')

			expect(handler).not.toHaveBeenCalled()
			unsubscribe('toggle-navigation', handler)
		})
	})
})
