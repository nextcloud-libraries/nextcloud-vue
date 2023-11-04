import type { Plugin } from 'vite'
import { createLibConfig } from '@nextcloud/vite-config'
import { globSync } from 'glob'
import { join, resolve } from 'node:path'
import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'

import md5 from 'md5'
import * as url from 'url'

import { loadTranslations } from './build/translations.js'

// `__dirname` not available on ES modules by default
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const appVersion = JSON.stringify(process.env.npm_package_version || 'nextcloud-vue')
const SCOPE_VERSION = md5(appVersion).slice(0, 7) as string
const TRANSLATIONS = await loadTranslations(resolve(__dirname, './l10n'))

// Entry points which we build using vite
const entryPoints = {
	...globSync('src/directives/*/index.js').reduce((acc, item) => {
		const name = item
			.replace('/index.js', '')
			.replace('src/directives/', 'Directives/')
		acc[name] = join(__dirname, item)
		return acc
	}, {}),

	// while migrating the components this is commented out and only the button is included

	...globSync('src/components/NcButton/index.js').reduce((acc, item) => {
		const name = item
	 		.replace('/index.js', '')
			.replace('src/components/', 'Components/')
		acc[name] = join(__dirname, item)
		return acc
	}, {}),

	// ...globSync('src/components/*/index.js').reduce((acc, item) => {
	// 	const name = item
	// 		.replace('/index.js', '')
	// 		.replace('src/components/', 'Components/')
	// 	acc[name] = join(__dirname, item)
	// 	return acc
	// }, {}),

	...globSync('src/functions/*/index.js').reduce((acc, item) => {
		const name = item
			.replace('/index.js', '')
			.replace('src/functions/', 'Functions/')
		acc[name] = join(__dirname, item)
		return acc
	}, {}),

	...globSync('src/mixins/*/index.js').reduce((acc, item) => {
		const name = item
			.replace('/index.js', '')
			.replace('src/mixins/', 'Mixins/')
		acc[name] = join(__dirname, item)
		return acc
	}, {}),

	index: resolve(__dirname, 'src/index.js'),
}

// Plugin for stripping out <docs> sections from vue files
const vueDocsPlugin: Plugin = {
	name: 'vue-docs-plugin',
	transform(code, id) {
		if (!/vue&type=doc/.test(id)) {
			return
		}
		return 'export default ""'
	},
}

// Customizations for the vite config
const overrides = defineConfig({
	plugins: [
		vueDocsPlugin,
	],
	css: {
		devSourcemap: true,
		preprocessorOptions: {
			scss: {
				additionalData: `@use 'sass:math'; $scope_version:${SCOPE_VERSION}; @import 'variables'; @import 'material-icons';`,
				sourceMapContents: false,
				includePaths: [
					resolve(__dirname, 'src/assets'),
				],
			},
		},
	},
	test: {
		environment: 'jsdom',
		setupFiles: resolve(__dirname, './tests/setup.js'),
		exclude:[
			...configDefaults.exclude,
			'./tests/unit/components/NcAppNavigation',
			'./tests/unit/components/NcAppSidebar',
			'./tests/unit/components/NcRichContenteditable',
			'./tests/unit/components/NcRichText',
			'./tests/unit/mixins/*',
		],
	},
})

// We need a callback config so we can access the vite build mode
export default defineConfig((env) => {

	const createConfig = createLibConfig(entryPoints, {
		// Add our overrides to the config
		config: overrides,
		// Packages with paths imports should be added here to mark them as external as well
		nodeExternalsOptions: {
			include: [/^vue-material-design-icons\//, /^@nextcloud\/.+\//, /^@mdi\/svg\//],
		},
		// For backwards compatibility we include the css within the js files
		inlineCSS: true,
		// Build CommonJS files for backwards compatibility
		libraryFormats: ['es', 'cjs'],
		replace: {
			PRODUCTION: JSON.stringify(env.mode === 'production'),
			SCOPE_VERSION: JSON.stringify(SCOPE_VERSION),
			TRANSLATIONS: ';' + JSON.stringify(TRANSLATIONS),
		},
	})

	return createConfig(env)
})
