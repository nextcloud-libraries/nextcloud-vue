import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue2'

export default defineConfig({
	setupFile: './docs/histoire-setup.js',
	plugins: [
		HstVue(),
	],
	theme: {
		title: '@nextcloud/vue',
		// favicon: '/my-favicon.svg',
		// logo: {
		// 	square: '/src/img/logo-square.svg',
		// 	light: '/src/img/logo-light.svg',
		// 	dark: '/src/img/logo-dark.svg',
		// },
		// colors: {
		// 	primary: defaultColors.cyan,
		// },
		logoHref: 'https://github.com/nextcloud/nextcloud-vue',
	},
})
