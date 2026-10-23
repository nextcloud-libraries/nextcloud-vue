/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import NcLoadingIcon from '../../../../src/components/NcLoadingIcon/NcLoadingIcon.vue'
import NcLockedBanner from '../../../../src/components/NcLockedBanner/NcLockedBanner.vue'

describe('NcLockedBanner', () => {
	beforeEach(() => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date('2026-10-21T12:00:00Z'))
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('alerts that someone else holds the lock, by name', () => {
		const wrapper = mount(NcLockedBanner, { props: { lockedBy: 'Jane Doe' } })
		expect(wrapper.get('[role="alert"]').text()).toBe('Locked by Jane Doe. You cannot edit this until the lock is released.')
		expect(wrapper.find('button').exists()).toBe(false)
	})

	it('attributes a lock without a name to another user', () => {
		const wrapper = mount(NcLockedBanner)
		expect(wrapper.text()).toContain('Locked by another user. You cannot edit this until the lock is released.')
	})

	it('offers to unlock a lock the current user holds', async () => {
		const wrapper = mount(NcLockedBanner, { props: { lockedByMe: true } })
		expect(wrapper.attributes('role')).toBe('note')
		expect(wrapper.find('[role="alert"]').exists()).toBe(false)
		expect(wrapper.text()).toContain('You are editing this. Others cannot change it until you unlock it.')

		const button = wrapper.get('button')
		expect(button.text()).toBe('Unlock')
		await button.trigger('click')
		expect(wrapper.emitted('unlock')).toHaveLength(1)
	})

	it('can hide the unlock button', () => {
		const wrapper = mount(NcLockedBanner, { props: { lockedByMe: true, hideUnlock: true } })
		expect(wrapper.find('button').exists()).toBe(false)
	})

	it('ignores the unlock button while unlocking, but keeps it focusable', async () => {
		const wrapper = mount(NcLockedBanner, { props: { lockedByMe: true, unlocking: true } })
		const button = wrapper.get('button')
		expect(button.attributes('disabled')).toBeUndefined()
		expect(button.attributes('aria-disabled')).toBe('true')
		await button.trigger('click')
		expect(wrapper.emitted('unlock')).toBeUndefined()
	})

	it('shows a named loading icon while unlocking', async () => {
		const wrapper = mount(NcLockedBanner, { props: { lockedByMe: true } })
		expect(wrapper.findComponent(NcLoadingIcon).exists()).toBe(false)
		await wrapper.setProps({ unlocking: true })
		expect(wrapper.getComponent(NcLoadingIcon).props('name')).toBe('Unlocking …')
	})

	it('says when the lock expires', () => {
		const wrapper = mount(NcLockedBanner, { props: { lockedBy: 'Jane Doe', expiresAt: Date.now() + 20 * 60 * 1000 } })
		expect(wrapper.text()).toContain('The lock expires in 20 minutes')
	})

	it('says when the lock has expired', () => {
		const wrapper = mount(NcLockedBanner, { props: { lockedBy: 'Jane Doe', expiresAt: new Date(Date.now() - 60 * 1000) } })
		expect(wrapper.text()).toContain('The lock has expired')
	})

	it('accepts an ISO date string', () => {
		const wrapper = mount(NcLockedBanner, { props: { lockedBy: 'Jane Doe', expiresAt: new Date(Date.now() + 20 * 60 * 1000).toISOString() } })
		expect(wrapper.text()).toContain('The lock expires in 20 minutes')
	})

	it('keeps the expiry line out of the live region', () => {
		const wrapper = mount(NcLockedBanner, { props: { lockedBy: 'Jane Doe', expiresAt: Date.now() + 20 * 60 * 1000 } })
		expect(wrapper.attributes('role')).toBeUndefined()
		expect(wrapper.get('[role="alert"]').text()).not.toContain('expire')
	})

	it('says the lock has expired once the time passes', async () => {
		const wrapper = mount(NcLockedBanner, { props: { lockedBy: 'Jane Doe', expiresAt: Date.now() + 30_000 } })
		expect(wrapper.text()).toContain('The lock expires in 30 seconds')
		await vi.advanceTimersByTimeAsync(32_000)
		expect(wrapper.text()).toContain('The lock has expired')
	})

	it('follows a renewed lock', async () => {
		const wrapper = mount(NcLockedBanner, { props: { lockedBy: 'Jane Doe', expiresAt: Date.now() - 60_000 } })
		expect(wrapper.text()).toContain('The lock has expired')
		await wrapper.setProps({ expiresAt: Date.now() + 20 * 60 * 1000 })
		expect(wrapper.text()).toContain('The lock expires in 20 minutes')
	})

	it('says nothing about expiry without a time', () => {
		const wrapper = mount(NcLockedBanner, { props: { lockedBy: 'Jane Doe' } })
		expect(wrapper.text()).not.toContain('expire')
	})
})
