/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { join } from 'node:path'
import { defineConfig, postcssIsolateStyles } from 'vitepress'
import packageJson from '../../package.json' with { type: 'json' }
import { DOCS } from './lib/components.ts'
import { componentsHotReloadPlugin } from './lib/componentsHotReload.ts'
import { examplesMarkdownPlugin, examplesVitePlugin } from './lib/examples.ts'
import { copyReplBundle, replBundlePlugin } from './lib/replBundle.ts'
import { scopeServerStyles } from './lib/scopeServerStyles.ts'
import { serverStylesPlugin } from './lib/serverStyles.ts'
import { componentsSidebar, pagesSidebar } from './lib/sidebar.ts'
import { defines, libraryAliases, libraryPlugins, scssOptions } from './lib/viteShared.ts'

/** There is no Nextcloud server, so the logo is used for all avatars */
const avatarProxy = {
	'/index.php/avatar': {
		target: 'https://raw.githubusercontent.com/nextcloud/promo/master/nextcloud-icon.png',
		changeOrigin: true,
		ignorePath: true,
		secure: false,
	},
}

export default defineConfig({
	title: 'Nextcloud Vue',
	description: 'Nextcloud UI Kit for building Nextcloud apps with Vue',
	lang: 'en-US',

	srcExclude: ['assets/**', 'REUSE.toml'],
	cleanUrls: true,
	lastUpdated: false,
	// The docs of the library are written for vue-styleguidist, which only resolves links within the page
	ignoreDeadLinks: true,

	head: [
		['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
	],

	vue: {
		template: {
			// Examples use images served from the public directory, like with vue-styleguidist
			transformAssetUrls: false,
		},
	},

	markdown: {
		config(md) {
			md.use(examplesMarkdownPlugin)
		},
	},

	themeConfig: {
		logo: '/logo/logo.svg',
		outline: [2, 3],
		search: {
			provider: 'local',
		},

		nav: [
			{ text: 'Components', link: '/components/', activeMatch: '/components/' },
			{ text: 'Composables', link: '/composables', activeMatch: '/composables' },
			{ text: 'Directives', link: '/directives', activeMatch: '/directives' },
			{ text: 'Functions', link: '/functions', activeMatch: '/functions' },
			{ text: 'Playground', link: '/playground' },
			{
				text: `v${packageJson.version}`,
				items: [
					{ text: 'v9 (Nextcloud 31+ on Vue 3)', link: 'https://nextcloud-vue-components.netlify.app' },
					{ text: 'v8 (Nextcloud 28+ on Vue 2)', link: 'https://stable8--nextcloud-vue-components.netlify.app' },
					{ text: 'Changelog', link: 'https://github.com/nextcloud-libraries/nextcloud-vue/blob/main/CHANGELOG.md' },
				],
			},
		],

		sidebar: [
			{ text: 'Introduction', link: '/' },
			{ text: 'Components', link: '/components/', items: componentsSidebar() },
			{ text: 'Composables', link: '/composables', collapsed: true, items: pagesSidebar('composables') },
			{ text: 'Directives', link: '/directives', collapsed: true, items: pagesSidebar('directives') },
			{ text: 'Functions', link: '/functions', collapsed: true, items: pagesSidebar('functions') },
		],

		socialLinks: [
			{ icon: 'github', link: 'https://github.com/nextcloud-libraries/nextcloud-vue' },
		],

		editLink: {
			// Component pages are generated from the documentation within the component
			pattern: ({ filePath, params }) => `https://github.com/nextcloud-libraries/nextcloud-vue/edit/main/${params?.source ?? `docs/${filePath}`}`,
		},
	},

	async buildEnd(siteConfig) {
		await copyReplBundle(siteConfig.outDir)
	},

	vite: {
		// Images used by the examples and by the server styles
		publicDir: join(DOCS, 'assets', 'img'),

		plugins: [
			...libraryPlugins(),
			examplesVitePlugin(),
			serverStylesPlugin(),
			replBundlePlugin(),
			componentsHotReloadPlugin(),
		],

		define: defines,

		resolve: {
			alias: [
				...libraryAliases,
				// Examples can use runtime compiled templates
				{ find: /^vue$/, replacement: 'vue/dist/vue.esm-bundler.js' },
			],
			dedupe: ['vue'],
		},

		css: {
			preprocessorOptions: {
				scss: scssOptions,
			},
			postcss: {
				plugins: [
					// Do not apply the styles of the documentation to the examples
					postcssIsolateStyles({ includeFiles: [/vp-doc\.css/, /base\.css/] }),
					// Do not apply the global styles of the server to the documentation
					scopeServerStyles(/docs\/assets\/(legacy\/)?(server|apps|icons)\.css$/),
				],
			},
		},

		server: { proxy: avatarProxy },
		preview: { proxy: avatarProxy },

		optimizeDeps: {
			exclude: ['@vue/repl'],
		},

		ssr: {
			// Needs to be processed by vite as it contains CSS imports
			noExternal: ['@vue/repl'],
		},
	},
})
