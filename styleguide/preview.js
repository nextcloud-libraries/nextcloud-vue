/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Focus, Linkify } from '../src/directives/index.ts'

// Style guide only: every page starts at the top in the filter input, and an
// example that focuses an element while rendering does not take the focus - that
// would also scroll the page to the example. The directive is patched instead of
// registered, because components like NcAppSidebar register it locally.
const filterInput = 'input[aria-label="Filter by name"]'
const pageContainer = '[class*="rsg--hasSidebar"]'

/**
 * Focus the filter input without scrolling the navigation back to the top.
 *
 * @return {boolean} whether the filter input was found
 */
function focusFilterInput() {
	const input = document.querySelector(filterInput)
	input?.focus({ preventScroll: true })
	return Boolean(input)
}

/**
 * Start a page at the top with the focus in the filter input.
 */
function startPage() {
	document.querySelector(pageContainer)?.scrollTo(0, 0)
	focusFilterInput()
}

window.addEventListener('load', startPage)
window.addEventListener('hashchange', startPage)

Focus.mounted = (el) => {
	const example = el.closest('[data-preview]')
	const takesFocus = example && !example.contains(document.activeElement)
	if (!takesFocus || !focusFilterInput()) {
		el.focus()
	}
}

// The export here MUST be default or module.export
// this is what is imported by the styleguide
export default (app) => {
	app.directive('focus', Focus)
	app.directive('linkify', Linkify)
	// An example is rendered, not opened by the user, so it must not return the
	// focus to the filter input - NcAppSidebar would scroll the page to itself.
	app.mixin({
		mounted() {
			if (this.elementToReturnFocus) {
				this.elementToReturnFocus = null
			}
		},
	})
}
