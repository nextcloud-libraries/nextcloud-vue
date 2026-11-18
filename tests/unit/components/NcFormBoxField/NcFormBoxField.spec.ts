/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import NcFormBox from '../../../../src/components/NcFormBox/NcFormBox.vue'
import NcFormBoxButton from '../../../../src/components/NcFormBoxButton/NcFormBoxButton.vue'
import NcFormBoxField from '../../../../src/components/NcFormBoxField/NcFormBoxField.vue'

/**
 * Mount attached to the document so focus can be asserted
 *
 * @param props - Component props
 */
function mountField(props: Record<string, unknown> = {}) {
	const wrapper = mount(NcFormBoxField, {
		props: {
			label: 'Device name',
			modelValue: 'YubiKey',
			'onUpdate:editing': (value: boolean) => wrapper.setProps({ editing: value }),
			...props,
		},
		attachTo: document.body,
	})
	return wrapper
}

/**
 * Wait for the watcher and the DOM swap
 */
async function flush() {
	await nextTick()
	await nextTick()
}

enableAutoUnmount(afterEach)

// Found by its accessible name, so it can't be confused with the field's own buttons
const ROW = 'button[aria-label="Edit Device name"]'

describe('NcFormBoxField', () => {
	it('shows the value in the button state', () => {
		const wrapper = mountField()
		expect(wrapper.find(ROW).text()).toContain('Device name')
		expect(wrapper.text()).toContain('YubiKey')
		expect(wrapper.find('input').exists()).toBe(false)
	})

	it('never shows the value for passwords', () => {
		const wrapper = mountField({ type: 'password', modelValue: 'secret' })
		expect(wrapper.text()).not.toContain('secret')
		const hiddenDots = wrapper.findAll('[aria-hidden="true"]').filter((element) => /^•+$/.test(element.text()))
		expect(hiddenDots).toHaveLength(1)
	})

	it('keeps the hint visible in the button state and describes the button with it', () => {
		const wrapper = mountField({ helperText: 'Shown in your security settings' })
		const description = wrapper.find(`#${wrapper.find(ROW).attributes('aria-describedby')}`)
		expect(description.text()).toContain('YubiKey')
		expect(description.text()).toContain('Shown in your security settings')
	})

	it('returns focus to the row on Escape and does not bubble', async () => {
		const wrapper = mountField({ editing: true })
		let bubbled = false
		const onKeydown = () => {
			bubbled = true
		}
		document.body.addEventListener('keydown', onKeydown)
		const input = wrapper.find('input')
		input.element.focus()
		await input.trigger('keydown', { key: 'Escape' })
		await flush()
		document.body.removeEventListener('keydown', onKeydown)
		expect(bubbled).toBe(false)
		expect(wrapper.props('editing')).toBe(false)
		expect(wrapper.find(ROW).element).toBe(document.activeElement)
	})

	it('leaves Enter and Escape to an IME', async () => {
		const wrapper = mountField({ editing: true })
		const input = wrapper.find('input')
		await input.trigger('keydown', { key: 'Enter', isComposing: true })
		// Safari: composition already ended, only keyCode 229 is left
		await input.trigger('keydown', { key: 'Enter', keyCode: 229 })
		await input.trigger('keydown', { key: 'Escape', isComposing: true })
		expect(wrapper.emitted('submit')).toBeUndefined()
		expect(wrapper.props('editing')).toBe(true)
	})

	it('emits submit with the draft on Enter', async () => {
		const wrapper = mountField({ editing: true })
		await wrapper.find('input').setValue('Laptop key')
		await wrapper.find('input').trigger('keydown', { key: 'Enter' })
		expect(wrapper.emitted('submit')).toEqual([['Laptop key']])
	})

	it('keeps the input focusable but read-only while loading', async () => {
		const wrapper = mountField({ editing: true, loading: true })
		const input = wrapper.find('input')
		expect(input.attributes('disabled')).toBeUndefined()
		expect(input.attributes('readonly')).toBeDefined()
		expect(input.attributes('aria-disabled')).toBe('true')
		await input.trigger('keydown', { key: 'Enter' })
		await input.trigger('keydown', { key: 'Escape' })
		expect(wrapper.emitted('submit')).toBeUndefined()
		expect(wrapper.props('editing')).toBe(true)
	})

	it('reports an error through native validation until the user types', async () => {
		const reportValidity = vi.spyOn(HTMLInputElement.prototype, 'reportValidity')
		const wrapper = mountField({ editing: true, type: 'password', modelValue: '', label: 'Current password' })
		await flush()
		await wrapper.setProps({ error: 'Wrong password' })
		await flush()
		const input = wrapper.find('input')
		expect(input.element.validationMessage).toBe('Wrong password')
		expect(input.attributes('aria-invalid')).toBe('true')
		expect(reportValidity).toHaveBeenCalled()
		// Not shown a second time as helper text
		expect(wrapper.text()).not.toContain('Wrong password')
		await input.setValue('typed')
		expect(input.element.validationMessage).toBe('')
		reportValidity.mockRestore()
	})

	it('reports the error again on the new input after a step change', async () => {
		const wrapper = mountField({ editing: true, type: 'password', modelValue: '', label: 'Current password', error: 'Too short' })
		await wrapper.setProps({ label: 'New password' })
		await flush()
		expect(wrapper.find('input').element.validationMessage).toBe('Too short')
	})

	it('reports the same error again after the next submit finishes', async () => {
		const reportValidity = vi.spyOn(HTMLInputElement.prototype, 'reportValidity')
		const wrapper = mountField({ editing: true, error: 'Name already taken' })
		await flush()
		reportValidity.mockClear()
		await wrapper.setProps({ loading: true })
		await wrapper.setProps({ loading: false })
		await flush()
		expect(reportValidity).toHaveBeenCalledTimes(1)
		reportValidity.mockRestore()
	})

	it('puts classes on the row and keeps the consumer\'s aria-describedby', async () => {
		const wrapper = mountField({ class: 'custom', helperText: 'Hint', 'aria-describedby': 'external' })
		expect(wrapper.classes()).toContain('custom')
		await wrapper.setProps({ editing: true })
		await flush()
		// wrapper.classes() would read the unmounted button-state root
		const input = wrapper.find('.custom input')
		expect(input.exists()).toBe(true)
		expect(input.classes()).not.toContain('custom')
		expect(input.attributes('aria-describedby')?.split(' ')).toContain('external')
		expect(input.attributes('aria-describedby')?.split(' ')).toHaveLength(2)
	})

	it('has no cancel button, and a submit button only for passwords', async () => {
		const text = mountField({ editing: true })
		expect(text.findAll('button')).toHaveLength(0)
		expect(text.text()).not.toContain('Icon is missing')
		expect(text.find('input').attributes('enterkeyhint')).toBe('done')
		const password = mountField({ editing: true, type: 'password', modelValue: '' })
		expect(password.find('button[aria-label="Submit"]').exists()).toBe(true)
	})

	it('closes without submitting when Enter applies an unchanged value', async () => {
		const wrapper = mountField({ editing: true })
		await wrapper.find('input').trigger('keydown', { key: 'Enter' })
		expect(wrapper.emitted('submit')).toBeUndefined()
		expect(wrapper.props('editing')).toBe(false)
	})

	it('passes a trailing button through to the text field without leaving it', async () => {
		let clicks = 0
		const wrapper = mountField({
			editing: true,
			showTrailingButton: true,
			trailingButtonLabel: 'Clear name',
			onTrailingButtonClick: () => clicks++,
		})
		await wrapper.find('button[aria-label="Clear name"]').trigger('click')
		expect(clicks).toBe(1)
		expect(wrapper.props('editing')).toBe(true)
	})

	it('clears and refocuses the input on a step change', async () => {
		const wrapper = mountField({ editing: true, type: 'password', modelValue: '', label: 'Current password' })
		const oldInput = wrapper.find('input')
		await oldInput.setValue('old')
		oldInput.element.focus()
		await wrapper.setProps({ label: 'New password' })
		await flush()
		const input = wrapper.find('input')
		expect(input.element.value).toBe('')
		// A new element, so focusing it fires a focus event and gets announced
		expect(input.element).not.toBe(oldInput.element)
		expect(input.element).toBe(document.activeElement)
		expect(wrapper.find('label').text()).toBe('New password')
	})

	it('styles only the row as a box item, not its buttons', () => {
		let itemClass = ''
		const wrapper = mount(NcFormBox, {
			slots: {
				default: (props: { itemClass: string }) => {
					itemClass = props.itemClass
					return h(NcFormBoxField, { label: 'Current password', type: 'password', editing: true })
				},
			},
		})
		expect(itemClass).toBeTruthy()
		expect(wrapper.findAll(`.${itemClass}`)).toHaveLength(1)
		expect(wrapper.find('button[aria-label="Submit"]').classes()).not.toContain(itemClass)
	})

	it('ignores a v-model listener, so the value only changes through submit', async () => {
		const updates: string[] = []
		const wrapper = mountField({ editing: true, 'onUpdate:modelValue': (value: string) => updates.push(value) })
		await wrapper.find('input').setValue('Laptop key')
		await wrapper.find('input').trigger('keydown', { key: 'Enter' })
		expect(updates).toEqual([])
		expect(wrapper.emitted('submit')).toEqual([['Laptop key']])
	})

	it('updates attributes on the inner field between steps', async () => {
		const wrapper = mountField({ editing: true, type: 'password', modelValue: '', autocomplete: 'current-password' })
		await wrapper.setProps({ label: 'New password', autocomplete: 'new-password' })
		await flush()
		expect(wrapper.find('input').attributes('autocomplete')).toBe('new-password')
	})

	it('passes attributes added later on to the input', async () => {
		const wrapper = mountField({ editing: true })
		await wrapper.setProps({ autocomplete: 'nickname' })
		expect(wrapper.find('input').attributes('autocomplete')).toBe('nickname')
	})

	it('disables the input and the submit button while editing', () => {
		const wrapper = mountField({ editing: true, type: 'password', modelValue: '', disabled: true })
		expect(wrapper.find('input').attributes('disabled')).toBeDefined()
		expect(wrapper.find('button[aria-label="Submit"]').attributes('disabled')).toBeDefined()
	})

	it('submits on leaving the next step even with the previous step\'s value', async () => {
		const wrapper = mountField({ editing: true, label: 'Step one', modelValue: '' })
		await wrapper.find('input').setValue('x')
		await wrapper.find('input').trigger('keydown', { key: 'Enter' })
		await wrapper.setProps({ label: 'Step two' })
		await flush()
		await wrapper.find('input').setValue('x')
		await wrapper.find('input').trigger('focusout')
		expect(wrapper.emitted('submit')).toEqual([['x'], ['x']])
	})

	it('keeps a consumer\'s aria-describedby next to the row description', () => {
		const wrapper = mount(NcFormBoxButton, { props: { label: 'Name', description: 'Details' }, attrs: { 'aria-describedby': 'external' } })
		expect(wrapper.find('button').attributes('aria-describedby')?.split(' ')).toHaveLength(2)
	})

	it('follows a value the parent saves while the row is open, unless the user typed', async () => {
		const wrapper = mountField({ editing: true })
		await wrapper.setProps({ modelValue: 'Laptop key' })
		expect(wrapper.find('input').element.value).toBe('Laptop key')
		await wrapper.find('input').trigger('focusout')
		expect(wrapper.emitted('submit')).toBeUndefined()
		await wrapper.setProps({ editing: true })
		await flush()
		await wrapper.find('input').setValue('Typed')
		await wrapper.setProps({ modelValue: 'From elsewhere' })
		expect(wrapper.find('input').element.value).toBe('Typed')
	})

	it('keeps focus in the input when the rest of the row is pressed', async () => {
		const wrapper = mountField({ editing: true, class: 'row', showTrailingButton: true, trailingButtonLabel: 'Clear name' })
		// The listener attaches once the row is rendered
		await nextTick()
		const press = (element: Element) => {
			const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
			element.dispatchEvent(event)
			return event.defaultPrevented
		}
		expect(press(wrapper.find('.row').element)).toBe(true)
		expect(press(wrapper.find('label').element)).toBe(true)
		expect(press(wrapper.find('button[aria-label="Clear name"]').element)).toBe(true)
		expect(press(wrapper.find('input').element)).toBe(false)
	})

	it('labels the input when the consumer passes an id', () => {
		const wrapper = mountField({ editing: true, id: 'device-name' })
		expect(wrapper.find('input').attributes('id')).toBe('device-name')
		expect(wrapper.find('label').attributes('for')).toBe('device-name')
	})

	it('does not submit a password when leaving it', async () => {
		const wrapper = mountField({ editing: true, type: 'password', modelValue: '' })
		await wrapper.find('input').setValue('half')
		await wrapper.find('input').trigger('focusout')
		expect(wrapper.emitted('submit')).toBeUndefined()
		expect(wrapper.props('editing')).toBe(true)
	})

	it('submits a password with the submit button', async () => {
		const wrapper = mountField({ editing: true, type: 'password', modelValue: '' })
		await wrapper.find('input').setValue('secret')
		await wrapper.find('button[aria-label="Submit"]').trigger('click')
		expect(wrapper.emitted('submit')).toEqual([['secret']])
	})

	it('does not apply when focus moves to a button inside the row', async () => {
		const wrapper = mountField({ editing: true, showTrailingButton: true, trailingButtonLabel: 'Clear name' })
		await wrapper.find('input').setValue('Changed')
		await wrapper.find('input').trigger('focusout', { relatedTarget: wrapper.find('button[aria-label="Clear name"]').element })
		expect(wrapper.emitted('submit')).toBeUndefined()
	})

	it('closes on Escape from the password submit button without bubbling', async () => {
		const wrapper = mountField({ editing: true, type: 'password', modelValue: '' })
		let bubbled = false
		const onKeydown = () => {
			bubbled = true
		}
		document.body.addEventListener('keydown', onKeydown)
		await wrapper.find('button[aria-label="Submit"]').trigger('keydown', { key: 'Escape' })
		document.body.removeEventListener('keydown', onKeydown)
		expect(bubbled).toBe(false)
		expect(wrapper.props('editing')).toBe(false)
	})
})
