import { mount } from 'cypress/vue2'
import NcSelect from '../../src/components/NcSelect/NcSelect.vue'

describe('NcSelect', () => {
	const mountSelect = () =>
		mount(NcSelect, {
			propsData: {
				userSelect: true,
				inputClass: 'cypress-search-input',
				options: [
					{
						id: '0-john',
						displayName: 'John',
						isNoUser: false,
						subname: 'john@example.org',
						icon: '',
					},
					{
						id: '0-emma',
						displayName: 'Emma',
						isNoUser: false,
						subname: 'emma@example.org',
						icon: '',
					},
					{
						id: '0-olivia',
						displayName: 'Olivia',
						isNoUser: false,
						subname: 'olivia@example.org',
						icon: '',
					},
				],
			},
		})

	it('has options', () => {
		mountSelect()

		cy.get('.select').click()
		cy.contains('.option', 'Olivia').should('exist')
		cy.contains('.option', 'John').should('exist')
		cy.contains('.option', 'Emma').should('exist')
	})

	it('can filter by name', () => {
		mountSelect()

		cy.get('.cypress-search-input').scrollIntoView().type('Em')
		cy.contains('.option', 'Emma').should('exist')
		cy.document().find('.option').should('have.length', 1)
	})

	it('can filter by mail', () => {
		mountSelect()

		cy.get('.cypress-search-input').scrollIntoView().type('olivia@example')
		cy.contains('.option', 'Olivia').should('exist')
		cy.document().find('.option').should('have.length', 1)
	})

	it('can filter by mail in ticks', () => {
		mountSelect()

		// Until this it should not be visible
		cy.get('.cypress-search-input').clear().type('O. <')
		cy.contains('.option', 'Olivia').should('not.exist')
		// now it should match
		cy.get('.cypress-search-input').type('olivia')
		cy.contains('.option', 'Olivia').should('exist')
		// and with full search query it should also exist
		cy.get('.cypress-search-input').type('@example.org>')
		cy.contains('.option', 'Olivia').should('exist')
		cy.document().find('.option').should('have.length', 1)
	})
})
