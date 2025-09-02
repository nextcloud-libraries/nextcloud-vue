/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from '@jest/globals'
import { shallowMount } from '@vue/test-utils'
import NcListItemIcon from '../../../../src/components/NcListItemIcon/NcListItemIcon.vue'

describe('NcListItemIcon', () => {
	it('highlights the search query', async () => {
		const wrapper = shallowMount(NcListItemIcon, {
			propsData: {
				name: 'J. Doe',
				subname: 'privacy@example.com',
				search: 'doe',
			},
		})

		const highlights = wrapper.findAllComponents({ name: 'NcHighlight' })
		expect(highlights).toHaveLength(2)
		expect(highlights.at(0).props('text')).toBe('J. Doe')
		expect(highlights.at(0).props('search')).toBe('doe')
		expect(highlights.at(1).props('text')).toBe('privacy@example.com')
		expect(highlights.at(1).props('search')).toBe('doe')
	})

	it('highlights the email notation query', async () => {
		const wrapper = shallowMount(NcListItemIcon, {
			propsData: {
				name: 'J. Doe',
				subname: 'privacy@example.com',
				search: 'Manager <privacy@example.com>',
			},
		})

		const highlights = wrapper.findAllComponents({ name: 'NcHighlight' })
		expect(highlights).toHaveLength(2)
		expect(highlights.at(0).props('search')).toBe('Manager')
		expect(highlights.at(1).props('search')).toBe('privacy@example.com')
	})

	it('highlights the email notation query even if only partly typed', async () => {
		const wrapper = shallowMount(NcListItemIcon, {
			propsData: {
				name: 'J. Doe',
				subname: 'privacy@example.com',
				search: 'Manager <privacy',
			},
		})

		const highlights = wrapper.findAllComponents({ name: 'NcHighlight' })
		expect(highlights).toHaveLength(2)
		expect(highlights.at(0).props('search')).toBe('Manager')
		expect(highlights.at(1).props('search')).toBe('privacy')
	})

	it('does not highlight the email notation query when missing email', async () => {
		const wrapper = shallowMount(NcListItemIcon, {
			propsData: {
				name: 'J. Doe',
				subname: 'privacy@example.com',
				search: 'Doe <',
			},
		})

		const highlights = wrapper.findAllComponents({ name: 'NcHighlight' })
		expect(highlights).toHaveLength(2)
		expect(highlights.at(0).props('search')).toBe('Doe <')
		expect(highlights.at(1).props('search')).toBe('Doe <')
	})

	it('does not highlight the email notation query when no user', async () => {
		const wrapper = shallowMount(NcListItemIcon, {
			propsData: {
				name: 'J. Doe',
				subname: 'privacy@example.com',
				search: 'Doe <privacy@example.com>',
				isNoUser: true,
			},
		})

		const highlights = wrapper.findAllComponents({ name: 'NcHighlight' })
		expect(highlights).toHaveLength(2)
		expect(highlights.at(0).props('search')).toBe('Doe <privacy@example.com>')
		expect(highlights.at(1).props('search')).toBe('Doe <privacy@example.com>')
	})
})
