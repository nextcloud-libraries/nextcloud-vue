/**
 * @copyright Copyright (c) 2023 Ferdinand Thiessen <opensource@fthiessen.de>
 *
 * @author Ferdinand Thiessen <opensource@fthiessen.de>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import { shallowMount } from '@vue/test-utils'
import NcButton from '../../../../src/components/NcButton/NcButton.vue'

describe('NcButton', () => {
	let consoleError: jest.SpyInstance

	beforeAll(() => {
		consoleError = jest.spyOn(console, 'error')
	})
	afterEach(() => jest.resetAllMocks())
	afterAll(() => jest.restoreAllMocks())

	it('emits update:pressed', async () => {
		const wrapper = shallowMount(NcButton, { propsData: { pressed: true, ariaLabel: 'button' } })
		wrapper.find('button').trigger('click')
		expect(wrapper.emitted('update:pressed')?.length).toBe(1)
		expect(wrapper.emitted('update:pressed')?.[0]).toEqual([false])

		// Now the same but when pressed was false
		await wrapper.setProps({ pressed: false })
		wrapper.find('button').trigger('click')
		expect(wrapper.emitted('update:pressed')?.length).toBe(2)
		expect(wrapper.emitted('update:pressed')?.[1]).toEqual([true])
	})

	it('does not emit update:pressed when not configured', async () => {
		const wrapper = shallowMount(NcButton, { propsData: { ariaLabel: 'button' } })
		wrapper.find('button').trigger('click')
		expect(wrapper.emitted('update:pressed')).toBe(undefined)
	})

	it('does not contain the text wrapper if there is no text', async () => {
		const wrapper = shallowMount(NcButton, { propsData: { ariaLabel: 'button', text: '' } })
		const textSpan = wrapper.find('.button-vue__text')
		expect(textSpan.exists()).toBe(false)
	})

	it('sets the text class correctly', async () => {
		const wrapper = shallowMount(NcButton, { propsData: { ariaLabel: 'button', text: 'Hello' } })
		const textSpan = wrapper.find('.button-vue__text')
		expect(textSpan.exists()).toBe(true)
		expect(textSpan.text()).toBe('Hello')
	})

	it('sets the text class with extra text classes correctly (string)', async () => {
		const wrapper = shallowMount(NcButton, { propsData: { ariaLabel: 'button', textClasses: 'my-class', text: 'Hello' } })
		const textSpan = wrapper.find('.button-vue__text')
		expect(textSpan.exists()).toBe(true)
		expect(textSpan.classes()).toEqual(['button-vue__text', 'my-class'])
		expect(textSpan.text()).toBe('Hello')
	})

	it('sets the text class with extra text classes correctly (array)', async () => {
		const wrapper = shallowMount(NcButton, { propsData: { ariaLabel: 'button', textClasses: ['my-class', 'other-class'], text: 'Hello' } })
		const textSpan = wrapper.find('.button-vue__text')
		expect(textSpan.exists()).toBe(true)
		expect(textSpan.classes()).toEqual(['button-vue__text', 'my-class', 'other-class'])
		expect(textSpan.text()).toBe('Hello')
	})

	it('sets the text class with extra text classes correctly (object)', async () => {
		const wrapper = shallowMount(NcButton, { propsData: { ariaLabel: 'button', textClasses: { 'my-class': true, 'other-class': false }, text: 'Hello' } })
		const textSpan = wrapper.find('.button-vue__text')
		expect(textSpan.exists()).toBe(true)
		expect(textSpan.classes()).toEqual(['button-vue__text', 'my-class'])
		expect(textSpan.text()).toBe('Hello')
	})

	it('default slot is deprecated', async () => {
		consoleError.mockImplementation(() => {})

		const version = (await import('../../../../package.json')).version
		const wrapper = shallowMount(NcButton, { propsData: { ariaLabel: 'button' }, slots: { default: 'Hello' } })
		const textSpan = wrapper.find('.button-vue__text')

		if (version.match(/8\.0\.0-beta/)) {
			expect(textSpan.exists()).toBe(true)
			expect(textSpan.text()).toBe('Hello')
			expect(consoleError).toBeCalled()
			expect(consoleError.mock.calls[0][0]).toMatch(/NcButton.+default.+slot.+deprecated/)
		} else {
			// If this fails: You forgot to remove the button default slot handling when preparing the stable release!
			expect(textSpan.exists()).toBe(false)
		}
	})
})
