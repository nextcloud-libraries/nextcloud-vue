import type { StorybookConfig } from '@storybook/vue3-vite'

const config = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@chromatic-com/storybook',
		'@storybook/addon-interactions',
		'storybook-addon-vue-slots',
	],
	framework: {
		name: '@storybook/vue3-vite',
		options: {
			docgen: 'vue-component-meta',
		},
	},
	docs: {
		autodocs: 'tag',
	},
} satisfies StorybookConfig

export default config
