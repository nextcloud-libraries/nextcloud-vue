import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue2'

export default defineConfig({
	setupFile: './docs/histoire-setup.js',
	plugins: [
		HstVue(),
	],
	theme: {
		title: '@nextcloud/vue',
		logoHref: 'https://github.com/nextcloud/nextcloud-vue',
	},
})
