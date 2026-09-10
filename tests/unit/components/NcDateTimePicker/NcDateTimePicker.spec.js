/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { setLocale } from '@nextcloud/l10n'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import NcDateTimePicker from '../../../../src/components/NcDateTimePicker/NcDateTimePicker.vue'
import useDateFnsLocale, { resetDateFnsLocaleCache } from '../../../../src/components/NcDateTimePicker/useDateFnsLocale.ts'

describe('NcDateTimePicker.vue', () => {
	describe('Locale loading', async () => {
		beforeEach(() => {
			resetDateFnsLocaleCache()
		})

		it('Make immediately writable for cached local', async () => {
			setLocale('de')
			const { isLoading } = useDateFnsLocale()
			await vi.waitUntil(() => !isLoading.value)

			const wrapper = mount(NcDateTimePicker, {
				props: {
					type: 'date',
				},
			})
			const input = wrapper.find('input')
			await input.setValue('11.02.2000')

			const emitted = wrapper.emitted('update:modelValue')
			expect(emitted).toBeTruthy()
			expect(emitted.at(0)[0]).toBeTruthy()
		})

		it('Make writable after laoding locale', async () => {
			setLocale('de')
			const wrapper = mount(NcDateTimePicker, {
				props: {
					type: 'date',
				},
			})

			const input = wrapper.find('input')
			await vi.waitUntil(() => !input.element.readOnly)
			await input.setValue('11.02.2000')

			const emitted = wrapper.emitted('update:modelValue')
			expect(emitted).toBeTruthy()
			expect(emitted.at(0)[0]).toBeTruthy()
		})

		it('Make readonly while loading locale', async () => {
			setLocale('de')
			const wrapper = mount(NcDateTimePicker, {
				props: {
					type: 'date',
				},
			})

			expect(wrapper.find('input').element.readOnly).toBeTruthy()
		})

		it('Make switch formatting after laoding locale', async () => {
			setLocale('de')
			const wrapper = mount(NcDateTimePicker, {
				props: {
					type: 'date',
					modelValue: new Date(2026, 1, 10),
				},
			})
			await nextTick()
			expect(wrapper.find('input').element.value).toBe('Feb 10, 2026')

			await vi.waitFor(() => {
				expect(wrapper.find('input').element.value).toBe('10.02.2026')
			})
		})
	})

	describe('Time picker visibility', () => {
		it.for([
			['week', false],
			['month', false],
			['year', false],
			['date', false],
			['date-range', false],
			['time', false],
			['time-range', false],
			['datetime', true],
			['datetime-range', true],
		])('renders the time picker button for type %s -> %s', async ([type, isRendered]) => {
			const wrapper = mount(NcDateTimePicker, {
				props: {
					type,
					inline: true,
				},
			})

			await nextTick()

			expect(wrapper.find('[data-test-id="open-time-picker-btn"]').exists()).toBe(isRendered)
		})
	})
})
