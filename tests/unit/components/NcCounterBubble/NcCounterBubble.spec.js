/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, it, expect } from '@jest/globals'
import { mount } from '@vue/test-utils'
import NcCounterBubble from '../../../../src/components/NcCounterBubble/NcCounterBubble.vue'

describe('NcCounterBubble', () => {
	describe('displaying count', () => {
		it('should render count from prop', () => {
			const wrapper = mount(NcCounterBubble, { propsData: { count: 314 } })
			expect(wrapper.text()).toBe('314')
		})

		it('should render non-number content as it is', () => {
			const wrapper = mount(NcCounterBubble, { slots: { default: '14 rows' } })
			expect(wrapper.text()).toBe('14 rows')
		})
	})

	describe('with humanization', () => {
		it('should render count 1042 with humanization as "1K" and original count in the title', () => {
			const wrapper = mount(NcCounterBubble, { propsData: { count: 1042 } })
			expect(wrapper.text()).toBe('1K')
			expect(wrapper.attributes('title')).toBe('1042')
		})

		it('should render count 12 without humanization and without title', () => {
			const wrapper = mount(NcCounterBubble, { propsData: { count: 12 } })
			expect(wrapper.text()).toBe('12')
			expect(wrapper.attributes('title')).toBeUndefined()
		})

		it('should not humanize with raw', () => {
			const wrapper = mount(NcCounterBubble, { propsData: { count: 1042, raw: true } })
			expect(wrapper.text()).toBe('1042')
			expect(wrapper.attributes('title')).toBeUndefined()
		})

		it('should render slot content 1042 with humanization as "1K" and original count in the title', () => {
			const wrapper = mount(NcCounterBubble, { slots: { default: '1042' } })
			expect(wrapper.text()).toBe('1K')
			expect(wrapper.attributes('title')).toBe('1042')
		})

		it('should render slot content 1042 as it is with raw prop', () => {
			const wrapper = mount(NcCounterBubble, { propsData: { raw: true }, slots: { default: '1042' } })
			expect(wrapper.text()).toBe('1042')
			expect(wrapper.attributes('title')).toBeUndefined()
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
