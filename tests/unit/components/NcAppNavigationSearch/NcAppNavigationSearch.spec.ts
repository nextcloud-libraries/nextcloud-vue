/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import NcAppNavigationSearch from '../../../../src/components/NcAppNavigationSearch/NcAppNavigationSearch.vue'

function findClearButton(wrapper) {
	return wrapper.find('button[aria-label="Clear search"]')
}
function mountWrapped(value = '') {
	return mount(defineComponent({
		components: {
			NcAppNavigationSearch,
		},
		data() {
			return {
				value,
			}
		},
		template: '<NcAppNavigationSearch v-model="value" />',
	}))
}

describe('NcAppNavigationSearch', () => {
	it('does not show the clear button for an empty search', () => {
		const wrapper = mountWrapped()

		expect(findClearButton(wrapper).exists()).toBe(false)
	})

	it('only shows the clear button once the search has content', async () => {
		const wrapper = mountWrapped()

		await wrapper.get('input').setValue('a')

		expect(findClearButton(wrapper).exists()).toBe(true)
	})

	it('hides the clear button again after clearing the search', async () => {
		const wrapper = mountWrapped('test')

		await findClearButton(wrapper).trigger('click')

		expect(findClearButton(wrapper).exists()).toBe(false)
	})
})
