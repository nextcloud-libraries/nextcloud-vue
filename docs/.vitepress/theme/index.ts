/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Theme } from 'vitepress'

import DefaultTheme from 'vitepress/theme'
import DocsLayout from './DocsLayout.vue'
import NcExample from './NcExample.vue'

// Theming variables and global styles (scoped to the examples) of the Nextcloud server
import 'virtual:nextcloud-server-styles'
import './style.css'

export default {
	extends: DefaultTheme,
	Layout: DocsLayout,

	async enhanceApp({ app }) {
		app.component('NcExample', NcExample)

		// The library is only used by the examples, which are only rendered in the browser.
		if (!import.meta.env.SSR) {
			// The globals are loaded on their own, as bundling could otherwise
			// move the library modules before the globals they depend on.
			await import('../runtime/globals.js')
			const { install } = await import('../runtime/index.js')
			install(app)
		}
	},
} satisfies Theme
