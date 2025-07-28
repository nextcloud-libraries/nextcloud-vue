/*!
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { StorybookConfig } from '@storybook/vue3-vite'
import { join } from 'path'

const config: StorybookConfig = {
	stories: ['../docs/**/*.mdx', '../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],

	addons: [
		// Document component usage and properties in Markdown
		'@storybook/addon-docs',
		// Links between stories
		'@storybook/addon-links',
	],

	framework: {
		name: '@storybook/vue3-vite',
		options: {
			builder: {
				viteConfigPath: join(__dirname, 'vite.config.ts'),
			},
			// vue-component-meta is recommended for Vue 3 and will be the default in the future
			docgen: 'vue-component-meta',
		},
	},
}

export default config
