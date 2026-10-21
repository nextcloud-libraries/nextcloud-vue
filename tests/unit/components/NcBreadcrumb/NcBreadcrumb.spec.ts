/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import NcBreadcrumb from '../../../../src/components/NcBreadcrumb/NcBreadcrumb.vue'

describe('NcBreadcrumb', () => {
	it('shows that a crumb with disable-drop does not accept a drop', async () => {
		const wrapper = mount(NcBreadcrumb, { props: { name: 'Folder', href: '/folder', disableDrop: true } })
		const dataTransfer = { dropEffect: 'move' }
		await wrapper.get('li').trigger('dragover', { dataTransfer })
		expect(dataTransfer.dropEffect).toBe('none')
	})

	it('leaves the drop effect of a crumb that accepts a drop alone', async () => {
		const wrapper = mount(NcBreadcrumb, { props: { name: 'Folder', href: '/folder' } })
		const dataTransfer = { dropEffect: 'move' }
		await wrapper.get('li').trigger('dragover', { dataTransfer })
		expect(dataTransfer.dropEffect).toBe('move')
	})
})
