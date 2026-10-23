/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import NcIconSvgWrapper from '../../../../src/components/NcIconSvgWrapper/NcIconSvgWrapper.vue'
import NcLockIndicator from '../../../../src/components/NcLockIndicator/NcLockIndicator.vue'

describe('NcLockIndicator', () => {
	it('names the user who holds the lock', () => {
		const wrapper = mount(NcLockIndicator, { props: { lockedBy: 'Jane Doe' } })
		expect(wrapper.attributes('role')).toBe('img')
		expect(wrapper.attributes('aria-label')).toBe('Locked by Jane Doe')
		expect(wrapper.attributes('title')).toBe('Locked by Jane Doe')
	})

	it('says when the current user holds the lock', () => {
		const wrapper = mount(NcLockIndicator, { props: { lockedBy: 'Jane Doe', lockedByMe: true } })
		expect(wrapper.attributes('aria-label')).toBe('Locked by you')
	})

	it('attributes a lock without a name to another user', () => {
		const wrapper = mount(NcLockIndicator)
		expect(wrapper.attributes('aria-label')).toBe('Locked by another user')
	})

	it('uses the warning tone for someone else\'s lock and the neutral one for the user\'s own', () => {
		const other = mount(NcLockIndicator, { props: { lockedBy: 'Jane Doe' } })
		expect(other.classes().some((name) => name.includes('ncLockIndicator_other'))).toBe(true)

		const mine = mount(NcLockIndicator, { props: { lockedByMe: true } })
		expect(mine.classes().some((name) => name.includes('ncLockIndicator_mine'))).toBe(true)
		expect(mine.classes().some((name) => name.includes('ncLockIndicator_other'))).toBe(false)
	})

	it('shows who holds the lock only when asked, as its visible name', () => {
		const without = mount(NcLockIndicator, { props: { lockedBy: 'Jane Doe' } })
		expect(without.text()).toBe('')

		const withLabel = mount(NcLockIndicator, { props: { lockedBy: 'Jane Doe', showLabel: true } })
		expect(withLabel.text()).toBe('Locked by Jane Doe')
		expect(withLabel.attributes('role')).toBeUndefined()
		expect(withLabel.attributes('aria-label')).toBeUndefined()
		expect(withLabel.attributes('title')).toBeUndefined()
		expect(withLabel.getComponent(NcIconSvgWrapper).attributes('aria-hidden')).toBe('true')
	})

	it('draws the padlock at the given size', () => {
		const wrapper = mount(NcLockIndicator, { props: { size: 24 } })
		expect(wrapper.getComponent(NcIconSvgWrapper).props('size')).toBe(24)
	})
})
