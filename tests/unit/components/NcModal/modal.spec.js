/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import NcModal from '../../../../src/components/NcModal/NcModal.vue'

describe('NcModal', () => {
	it('closes on click outside without `noClose`', async () => {
		const wrapper = mount(NcModal, { props: { container: null, noClose: false, closeOnClickOutside: true, name: 'modal' } })
		console.error(wrapper.html())
		expect(wrapper.html().includes('modal-wrapper')).toBe(true)

		expect(wrapper.emitted('update:show')).toBe(undefined)

		await wrapper.find('.modal-wrapper').trigger('mousedown')
		// One emit('update:show', false)
		expect(wrapper.emitted('update:show')).toEqual([[false]])
	})

	it('not closes on click outside when `noClose` is true', async () => {
		const wrapper = mount(NcModal, { props: { container: null, noClose: true, name: 'modal' } })
		expect(wrapper.html().includes('modal-wrapper')).toBe(true)

		expect(wrapper.emitted('update:show')).toBe(undefined)

		await wrapper.find('.modal-wrapper').trigger('mousedown')
		// One emit('update:show', false)
		expect(wrapper.emitted('update:show')).toEqual(undefined)
	})

	it('not closes on click outside when `noClose` is false but `closeOnClickOutside` is false', async () => {
		const wrapper = mount(NcModal, { props: { container: null, noClose: false, closeOnClickOutside: false, name: 'modal' } })
		expect(wrapper.html().includes('modal-wrapper')).toBe(true)

		expect(wrapper.emitted('update:show')).toBe(undefined)

		await wrapper.find('.modal-wrapper').trigger('mousedown')
		// One emit('update:show', false)
		expect(wrapper.emitted('update:show')).toEqual(undefined)
	})

	describe('slideshow', () => {
		const props = { container: null, name: 'modal', enableSlideshow: true, hasNext: true, slideshowDelay: 100 }

		beforeEach(() => {
			vi.useFakeTimers()
		})

		afterEach(() => {
			vi.useRealTimers()
		})

		it('does not run unless started', async () => {
			const wrapper = mount(NcModal, { props })

			await vi.advanceTimersByTimeAsync(250)
			expect(wrapper.emitted('next')).toBe(undefined)
			expect(wrapper.emitted('update:slideshowRunning')).toBe(undefined)
		})

		it('runs when `slideshowRunning` is bound to true', async () => {
			const wrapper = mount(NcModal, { props: { ...props, slideshowRunning: true } })

			await vi.advanceTimersByTimeAsync(250)
			expect(wrapper.emitted('next')).toHaveLength(2)
		})

		it('stops when `slideshowRunning` is set to false', async () => {
			const wrapper = mount(NcModal, { props: { ...props, slideshowRunning: true } })

			await vi.advanceTimersByTimeAsync(150)
			expect(wrapper.emitted('next')).toHaveLength(1)

			await wrapper.setProps({ slideshowRunning: false })
			await vi.advanceTimersByTimeAsync(250)
			expect(wrapper.emitted('next')).toHaveLength(1)
		})

		it('reports the play / pause button through `update:slideshowRunning`', async () => {
			const wrapper = mount(NcModal, { props })

			await wrapper.find('.play-pause-icons').trigger('click')
			expect(wrapper.emitted('update:slideshowRunning')).toEqual([[true]])

			await wrapper.find('.play-pause-icons').trigger('click')
			expect(wrapper.emitted('update:slideshowRunning')).toEqual([[true], [false]])
		})

		it('reports the stop on the last slide', async () => {
			const wrapper = mount(NcModal, { props: { ...props, slideshowRunning: true } })

			await wrapper.setProps({ hasNext: false })
			await vi.advanceTimersByTimeAsync(150)
			expect(wrapper.emitted('next')).toBe(undefined)
			expect(wrapper.emitted('update:slideshowRunning')).toEqual([[false]])
		})
	})
})
