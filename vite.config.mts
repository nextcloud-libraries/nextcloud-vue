import type { Plugin } from 'vite'
import { createLibConfig } from '@susnux/nextcloud-vite-config'
import { resolve } from 'path'
import { defineConfig } from 'vite'

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
	build: {
		// Vite is run second so do not remove webpack files
		emptyOutDir: false,
	},
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
			SCOPE_VERSION,
			TRANSLATIONS: ';' + JSON.stringify(TRANSLATIONS),
		},
	})

	return createConfig(env)
})
