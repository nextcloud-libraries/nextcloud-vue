/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount, shallowMount } from '@vue/test-utils'
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
			propsData: {
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
			propsData: {
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
			propsData: {
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
			propsData: {
				user: 'Jane Doe',
				isNoUser: true,
			},
		})
		await nextTick()
		expect(wrapper.text()).toBe('JD')
	})

	it('should display initials for display name property over user id', async () => {
		const wrapper = shallowMount(NcAvatar, {
			propsData: {
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
				propsData: {
					displayName,
				},
			})
			await nextTick()
			expect(wrapper.text()).toBe(initials)
		})
	})

	describe('Icon and image rendering', () => {
		// Mock the Image constructor
		let originalImage

		beforeAll(() => {
			originalImage = global.Image
			global.Image = jest.fn(() => ({
				onload: null,
				onerror: null,
				_src: '',
				get src() {
					return this._src
				},
				set src(value) {
					this._src = value
					this.onload?.() // Trigger the onload event
				},
			}))
		})

		afterAll(() => {
			global.Image = originalImage
		})

		it('should render image with avatar url pointing to a user', async () => {
			const wrapper = mount(NcAvatar, {
				propsData: {
					displayName: 'Guest',
					user: 'user1',
				},
			})
			await nextTick()

			expect(wrapper.find('img').exists()).toBeTruthy()
			expect(wrapper.find('img').attributes('src')).toMatch(/avatar\/user1\/64$/)
		})

		it('should render image with avatar url pointing to a user', async () => {
			const avatarUrl = 'https://cloud.ltd/index.php/avatar/user2/512'

			const wrapper = mount(NcAvatar, {
				propsData: {
					displayName: 'Guest',
					url: avatarUrl,
				},
			})
			await nextTick()

			expect(wrapper.find('img').exists()).toBeTruthy()
			expect(wrapper.find('img').attributes('src')).toBe(avatarUrl)
		})

		it('should not render image with avatar url if icon slot is populated', async () => {
			const wrapper = mount(NcAvatar, {
				propsData: {
					displayName: 'User',
					user: 'userid',
				},
				slots: {
					icon: '<span class="slot-scoped-icon"></span>',
				}
			})

			expect(wrapper.find('img').exists()).toBeFalsy()
			expect(wrapper.find('span.slot-scoped-icon').exists()).toBeTruthy()
		})

		it('should not render image with avatar url if iconClass is provided', async () => {
			const wrapper = mount(NcAvatar, {
				propsData: {
					displayName: 'User',
					user: 'userid',
					iconClass: 'custom-icon-class',
				},
			})

			expect(wrapper.find('img').exists()).toBeFalsy()
			expect(wrapper.find('span.avatar-class-icon.custom-icon-class').exists()).toBeTruthy()
		})

		it('should not render image with avatar url if not a user', async () => {
			const wrapper = mount(NcAvatar, {
				propsData: {
					displayName: 'Guest',
					user: 'guest/abcdef',
					isNoUser: true,
				},
			})

			expect(wrapper.find('img').exists()).toBeFalsy()
		})

		it('should not render image with avatar url if user id is not provided', async () => {
			const wrapper = mount(NcAvatar, {
				propsData: {
					displayName: 'Empty',
				},
			})

			expect(wrapper.find('img').exists()).toBeFalsy()
		})
	})
})
