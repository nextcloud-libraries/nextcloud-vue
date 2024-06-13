/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, resolveComponent } from 'vue'

import { NextcloudVuePlugin } from '../../src/plugin'

describe('Nextcloud Vue Plugin', () => {
	it('can be installed', () => {
		const wrapper = mount(
			{
				setup() {
					const ButtonCounter = resolveComponent('NcButton')
					return () => h(ButtonCounter, { ariaLabel: 'button' })
				},
			}, {
				global: {
					plugins: [NextcloudVuePlugin],
				},
			}
		)
		expect(wrapper.vm.$el.tagName).not.toBe('NCBUTTON') // If it could no be installed it would be 'NCBUTTON', otherwise it would be 'A' or 'BUTTON'
	})
})
