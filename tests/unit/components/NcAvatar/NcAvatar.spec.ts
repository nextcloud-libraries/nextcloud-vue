/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount, shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import NcAvatar from '../../../../src/components/NcAvatar/NcAvatar.vue'

describe('NcAvatar.vue', () => {
	it('aria label is set to include status if status is shown visually', async () => {
		const status = {
			icon: '',
			status: 'online',
			message: 'doing nothing',
		}

		const wrapper = mount(NcAvatar, {
			props: {
				user: 'janedoe',
				displayName: 'J. Doe',
				preloadedUserStatus: status,
			},
		})
		await nextTick()

		expect(wrapper.find('.avatardiv__user-status').exists()).toBe(true)
		expect(wrapper.find('.action-item__menutoggle').attributes('aria-label')).toBe('Avatar of J. Doe, online')
	})

	it('aria label is set to include status even if status is do-not-disturb', async () => {
		const status = {
			icon: '',
			status: 'dnd',
			message: 'Playing DnD',
		}

		const wrapper = mount(NcAvatar, {
			props: {
				user: 'janedoe',
				displayName: 'J. Doe',
				preloadedUserStatus: status,
			},
		})

		await nextTick()

		expect(wrapper.find('.avatardiv__user-status').exists()).toBe(true)
		expect(wrapper.find('.action-item__menutoggle').attributes('aria-label')).toBe('Avatar of J. Doe, do not disturb')
	})

	it('aria label is does not include status if status not shown', async () => {
		const status = {
			icon: '',
			status: 'online',
			message: 'Idle',
		}

		const wrapper = mount(NcAvatar, {
			props: {
				user: 'janedoe',
				displayName: 'J. Doe',
				preloadedUserStatus: status,
				showUserStatus: false,
			},
		})

		await nextTick()

		expect(wrapper.find('.avatardiv__user-status').exists()).toBe(false)
		expect(wrapper.find('.action-item__menutoggle').attributes('aria-label')).toBe('Avatar of J. Doe')
	})

	it('should display initials for user id', async () => {
		const wrapper = shallowMount(NcAvatar, {
			props: {
				user: 'Jane Doe',
				isNoUser: true,
			},
		})
		await nextTick()
		expect(wrapper.text()).toBe('JD')
	})

	it('should display initials for display name property over user id', async () => {
		const wrapper = shallowMount(NcAvatar, {
			props: {
				displayName: 'No User',
				user: 'I am a group',
				isNoUser: true,
			},
		})
		await nextTick()
		expect(wrapper.text()).toBe('NU')
	})

	describe('Fallback initials', () => {
		it.each`
			displayName             | initials | case
			${''}                   | ${'?'}   | ${'empty user'}
			${'Jane Doe'}           | ${'JD'}  | ${'display name property'}
			${'Jane (Doe)'}         | ${'JD'}  | ${'special characters in name'}
			${'jane doe'}           | ${'JD'}  | ${'lower case name'}
			${'Jane Some Name Doe'} | ${'JD'}  | ${'middle names'}
			${'Ümit Öçal'}          | ${'ÜÖ'}  | ${'non ascii characters'}
			${'ジェーン ドー'}        | ${'ジド'} | ${'non latin characters'}
		`('should display initials for $case ("$displayName" -> "$initials")', async ({ displayName, initials }) => {
			const wrapper = shallowMount(NcAvatar, {
				props: {
					displayName,
				},
			})
			await nextTick()
			expect(wrapper.text()).toBe(initials)
		})
	})
})
