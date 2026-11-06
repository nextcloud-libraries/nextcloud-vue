/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import NcActionButton from '../../../../src/components/NcActionButton/NcActionButton.vue'
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

	it('marks the crumb while something is dragged over it', async () => {
		const wrapper = mount(NcBreadcrumb, { props: { name: 'Folder', href: '/folder' } })
		const crumb = wrapper.get('li')
		await crumb.trigger('dragenter')
		expect(crumb.classes()).toContain('vue-crumb--hovered')
		expect(wrapper.emitted('dragenter')).toHaveLength(1)

		// Moving onto a child of the crumb keeps the mark
		await crumb.trigger('dragleave', { relatedTarget: crumb.get('a').element })
		expect(crumb.classes()).toContain('vue-crumb--hovered')

		await crumb.trigger('dragleave', { relatedTarget: document.body })
		expect(crumb.classes()).not.toContain('vue-crumb--hovered')
		expect(wrapper.emitted('dragleave')).toHaveLength(2)
	})

	it('does not mark a crumb with disable-drop while something is dragged over it', async () => {
		const wrapper = mount(NcBreadcrumb, { props: { name: 'Folder', href: '/folder', disableDrop: true } })
		const crumb = wrapper.get('li')
		await crumb.trigger('dragenter')
		expect(crumb.classes()).not.toContain('vue-crumb--hovered')
		await crumb.trigger('dragleave', { relatedTarget: document.body })
		expect(wrapper.emitted('dragleave')).toHaveLength(1)
	})

	it('emits dropped with its link and removes the mark', async () => {
		const wrapper = mount(NcBreadcrumb, { props: { name: 'Folder', href: '/folder' } })
		const crumb = wrapper.get('li')
		await crumb.trigger('dragenter')
		await crumb.trigger('drop')
		expect(wrapper.emitted('dropped')?.[0][1]).toBe('/folder')
		expect(crumb.classes()).not.toContain('vue-crumb--hovered')
	})

	it('shows the actions of the default slot in a menu and emits when it opens', async () => {
		const wrapper = mount(NcBreadcrumb, {
			props: { name: 'Folder', forceMenu: true },
			slots: { default: () => h(NcActionButton, null, () => 'Rename') },
			attachTo: document.body,
		})
		await wrapper.get('button').trigger('click')
		expect(wrapper.emitted('update:open')?.[0]).toEqual([true])
		wrapper.unmount()
	})
})
