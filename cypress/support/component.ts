// ***********************************************************
// This example support/component.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// setup styles
import '../../styleguide/assets/default.css'
import '../../styleguide/assets/additional.css'
import '../../styleguide/assets/icons.css'

// cypress commands
import './commands'
import { mount } from '@cypress/vue2'

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Cypress {
		interface Chainable {
			mount: typeof mount
		}
	}
}

// Example use:
// cy.mount(MyComponent)
Cypress.Commands.add('mount', mount)
