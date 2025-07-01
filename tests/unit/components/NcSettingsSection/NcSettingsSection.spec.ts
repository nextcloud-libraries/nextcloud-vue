/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import NcSettingsSection from '../../../../src/components/NcSettingsSection/NcSettingsSection.vue'

it('renders the headline', async () => {
	const wrapper = mount(NcSettingsSection, {
		props: {
			name: 'Example section',
		},
	})

	expect(wrapper.text()).toMatch('Example section')
})

it('renders the description', async () => {
	const wrapper = mount(NcSettingsSection, {
		props: {
			name: 'Example section',
			description: 'This section allows to test the component.',
		},
	})

	expect(wrapper.text()).toMatch('This section allows to test the component.')
})

it('renders the content', async () => {
	const wrapper = mount(NcSettingsSection, {
		props: {
			name: 'Example section',
		},
		slots: {
			default: '<div id="content"></div>',
		},
	})

	expect(wrapper.find('#content').exists()).toBe(true)
})

it('renders documentation link if provided', async () => {
	const wrapper = mount(NcSettingsSection, {
		props: {
			name: 'Example section',
			docUrl: 'http://example.com',
		},
	})

	const link = wrapper.find('a')
	expect(link.exists()).toBe(true)
	expect(link.attributes('href')).toBe('http://example.com')
	expect(link.attributes('rel')).toBe('noreferrer nofollow')
	expect(link.attributes('aria-label')).toBe('External documentation')
})

it('does not render documentation link if missing', async () => {
	const wrapper = mount(NcSettingsSection, {
		props: {
			name: 'Example section',
		},
	})

	const link = wrapper.find('a')
	expect(link.exists()).toBe(false)
})
