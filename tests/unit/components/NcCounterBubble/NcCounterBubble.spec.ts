/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { MockedFunction } from 'vitest'

import { getCanonicalLocale } from '@nextcloud/l10n'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import NcCounterBubble from '../../../../src/components/NcCounterBubble/NcCounterBubble.vue'

vi.mock('@nextcloud/l10n', async () => {
	const actual = await vi.importActual('@nextcloud/l10n')
	return {
		...actual,
		getCanonicalLocale: vi.fn(() => 'en'),
	}
})

const getCanonicalLocaleMock = getCanonicalLocale as unknown as MockedFunction<typeof getCanonicalLocale>

describe('NcCounterBubble', () => {
	describe('displaying count', () => {
		it('should render count from prop', () => {
			const wrapper = mount(NcCounterBubble, { props: { count: 314 } })
			expect(wrapper.text()).toBe('314')
		})
	})

	describe('with humanization', () => {
		afterEach(() => {
			vi.restoreAllMocks()
		})

		it('should render count 12 without humanization and without title', () => {
			const wrapper = mount(NcCounterBubble, { propsData: { count: 12 } })
			expect(wrapper.text()).toBe('12')
			expect(wrapper.attributes('title')).toBeUndefined()
		})

		it('should render count 1042 with humanization as "1K" in English', () => {
			const wrapper = mount(NcCounterBubble, { props: { count: 1042 } })
			expect(wrapper.text()).toBe('1K')
			expect(wrapper.attributes('title')).toBe('1042')
		})

		it('should render count 12000 with humanization as "1.2万" in Chinese', () => {
			getCanonicalLocaleMock.mockReturnValue('zh')
			const wrapper = mount(NcCounterBubble, { props: { count: 12_000 } })
			expect(wrapper.text()).toBe('1.2万')
			expect(wrapper.attributes('title')).toBe('12000')
		})

		it('should render count 1042 with humanization as "1K" in German', () => {
			getCanonicalLocaleMock.mockReturnValue('de')
			const wrapper = mount(NcCounterBubble, { props: { count: 1042 } })
			expect(wrapper.text()).toBe('1K')
			expect(wrapper.attributes('title')).toBe('1042')
		})

		it('should render count 1042 with humanization as "1042" in Italian', () => {
			getCanonicalLocaleMock.mockReturnValue('it')
			const wrapper = mount(NcCounterBubble, { props: { count: 1042 } })
			expect(wrapper.text()).toBe('1042')
			expect(wrapper.attributes('title')).toBeUndefined()
		})

		it('should not humanize with raw', () => {
			const wrapper = mount(NcCounterBubble, { props: { count: 1042, raw: true } })
			expect(wrapper.text()).toBe('1042')
			expect(wrapper.attributes('title')).toBeUndefined()
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
