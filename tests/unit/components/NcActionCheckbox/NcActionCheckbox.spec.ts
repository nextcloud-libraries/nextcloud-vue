/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import NcActionCheckbox from '../../../../src/components/NcActionCheckbox/NcActionCheckbox.vue'

describe('NcActionCheckbox', () => {
	it('links the description prop to the checkbox with aria-describedby', () => {
		const wrapper = mount(NcActionCheckbox, {
			props: {
				description: 'Only available for archived apps',
			},
		})

		const input = wrapper.get('input[type="checkbox"]')
		const describedBy = input.attributes('aria-describedby')

		expect(describedBy).toBeTruthy()
		expect(wrapper.get(`#${describedBy}`).text()).toBe('Only available for archived apps')
	})

	it('supports a description slot', () => {
		const wrapper = mount(NcActionCheckbox, {
			slots: {
				default: 'Show in app list',
				description: 'Only available for archived apps',
			},
		})

		const input = wrapper.get('input[type="checkbox"]')
		const describedBy = input.attributes('aria-describedby')

		expect(describedBy).toBeTruthy()
		expect(wrapper.get(`#${describedBy}`).text()).toBe('Only available for archived apps')
	})

	it('does not set aria-describedby without a description', () => {
		const wrapper = mount(NcActionCheckbox, {
			slots: { default: 'Show in app list' },
		})

		expect(wrapper.get('input[type="checkbox"]').attributes('aria-describedby')).toBeUndefined()
	})
})
