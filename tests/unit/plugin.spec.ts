/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from '@jest/globals'
import { createLocalVue, mount } from '@vue/test-utils'

import { NextcloudVuePlugin } from '../../src/plugin'

describe('Nextcloud Vue Plugin', () => {
	it('can be installed', () => {
		const localVue = createLocalVue()
		localVue.use(NextcloudVuePlugin)
		const wrapper = mount({ render: (h) => h('NcButton', { props: { ariaLabel: 'button' } }) }, { localVue })
		expect(wrapper.vm.$el.tagName).not.toBe('NCBUTTON') // If it could no be installed it would be 'NCBUTTON', otherwise it would be 'A' or 'BUTTON'
	})
})
