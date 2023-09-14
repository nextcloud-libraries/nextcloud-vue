import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import isSlotPopulated from '../../../src/utils/isSlotPopulated'
import { describe, expect, it } from '@jest/globals'

const IsSlotPopulatedTest = {
	name: 'IsSlotPopulatedTest',
	template: '<div><slot /></div>',
	computed : {
		isDefaultPopulated() {
			return isSlotPopulated(this.$slots.default?.())
		},
	},
}

describe('isSlotPopulated.js', () => {
	it('is not populated when a slot contains an empty array', () => {
		const wrapper = mount(IsSlotPopulatedTest, {
			slots: {
				default: [],
			},
		})
		expect(wrapper.vm.isDefaultPopulated).toBe(false)
	})
	it('is not populated when a slot with an empty string', () => {
		const wrapper = mount(IsSlotPopulatedTest, {
			slots: {
				default: '',
			},
		})
		expect(wrapper.vm.isDefaultPopulated).toBe(false)
	})
	it('is populated when a slot contains a string', () => {
		const wrapper = mount(IsSlotPopulatedTest, {
			slots: {
				default: 'Test',
			},
		})
		expect(wrapper.vm.isDefaultPopulated).toBe(true)
	})
	it('is not populated when a slot contains a string with whitespace only', () => {
		const wrapper = mount(IsSlotPopulatedTest, {
			slots: {
				default: '           ',
			},
		})
		expect(wrapper.vm.isDefaultPopulated).toBe(false)
	})
	it('is populated when a slot contains an array containing a string', () => {
		const wrapper = mount(IsSlotPopulatedTest, {
			slots: {
				default: ['Test'],
			},
		})
		expect(wrapper.vm.isDefaultPopulated).toBe(true)
	})
	it('is populated when a slot contains a comment and a text', () => {
		const wrapper = mount(IsSlotPopulatedTest, {
			slots: {
				default: '<!-- Commment -->Test',
			},
		})
		expect(wrapper.vm.isDefaultPopulated).toBe(true)
	})
	it('is not populated when a slot contains a comment only', () => {
		const wrapper = mount(IsSlotPopulatedTest, {
			slots: {
				default: '<!-- Commment -->',
			},
		})
		expect(wrapper.vm.isDefaultPopulated).toBe(false)
	})
})