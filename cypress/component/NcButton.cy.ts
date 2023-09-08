import { mount } from 'cypress/vue'
import NcButton from '../../src/components/NcButton/NcButton.vue'

describe('NcButton', () => {
	it('Text is rendered when provided', () => {
		mount(NcButton, {
			slots: {
			  default: 'Nextcloud',
			},
		})
		cy.get('span.button-vue__text').should('have.text', 'Nextcloud')
	})
})
