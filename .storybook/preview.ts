/*!
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Preview } from '@storybook/vue3-vite'

import './styles.mock.ts'
import './http.mock.ts'
import './globals.mock.ts'

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		docs: {
			source: {
				codePanel: true,
			},
		},
	},

	decorators: [
		(_, { parameters }) => {
			const { pageLayout } = parameters
			// TODO: add layouts for app navigation/sidebar
			switch (pageLayout) {
				case 'root':
					return { template: `<div data-server-root><story/></div>` }
				case 'app-content':
				default:
					return { template: '<div data-server-root><div style="background: var(--color-main-background);" class="app-content"><story/></div></div>' }
			}
		},
	]
}

export default preview
