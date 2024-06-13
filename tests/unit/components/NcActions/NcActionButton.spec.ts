/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import NcActionButton from '../../../../src/components/NcActionButton/NcActionButton.vue'

describe('NcActionButton', () => {
	it('supports icon classes', () => {
		const wrapper = mount(NcActionButton, {
			props: {
				icon: 'icon-add'
			},
			slots: {
				default: 'text',
			},
		})
		expect(wrapper.find('.action-button__icon').classes('icon-add')).toBe(true)
	})

	it('supports icon URL', () => {
		const wrapper = mount(NcActionButton, {
			props: {
				icon: 'http://example.com/icon.png'
			},
			slots: {
				default: 'text',
			},
		})
		expect(wrapper.find('.action-button__icon').attributes('style')).toContain('background-image: url(http://example.com/icon.png);')
	})

	it('supports relative icon URL', () => {
		const wrapper = mount(NcActionButton, {
			props: {
				icon: '/icon.png',
			},
			slots: {
				default: 'text',
			},
		})
		expect(wrapper.find('.action-button__icon').attributes('style')).toContain('background-image: url(/icon.png);')
	})
})
