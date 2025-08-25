/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from '@jest/globals'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import NcDialogButton from '../../../../src/components/NcDialogButton/NcDialogButton.vue'

describe('NcDialogButton', () => {
	it.each([
		['reset'],
		['button'],
		['submit'],
	])('forwards the native type', async (nativeType: string) => {
		const wrapper = mount(NcDialogButton, {
			propsData: {
				label: 'button',
				nativeType,
			},
		})
		expect(wrapper.find('button').attributes('type')).toBe(nativeType)
	})

	it('handles click', async () => {
		const wrapper = mount(NcDialogButton, {
			propsData: {
				label: 'button',
			},
		})
		await wrapper.find('button').trigger('click')
		expect(wrapper.emitted('click')).toHaveLength(1)
		expect(wrapper.emitted('click')![0]).toHaveLength(2)
	})

	it('has mouse event as click payload', async () => {
		const wrapper = mount(NcDialogButton, {
			propsData: {
				label: 'button',
			},
		})
		const event = { id: 'my-event' }
		await wrapper.find('button').trigger('click', event)
		expect(wrapper.emitted('click')).toHaveLength(1)
		expect(wrapper.emitted('click')![0][0]).toMatchObject(event)
	})

	it('has callback response as second click event payload', async () => {
		const wrapper = mount(NcDialogButton, {
			propsData: {
				label: 'button',
				callback: () => 'payload',
			},
		})
		await wrapper.find('button').trigger('click')
		expect(wrapper.emitted('click')).toHaveLength(1)
		expect(wrapper.emitted('click')![0][1]).toBe('payload')
	})

	it('callback defaults to undefined', async () => {
		const wrapper = mount(NcDialogButton, {
			propsData: {
				label: 'button',
			},
		})
		await wrapper.find('button').trigger('click')
		expect(wrapper.emitted('click')).toHaveLength(1)
		expect(wrapper.emitted('click')![0]).toHaveLength(2)
		expect(wrapper.emitted('click')![0][1]).toBeUndefined()
	})

	it('reset-button callback defaults to false', async () => {
		const wrapper = mount(NcDialogButton, {
			propsData: {
				label: 'button',
				nativeType: 'reset',
			},
		})
		await wrapper.find('button').trigger('click')
		expect(wrapper.emitted('click')).toBe(undefined)
	})

	it('reset-button with callback emits click', async () => {
		const wrapper = mount(NcDialogButton, {
			propsData: {
				label: 'button',
				nativeType: 'reset',
				callback: () => true,
			},
		})
		await wrapper.find('button').trigger('click')
		expect(wrapper.emitted('click')).toHaveLength(1)
	})

	it('has a loading state while the callback is awaited', async () => {
		const { promise, resolve } = Promise.withResolvers<void>()
		const wrapper = mount(NcDialogButton, {
			propsData: {
				label: 'button',
				callback: () => promise,
			},
		})
		// click the button
		const button = wrapper.find('button')
		await button.trigger('click')
		// no event because it is still resolving
		expect(wrapper.emitted('click')).toBeUndefined()
		// see there is the loading indicator
		expect(button.find('[aria-label="Loading …"]').exists()).toBe(true)
		// resolve the callbacl
		resolve()
		await nextTick()
		// see there is the event now
		expect(wrapper.emitted('click')).toHaveLength(1)
		// and the loading indicator is gone
		// see there is the loading indicator
		expect(button.find('[aria-label="Loading …"]').exists()).toBe(false)
	})
})
