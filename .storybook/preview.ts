/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Preview } from '@storybook/vue3'

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
	},

	decorators: [
    	(_, { parameters }) => {
			const { pageLayout } = parameters
			// TODO: add layouts for app navigation/sidebar
			switch (pageLayout) {
			default:
				return { template: '<story/>' };
			}
	  	},
	]
}

export default preview
