/**
 * SPDX-FileCopyrightText: Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { h } from 'vue'
import NcAppNavigation from '../../src/components/NcAppNavigation/NcAppNavigation.vue'
import NcAppNavigationItem from '../../src/components/NcAppNavigationItem/NcAppNavigationItem.vue'
import NcAppNavigationSpacer from '../../src/components/NcAppNavigationSpacer/NcAppNavigationSpacer.vue'

describe('NcAppNavigationSpacer', () => {
	it('works', () => {
		cy.mount({
			render: () => h(NcAppNavigation, null, {
				list: () => [
					h(NcAppNavigationItem, { name: 'First' }),
					h(NcAppNavigationSpacer),
					h(NcAppNavigationItem, { name: 'Second' }),
				],
			}),
		})

		cy.contains('li', 'First').should('exist').then(($first) => {
			cy.contains('li', 'Second').should('exist').then(($second) => {
				// Check that the second element is at least 22px below the first one (thats our spacer)
				expect($second.offset()!.top - 22).gte($first.offset()!.top + $first.height()!)
			})
		})
	})
})
