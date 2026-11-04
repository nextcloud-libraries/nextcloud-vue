/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { NcStepperStep } from '../../../../src/components/NcStepper/NcStepper.vue'

import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import NcStepper from '../../../../src/components/NcStepper/NcStepper.vue'

const steps: NcStepperStep[] = [
	{ id: 'name', label: 'Name' },
	{ id: 'details', label: 'Details', description: 'About the team' },
	{ id: 'members', label: 'Members' },
]

/**
 * Mount the stepper with a working v-model.
 *
 * @param modelValue - The id of the current step
 * @param props - More props
 */
function mountStepper(modelValue?: string, props: Record<string, unknown> = {}) {
	const wrapper = mount(NcStepper, {
		props: {
			steps,
			modelValue,
			'onUpdate:modelValue': (id: unknown) => wrapper.setProps({ modelValue: id as string }),
			...props,
		},
	})
	return wrapper
}

describe('NcStepper', () => {
	it('renders a labeled ordered list with an item per step', () => {
		const wrapper = mountStepper('details', { ariaLabel: 'Create a team' })
		expect(wrapper.element.tagName).toBe('OL')
		expect(wrapper.attributes('aria-label')).toBe('Create a team')
		expect(wrapper.findAll('li')).toHaveLength(3)
	})

	it('has a default name for the list', () => {
		const wrapper = mountStepper('details')
		expect(wrapper.attributes('aria-label')).toBe('Steps')
	})

	it('marks the current step and announces the completed ones', () => {
		const wrapper = mountStepper('details')
		const items = wrapper.findAll('li')
		expect(items.map((item) => item.attributes('aria-current'))).toEqual([undefined, 'step', undefined])
		expect(items[0].get('.hidden-visually').text()).toBe('Completed')
		expect(items[1].find('.hidden-visually').exists()).toBe(false)
		expect(items[2].find('.hidden-visually').exists()).toBe(false)
	})

	it('shows a check for completed steps and the number for the others', () => {
		const wrapper = mountStepper('details')
		const items = wrapper.findAll('li')
		expect(items[0].find('svg').exists()).toBe(true)
		expect(items[1].find('[aria-hidden="true"]').text()).toBe('2')
		expect(items[2].find('[aria-hidden="true"]').text()).toBe('3')
	})

	it('makes the first step the current one when the model does not match a step', () => {
		const wrapper = mountStepper('unknown')
		expect(wrapper.findAll('li')[0].attributes('aria-current')).toBe('step')
		expect(wrapper.find('.hidden-visually').exists()).toBe(false)
	})

	it('has no buttons without allowGoBack', () => {
		const wrapper = mountStepper('members')
		expect(wrapper.find('button').exists()).toBe(false)
	})

	it('lets the user go back to a completed step with allowGoBack', async () => {
		const wrapper = mountStepper('members', { allowGoBack: true })
		const buttons = wrapper.findAll('button')
		// Only the completed steps
		expect(buttons.map((button) => button.text())).toEqual(['Name Completed', 'Details Completed'])

		await buttons[0].trigger('click')
		expect(wrapper.emitted('update:modelValue')).toEqual([['name']])
		expect(wrapper.findAll('li')[0].attributes('aria-current')).toBe('step')
		expect(wrapper.find('button').exists()).toBe(false)
	})

	it('shows the description only in the vertical orientation', () => {
		const horizontal = mountStepper('details')
		expect(horizontal.text()).not.toContain('About the team')

		const vertical = mountStepper('details', { orientation: 'vertical' })
		expect(vertical.text()).toContain('About the team')
		expect(vertical.classes().some((name) => name.includes('ncStepper_vertical'))).toBe(true)
	})

	it('does nothing when a step that cannot be gone back to is clicked', async () => {
		const wrapper = mountStepper('details', { allowGoBack: true })
		// The upcoming step is not a button, but it still has the click listener
		await wrapper.findAll('li')[2].get('div').trigger('click')
		expect(wrapper.emitted('update:modelValue')).toBeUndefined()
	})

	describe('in a row that scrolls', () => {
		afterEach(() => {
			vi.restoreAllMocks()
		})

		/**
		 * Lay the row out as 200px wide with steps of 150px each, so the steps do not fit.
		 *
		 * @param scrollWidth - The width of all steps together
		 */
		function fakeLayout(scrollWidth = 450) {
			vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockImplementation(function(this: HTMLElement) {
				return this.tagName === 'OL' ? scrollWidth : 0
			})
			vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(function(this: HTMLElement) {
				return this.tagName === 'OL' ? 200 : 0
			})
			vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function(this: HTMLElement) {
				if (this.tagName === 'OL') {
					return DOMRect.fromRect({ x: 0, y: 0, width: 200, height: 50 })
				}
				const index = [...this.parentElement!.children].indexOf(this)
				const scrollLeft = (this.parentElement as HTMLElement).scrollLeft
				return DOMRect.fromRect({ x: index * 150 - scrollLeft, y: 0, width: 150, height: 50 })
			})
		}

		it('scrolls the current step to the middle when it is out of view', async () => {
			fakeLayout()
			const wrapper = mountStepper('name')
			expect(wrapper.element.scrollLeft).toBe(0)

			await wrapper.setProps({ modelValue: 'members' })
			// The last step, at 300 to 450, has its middle at 375; the middle of the row is at 100
			expect(wrapper.element.scrollLeft).toBe(275)
		})

		it('leaves the row alone when the current step is in view', async () => {
			fakeLayout()
			const wrapper = mountStepper('name')
			await wrapper.setProps({ modelValue: 'name' })
			expect(wrapper.element.scrollLeft).toBe(0)
		})

		it('leaves a row alone that fits', async () => {
			fakeLayout(200)
			const wrapper = mountStepper('name')
			await wrapper.setProps({ modelValue: 'members' })
			expect(wrapper.element.scrollLeft).toBe(0)
		})
	})
})
