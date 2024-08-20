/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NcCounterBubble from '../../../../src/components/NcCounterBubble/NcCounterBubble.vue'

describe('NcCounterBubble', () => {
	describe('displaying count', () => {
		it('should render count from prop', () => {
			const wrapper = mount(NcCounterBubble, { props: { count: 314 } })
			expect(wrapper.text()).toBe('314')
		})
	})

	describe('with humanization', () => {
		it('should render count 1020 with humanization as "1K"', () => {
			const wrapper = mount(NcCounterBubble, { props: { count: 1042 } })
			expect(wrapper.text()).toBe('1K')
		})

		it('should not humanize with raw', () => {
			const wrapper = mount(NcCounterBubble, { props: { count: 1042, raw: true } })
			expect(wrapper.text()).toBe('1042')
		})
	})

	describe('with styling', () => {
		it('should not have any additional classes', () => {
			const wrapper = mount(NcCounterBubble, { props: { count: 0 } })
			expect(wrapper.classes('counter-bubble__counter--highlighted')).toBeFalsy()
			expect(wrapper.classes('counter-bubble__counter--outlined')).toBeFalsy()
			expect(wrapper.classes('active')).toBeFalsy()
		})

		it('should have class "counter-bubble__counter--highlighted" when type="highlighted"', () => {
			const wrapper = mount(NcCounterBubble, { props: { count: 0, type: 'highlighted' } })
			expect(wrapper.classes('counter-bubble__counter--highlighted')).toBeTruthy()
		})

		it('should have class "counter-bubble__counter--outlined" when type="outlined"', () => {
			const wrapper = mount(NcCounterBubble, { props: { count: 0, type: 'outlined' } })
			expect(wrapper.classes('counter-bubble__counter--outlined')).toBeTruthy()
		})

		it('should have class "active" when active', () => {
			const wrapper = mount(NcCounterBubble, { props: { count: 0, active: true }, attachTo: document.body })
			expect(wrapper.classes('active')).toBeTruthy()
		})
	})
})
