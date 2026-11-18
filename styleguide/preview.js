/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Focus, Linkify } from '../src/directives/index.ts'

// All examples of a page render at once, so an example must only take the focus
// when the user works in it. Otherwise the page scrolls to that example.
// Patched instead of registered, because components like NcAppSidebar register it locally.
Focus.mounted = (el) => {
	const example = el.closest('[data-preview]')
	if (!example || example.contains(document.activeElement)) {
		el.focus()
	}
}

// Open a page without focus, like on page load. Otherwise examples like
// NcAppSidebar see the focused link as the opener and take the focus.
document.addEventListener('click', (event) => event.target.closest?.('a[href^="/#/"]')?.blur(), true)

// The export here MUST be default or module.export
// this is what is imported by the styleguide
export default (app) => {
	app.directive('focus', Focus)
	app.directive('linkify', Linkify)
}
