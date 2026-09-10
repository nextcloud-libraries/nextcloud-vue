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

	describe('Non-standard token handling', () => {
		it('warns about non-standard formatting tokens', () => {
			const warnHandler = vi.fn()

			mount(NcDateTimePicker, {
				props: { format: 'Pp' },
				global: {
					config: { warnHandler },
				},
			})

			expect(warnHandler).toHaveBeenCalledOnce()
			expect(warnHandler.mock.calls[0][0]).toEqual('[NcDateTimePicker] The `format` property value "Pp" uses the non-standard formating tokens P, p. They will be disabled in the future because they are only supported by the date-fns library. Only use tokens from the Unicode Technical Standard #35. See https://github.com/nextcloud-libraries/nextcloud-vue/issues/8931')
		})

		it('warns about non-standard formatting tokens after property change', async () => {
			const warnHandler = vi.fn()
			const wrapper = mount(NcDateTimePicker, {
				props: {
					format: 'HH',
				},
				global: {
					config: { warnHandler },
				},
			})

			await wrapper.setProps({ format: 'II-RR' })

			expect(warnHandler).toHaveBeenCalledOnce()
			expect(warnHandler.mock.calls[0][0])
				.toContain('[NcDateTimePicker] The `format` property value "II-RR" uses the non-standard formating tokens I, R.')
		})

		it('supports non-standard tokens', async () => {
			const wrapper = mount(NcDateTimePicker, {
				props: { modelValue: new Date(2026, 1, 10), format: 'II-RR' },
			})

			await nextTick()

			expect(wrapper.find('input').element.value).toBe('07-2026')
		})
	})
})
