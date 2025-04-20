/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import NcSelectUsers from '../../../../src/components/NcSelectUsers/NcSelectUsers.vue'

it('emits the search event', async () => {
	const vm = mount(NcSelectUsers, {
		props: {
			ariaLabelCombobox: 'Search users',
			options: [],
		},
	})

	await vm.get('input[type="search"]').setValue('query')
	expect(vm.emitted('search')).toEqual([['query']])
})

it('also emits the search event if cleared', async () => {
	const vm = mount(NcSelectUsers, {
		props: {
			ariaLabelCombobox: 'Search users',
			options: [],
		},
	})

	await vm.get('input[type="search"]').setValue('query')
	await vm.get('input[type="search"]').setValue('')
	expect(vm.emitted('search')).toEqual([['query'], ['']])
})
