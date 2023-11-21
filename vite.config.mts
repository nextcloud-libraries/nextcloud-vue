import type { Plugin } from 'vite'
import { createLibConfig } from '@nextcloud/vite-config'
import { globSync } from 'glob'
import { join, resolve } from 'node:path'
import { defineConfig } from 'vite'

import md5 from 'md5'
import * as url from 'url'

import l10nPlugin from './build/l10n-plugin.mts'

// `__dirname` not available on ES modules by default
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const appVersion = JSON.stringify(process.env.npm_package_version || 'nextcloud-vue')
const SCOPE_VERSION = md5(appVersion).slice(0, 7) as string

// Entry points which we build using vite
const entryPoints = {
	...globSync('src/components/*/index.js').reduce((acc, item) => {
		const name = item
			.replace('/index.js', '')
			.replace('src/components/', 'Components/')
		acc[name] = join(__dirname, item)
		return acc
	}, {}),

	...globSync('src/directives/*/index.js').reduce((acc, item) => {
		const name = item
			.replace('/index.js', '')
			.replace('src/directives/', 'Directives/')
		acc[name] = join(__dirname, item)
		return acc
	}, {}),

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

	...globSync('src/composables/*/index.js').reduce((acc, item) => {
		const name = item
			.replace('/index.js', '')
			.replace('src/composables/', 'Composables/')
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
		l10nPlugin(resolve(__dirname, 'l10n')),
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
})

// We need a callback config so we can access the vite build mode
export default defineConfig((env) => {

	const createConfig = createLibConfig(entryPoints, {
		// Add our overrides to the config
		config: overrides,
		// By default all dependencies are external, but no path imports
		nodeExternalsOptions: {
			// Packages with paths imports should be added here to mark them as external as well
			include: [/^@nextcloud\/.+\//, /^@mdi\/svg\//],
			// Make sure to not provide uncompiled vue files as dependencies, this will break unit tests
			exclude: [/\.vue(\?|$)/],
		},
		// For backwards compatibility we include the css within the js files
		inlineCSS: true,
		// Build CommonJS files for backwards compatibility
		libraryFormats: ['es', 'cjs'],
		replace: {
			PRODUCTION: JSON.stringify(env.mode === 'production'),
			SCOPE_VERSION: JSON.stringify(SCOPE_VERSION),
		},
	})

	return createConfig(env)
})
