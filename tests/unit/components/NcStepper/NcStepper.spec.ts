/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { NcStepperStep } from '../../../../src/components/NcStepper/NcStepper.vue'

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
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
})
