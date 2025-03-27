/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import NcModal from '../../../../src/components/NcModal/NcModal.vue'

describe('NcModal', () => {
	it('closes on click outside without `noClose`', async () => {
		const wrapper = mount(NcModal, { props: { noClose: false, closeOnClickOutside: true, title: 'modal' } })
		expect(wrapper.html().includes('modal-wrapper')).toBe(true)

		expect(wrapper.emitted('update:show')).toBe(undefined)

		await wrapper.find('.modal-wrapper').trigger('mousedown')
		// One emit('update:show', false)
		expect(wrapper.emitted('update:show')).toEqual([[false]])
	})

	it('not closes on click outside when `noClose` is true', async () => {
		const wrapper = mount(NcModal, { props: { noClose: true, title: 'modal' } })
		expect(wrapper.html().includes('modal-wrapper')).toBe(true)

		expect(wrapper.emitted('update:show')).toBe(undefined)

		await wrapper.find('.modal-wrapper').trigger('mousedown')
		// One emit('update:show', false)
		expect(wrapper.emitted('update:show')).toEqual(undefined)
	})

	it('not closes on click outside when `noClose` is false but `closeOnClickOutside` is false', async () => {
		const wrapper = mount(NcModal, { props: { noClose: false, closeOnClickOutside: false, title: 'modal' } })
		expect(wrapper.html().includes('modal-wrapper')).toBe(true)

		expect(wrapper.emitted('update:show')).toBe(undefined)

		await wrapper.find('.modal-wrapper').trigger('mousedown')
		// One emit('update:show', false)
		expect(wrapper.emitted('update:show')).toEqual(undefined)
	})
})
