/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import * as components from '@nextcloud/vue/components'
import { Focus, Linkify } from '@nextcloud/vue/directives'

// All examples of a page render at once, so an example must only take the focus
// when the user works in it. Otherwise the page scrolls to that example.
// Patched instead of registered, because components like NcAppSidebar register it locally.
Focus.mounted = (el) => {
	const example = el.closest('.nc-example__preview')
	if (!example || example.contains(document.activeElement)) {
		el.focus()
	}
}

/**
 * Register everything examples can use without importing it.
 * Like with vue-styleguidist all components of the library are registered globally.
 *
 * @param {import('vue').App} app - The Vue app
 */
export function install(app) {
	app.directive('focus', Focus)
	app.directive('linkify', Linkify)

	for (const [name, component] of Object.entries(components)) {
		app.component(name, component)
	}
}
