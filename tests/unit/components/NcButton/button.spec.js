/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { shallowMount } from '@vue/test-utils'
import NcButton from '../../../../src/components/NcButton/NcButton.vue'

describe('NcButton', () => {
	describe('pressed', () => {
		it('has aria-pressed="true" when pressed', () => {
			const wrapper = shallowMount(NcButton, { propsData: { ariaLabel: 'button', pressed: true } })
			const button = wrapper.find('button')
			expect(button.attributes('aria-pressed')).toBe('true')
		})

		it('has aria-pressed="false" when not pressed', () => {
			const wrapper = shallowMount(NcButton, { propsData: { ariaLabel: 'button', pressed: false } })
			const button = wrapper.find('button')
			expect(button.attributes('aria-pressed')).toBe('false')
		})

		it('has no aria-pressed when pressed is not specified', () => {
			const wrapper = shallowMount(NcButton, { propsData: { ariaLabel: 'button' } })
			const button = wrapper.find('button')
			expect(button.attributes('aria-pressed')).not.toBeDefined()
		})

		it('has no aria-pressed when pressed is null', () => {
			const wrapper = shallowMount(NcButton, { propsData: { ariaLabel: 'button', pressed: null } })
			const button = wrapper.find('button')
			expect(button.attributes('aria-pressed')).not.toBeDefined()
		})

		it('has no aria-pressed for a link', () => {
			const wrapper = shallowMount(NcButton, { propsData: { ariaLabel: 'button', pressed: true, href: 'http://example.com' } })
			const button = wrapper.find('a')
			expect(button.attributes('aria-pressed')).not.toBeDefined()
		})

		it('toggles pressed on pressed update', async () => {
			const wrapper = shallowMount(NcButton, { propsData: { ariaLabel: 'button', pressed: true } })
			await wrapper.setProps({ pressed: false })
			expect(wrapper.find('button').attributes('aria-pressed')).toBe('false')
		})

		it('emits update:pressed on press with a new pressed state', () => {
			const wrapper = shallowMount(NcButton, { propsData: { ariaLabel: 'button', pressed: true } })
			wrapper.find('button').trigger('click')
			expect(wrapper.emitted('update:pressed')?.length).toBe(1)
			expect(wrapper.emitted('update:pressed')[0]).toEqual([false])
		})

		it('does not emit update:pressed on press when pressed is not specified', async () => {
			const wrapper = shallowMount(NcButton, { propsData: { ariaLabel: 'button' } })
			wrapper.find('button').trigger('click')
			expect(wrapper.emitted('update:pressed')).toBe(undefined)
		})

		it('does not emit update:pressed on press for a link', async () => {
			const wrapper = shallowMount(NcButton, { propsData: { ariaLabel: 'button', pressed: true, href: 'http://example.com' } })
			wrapper.find('a').trigger('click')
			expect(wrapper.emitted('update:pressed')).toBe(undefined)
		})
	})
})
