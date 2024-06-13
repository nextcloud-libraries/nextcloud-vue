/**
 * SPDX-FileCopyrightText: Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

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
