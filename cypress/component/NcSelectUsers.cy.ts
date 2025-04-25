/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from 'cypress/vue2'
import NcSelectUsers from '../../src/components/NcSelectUsers/NcSelectUsers.vue'

it('emits the search event', async () => {
	const wrapper = mount(NcSelectUsers, {
		propsData: {
			ariaLabelCombobox: 'Search users',
			options: [],
		},
	})

	wrapper.get('input[type="search"]')
		.type('query')

	wrapper.then(({ wrapper }) => {
		expect(wrapper.emitted('search')).to.eql([['query']])
	})
})

it('also emits the search event if cleared', async () => {
	const wrapper = mount(NcSelectUsers, {
		propsData: {
			ariaLabelCombobox: 'Search users',
			options: [],
		},
	})

	wrapper.get('input[type="search"]')
		.type('query')
	wrapper.get('input[type="search"]')
		.type('{clearAll}')

	wrapper.then(({ wrapper }) => {
		expect(wrapper.emitted('search')).to.eql([['query', '']])
	})
})
