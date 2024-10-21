import type { StorybookConfig } from '@storybook/vue3-vite'

const config: StorybookConfig = {
	stories: ['../docs/**/*.mdx', '../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

	addons: [
    	// Collection of essential addons like actions, controls, backgrounds, viewport, etc.
		'@storybook/addon-essentials',
    	// Links between stories
		'@storybook/addon-links',
    	// Allows to see and edit the source code of a story
		'@storybook/addon-storysource',
	],

	framework: {
		name: '@storybook/vue3-vite',
		options: {
			// vue-component-meta is recommended for Vue 3 and will be the default in the future
			docgen: 'vue-component-meta',
		},
	},
}

export default config
