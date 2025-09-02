/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { beforeEach, describe, expect, it } from '@jest/globals'
import { mount } from '@vue/test-utils'
import NcAppContent from '../../../../src/components/NcAppContent/NcAppContent.vue'

describe('NcAppContent', () => {
	beforeEach(() => {
		document.title = 'Initial title'
	})

	it('does not set a page heading by default', () => {
		const wrapper = mount(NcAppContent)

		expect(wrapper.find('h1').exists()).toBe(false)
	})

	it('can set the page heading', () => {
		const wrapper = mount(NcAppContent, {
			propsData: {
				pageHeading: 'My heading',
			},
		})

		expect(wrapper.find('h1').text()).toBe('My heading')
	})

	it('does not set the document title without page heading', () => {
		mount(NcAppContent)

		expect(document.title).toBe('Initial title')
	})

	it('sets the document title if a heading is provided', () => {
		mount(NcAppContent, {
			propsData: {
				pageHeading: 'My heading',
			},
		})

		expect(document.title).toBe('My heading - nextcloud-vue - Nextcloud')
	})

	it('does not duplicate the heading in the document title', () => {
		mount(NcAppContent, {
			propsData: {
				pageHeading: 'nextcloud-vue',
			},
		})

		expect(document.title).toBe('nextcloud-vue - Nextcloud')
	})

	it('does not duplicate the heading in the document title if already formatted', () => {
		mount(NcAppContent, {
			propsData: {
				pageHeading: 'My heading - nextcloud-vue',
			},
		})

		expect(document.title).toBe('My heading - nextcloud-vue - Nextcloud')
	})

	it('sets the document title if pageTitle is provided', () => {
		mount(NcAppContent, {
			propsData: {
				pageTitle: 'My title',
			},
		})

		expect(document.title).toBe('My title - Nextcloud')
	})

	it('does not duplicate the title in the document title', () => {
		mount(NcAppContent, {
			propsData: {
				pageTitle: 'Nextcloud',
			},
		})

		expect(document.title).toBe('Nextcloud')
	})

	it('does not duplicate the title in the document title if already formatted', () => {
		mount(NcAppContent, {
			propsData: {
				pageTitle: 'My title - Nextcloud',
			},
		})

		expect(document.title).toBe('My title - Nextcloud')
	})

	it('sets the document title if pageTitle and pageHeading are provided', () => {
		mount(NcAppContent, {
			propsData: {
				pageHeading: 'My heading',
				pageTitle: 'My title',
			},
		})

		expect(document.title).toBe('My title - Nextcloud')
	})
})
