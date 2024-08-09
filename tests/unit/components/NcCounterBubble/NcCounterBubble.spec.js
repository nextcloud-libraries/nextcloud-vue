/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, it, expect } from '@jest/globals'
import { mount } from '@vue/test-utils'
import NcCounterBubble from '../../../../src/components/NcCounterBubble/NcCounterBubble.vue'

describe('NcCounterBubble', () => {
	describe('displaying count', () => {
		it('should render content', () => {
			const wrapper = mount(NcCounterBubble, { slots: { default: '314+' } })
			expect(wrapper.text()).toBe('314+')
		})

		it('should render count from prop', () => {
			const wrapper = mount(NcCounterBubble, { propsData: { count: 314 } })
			expect(wrapper.text()).toBe('314')
		})
	})

	describe('using limit', () => {
		it('should render count less than 999 as it is', () => {
			const wrapper = mount(NcCounterBubble, { propsData: { count: 999 } })
			expect(wrapper.text()).toBe('999')
		})

		it('should render count more than 999 as 999+ by default', () => {
			const wrapper = mount(NcCounterBubble, { propsData: { count: 1000 } })
			expect(wrapper.text()).toBe('999+')
		})

		it('should render count more than limit as limit+', () => {
			const wrapper = mount(NcCounterBubble, { propsData: { count: 10, limit: 9 } })
			expect(wrapper.text()).toBe('9+')
		})

		it('should render count without limit when limit is 0', () => {
			const wrapper = mount(NcCounterBubble, { propsData: { count: 10000000000, limit: 0 } })
			expect(wrapper.text()).toBe('10000000000')
		})
	})

	describe('with styling', () => {
		it('should not have any additional classes', () => {
			const wrapper = mount(NcCounterBubble)
			expect(wrapper.classes('counter-bubble__counter--highlighted')).toBeFalsy()
			expect(wrapper.classes('counter-bubble__counter--outlined')).toBeFalsy()
			expect(wrapper.classes('active')).toBeFalsy()
		})

		it('should have class "counter-bubble__counter--highlighted" when type="highlighted"', () => {
			const wrapper = mount(NcCounterBubble, { propsData: { type: 'highlighted' } })
			expect(wrapper.classes('counter-bubble__counter--highlighted')).toBeTruthy()
		})

		it('should have class "counter-bubble__counter--outlined" when type="outlined"', () => {
			const wrapper = mount(NcCounterBubble, { propsData: { type: 'outlined' } })
			expect(wrapper.classes('counter-bubble__counter--outlined')).toBeTruthy()
		})

		it('should have class "active" when active', () => {
			const wrapper = mount(NcCounterBubble, { propsData: { active: true } })
			expect(wrapper.classes('active')).toBeTruthy()
		})
	})
})
