/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { flushPromises, shallowMount } from '@vue/test-utils'
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'
import NcPopover from '../../../../src/components/NcPopover/NcPopover.vue'

describe('NcPopover afterShow and afterHide events', () => {
	let popoverContent: HTMLElement

	beforeAll(() => {
		// disable debug as this tries to access internals of floating-vue
		window.OC.debug = false
	})

	beforeEach(() => {
		popoverContent = document.createElement('div')
		vi.spyOn(NcPopover.methods!, 'getPopoverContentElement').mockImplementation(() => popoverContent)
		vi.spyOn(NcPopover.methods!, 'removeFloatingVueAriaDescribedBy').mockImplementation(() => {})
		vi.spyOn(NcPopover.methods!, 'useFocusTrap').mockResolvedValue(undefined)
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	/**
	 * Mount the popover and return the wrapper with its floating-vue dropdown stub.
	 */
	function mountPopover() {
		const wrapper = shallowMount(NcPopover, {
			slots: {
				default: 'popover content',
				trigger: '<button>trigger</button>',
			},
		})
		return { wrapper, dropdown: wrapper.getComponent({ name: 'Dropdown' }) }
	}

	/**
	 * Let the popover element run a transition the next time its animations are queried.
	 */
	function startTransition() {
		let finish!: () => void
		let cancel!: () => void
		const finished = new Promise<Animation>((resolve, reject) => {
			finish = () => resolve({} as Animation)
			cancel = () => reject(new DOMException('Transition cancelled', 'AbortError'))
		})
		popoverContent.getAnimations = vi.fn(() => [{ finished } as Animation])
		return { finish, cancel }
	}

	test('emits afterHide once the hide transition has ended', async () => {
		const { wrapper, dropdown } = mountPopover()
		const transition = startTransition()

		await dropdown.vm.$emit('applyHide')
		await flushPromises()
		expect(popoverContent.getAnimations).toHaveBeenCalledOnce()
		expect(wrapper.emitted('afterHide')).toBeUndefined()

		transition.finish()
		await flushPromises()
		expect(wrapper.emitted('afterHide')).toHaveLength(1)
	})

	test('emits afterHide once the hide transition was cancelled', async () => {
		const { wrapper, dropdown } = mountPopover()
		const transition = startTransition()

		await dropdown.vm.$emit('applyHide')
		transition.cancel()
		await flushPromises()
		expect(wrapper.emitted('afterHide')).toHaveLength(1)
	})

	test('emits afterShow and afterHide without a transition', async () => {
		const { wrapper, dropdown } = mountPopover()
		popoverContent.getAnimations = () => []

		await dropdown.vm.$emit('applyShow')
		await flushPromises()
		expect(wrapper.emitted('afterShow')).toHaveLength(1)

		await dropdown.vm.$emit('applyHide')
		await flushPromises()
		expect(wrapper.emitted('afterHide')).toHaveLength(1)
	})

	test('does not emit afterHide once shown again before the hide transition ended', async () => {
		const { wrapper, dropdown } = mountPopover()
		const transition = startTransition()

		await dropdown.vm.$emit('applyHide')
		// floating-vue requests the show right away but applies it only after a delay and positioning
		await dropdown.vm.$emit('update:shown', true)

		transition.finish()
		await flushPromises()
		expect(wrapper.emitted('afterHide')).toBeUndefined()
	})

	test('does not emit afterShow once hidden again before the show transition ended', async () => {
		const { wrapper, dropdown } = mountPopover()
		const transition = startTransition()

		await dropdown.vm.$emit('update:shown', true)
		await dropdown.vm.$emit('applyShow')
		await dropdown.vm.$emit('update:shown', false)

		transition.cancel()
		await flushPromises()
		expect(wrapper.emitted('afterShow')).toBeUndefined()
	})

	test('does not emit afterHide of a previous hide once shown', async () => {
		const { wrapper, dropdown } = mountPopover()
		const hideTransition = startTransition()

		await dropdown.vm.$emit('applyHide')
		await flushPromises()
		const showTransition = startTransition()
		await dropdown.vm.$emit('applyShow')
		await flushPromises()

		hideTransition.cancel()
		showTransition.finish()
		await flushPromises()
		expect(wrapper.emitted('afterShow')).toHaveLength(1)
		expect(wrapper.emitted('afterHide')).toBeUndefined()
	})

	test('does not emit afterHide after unmounting', async () => {
		const { wrapper, dropdown } = mountPopover()
		const transition = startTransition()

		await dropdown.vm.$emit('applyHide')
		await flushPromises()
		const emitted = wrapper.emitted()
		wrapper.unmount()

		transition.finish()
		await flushPromises()
		expect(emitted.afterHide).toBeUndefined()
	})
})
