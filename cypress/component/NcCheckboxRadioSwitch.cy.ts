/**
 * SPDX-FileCopyrightText: Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import NcCheckboxRadioSwitch from '../../src/components/NcCheckboxRadioSwitch/NcCheckboxRadioSwitch.vue'

describe('NcCheckboxRadioSwitch', () => {
	it('Sets attributes correctly', () => {
		cy.mount({
			render: (h) => h(NcCheckboxRadioSwitch, {
				// TODO: With Vue3 move class and style to attrs
				class: 'my-class',
				style: 'background: red;',
				attrs: {
					'aria-describedby': 'unique-id',
					'data-my-attribute': 'yes',
				},
			}, ['My checkbox']),
		}).then(({ wrapper }) => {
			// Class and style belong the wrapper
			// eslint-disable-next-line @typescript-eslint/no-unused-expressions
			expect(wrapper.classes('my-class')).to.be.true
			// expect(wrapper.attributes('style')).to.equal('background: red;')
			// Custom data attributes too
			expect(wrapper.attributes('data-my-attribute')).to.equal('yes')
			// real HTML attributes are passed to the real checkbox
			// eslint-disable-next-line @typescript-eslint/no-unused-expressions
			expect(wrapper.attributes('aria-describedby')).to.be.undefined
		})

		cy.findByRole('checkbox').should('have.attr', 'aria-describedby', 'unique-id')
	})
})
