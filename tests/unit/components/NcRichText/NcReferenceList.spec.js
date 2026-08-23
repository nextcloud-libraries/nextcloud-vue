/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import axios from '@nextcloud/axios'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import NcReferenceList from '../../../../src/components/NcRichText/NcReferenceList.vue'

vi.mock('@nextcloud/axios', () => ({
	default: {
		get: vi.fn().mockResolvedValue({ data: { ocs: { data: { references: {} } } } }),
		post: vi.fn().mockResolvedValue({ data: { ocs: { data: { references: {} } } } }),
	},
}))

describe('NcReferenceList', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('does not render anything and issues no request for text without a URL', () => {
		const wrapper = mount(NcReferenceList, {
			props: {
				text: 'just some plain text, no link here',
			},
		})

		expect(wrapper.find('.widgets--list').exists()).toBe(false)
		expect(axios.get).not.toHaveBeenCalled()
		expect(axios.post).not.toHaveBeenCalled()
	})

	it('renders the loading state immediately for text containing a URL', () => {
		const wrapper = mount(NcReferenceList, {
			props: {
				text: 'check this out https://nextcloud.com',
			},
		})

		expect(wrapper.find('.widgets--list').exists()).toBe(true)
		expect(wrapper.find('.widgets--list').classes()).toContain('icon-loading')
	})

	it('renders without issuing a request when referenceData is provided', () => {
		const referenceData = [
			{
				accessible: true,
				openGraphObject: {
					id: 'https://nextcloud.com',
					link: 'https://nextcloud.com',
					name: 'Nextcloud',
				},
				richObjectType: 'open-graph',
			},
		]

		const wrapper = mount(NcReferenceList, {
			props: {
				text: 'https://nextcloud.com',
				referenceData,
			},
		})

		expect(wrapper.find('.widgets--list').exists()).toBe(true)
		expect(wrapper.find('.widgets--list').classes()).not.toContain('icon-loading')
		expect(axios.get).not.toHaveBeenCalled()
		expect(axios.post).not.toHaveBeenCalled()
	})
})
