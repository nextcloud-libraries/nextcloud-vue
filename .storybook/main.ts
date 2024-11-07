import type { StorybookConfig } from '@storybook/vue3-vite'
import { join } from 'path'

const config: StorybookConfig = {
	stories: ['../docs/**/*.mdx', '../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

	addons: [
		// Collection of essential addons like actions, controls, backgrounds, viewport, etc.
		'@storybook/addon-essentials',
		// Links between stories
		'@storybook/addon-links',
		// Document component usage and properties in Markdown
		'@storybook/addon-docs',
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
