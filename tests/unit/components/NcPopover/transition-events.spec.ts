/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { shallowMount } from '@vue/test-utils'
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
		popoverContent.appendChild(document.createElement('button'))
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
	 * Fire a `transitionend` event on the element, bubbling like a real one.
	 *
	 * @param element - The element whose transition ended
	 */
	function endTransition(element: Element) {
		element.dispatchEvent(new Event('transitionend', { bubbles: true }))
	}

	test('emits afterHide once the hide transition has ended', async () => {
		const { wrapper, dropdown } = mountPopover()

		await dropdown.vm.$emit('applyHide')
		expect(wrapper.emitted('afterHide')).toBeUndefined()

		endTransition(popoverContent)
		expect(wrapper.emitted('afterHide')).toHaveLength(1)

		endTransition(popoverContent)
		expect(wrapper.emitted('afterHide')).toHaveLength(1)
	})

	test('ignores transitions of the popover content', async () => {
		const { wrapper, dropdown } = mountPopover()

		await dropdown.vm.$emit('applyShow')
		endTransition(popoverContent.firstElementChild!)
		expect(wrapper.emitted('afterShow')).toBeUndefined()

		endTransition(popoverContent)
		expect(wrapper.emitted('afterShow')).toHaveLength(1)
	})

	test('does not emit afterHide once shown again before the hide transition ended', async () => {
		const { wrapper, dropdown } = mountPopover()

		await dropdown.vm.$emit('applyHide')
		// floating-vue requests the show right away but applies it only after a delay and positioning
		await dropdown.vm.$emit('update:shown', true)

		endTransition(popoverContent)
		expect(wrapper.emitted('afterHide')).toBeUndefined()
	})

	test('does not emit afterShow once hidden again before the show transition ended', async () => {
		const { wrapper, dropdown } = mountPopover()

		await dropdown.vm.$emit('update:shown', true)
		await dropdown.vm.$emit('applyShow')
		await dropdown.vm.$emit('update:shown', false)

		endTransition(popoverContent)
		expect(wrapper.emitted('afterShow')).toBeUndefined()
	})

	test('does not emit afterHide after unmounting', async () => {
		const { wrapper, dropdown } = mountPopover()

		await dropdown.vm.$emit('applyHide')
		const emitted = wrapper.emitted()
		wrapper.unmount()

		endTransition(popoverContent)
		expect(emitted.afterHide).toBeUndefined()
	})

	test('does not emit afterHide of a hide transition that never ended once shown again', async () => {
		const { wrapper, dropdown } = mountPopover()

		// The hide transition is cancelled, so no transitionend follows
		await dropdown.vm.$emit('applyHide')
		await dropdown.vm.$emit('applyShow')

		endTransition(popoverContent)
		expect(wrapper.emitted('afterShow')).toHaveLength(1)
		expect(wrapper.emitted('afterHide')).toBeUndefined()
	})
})
