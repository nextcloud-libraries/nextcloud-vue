import md5 from 'md5'
import vue from '@vitejs/plugin-vue'
import replace from '@rollup/plugin-replace'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import { externals } from 'rollup-plugin-node-externals'
import { loadTranslations } from './resources/translations.mjs'
import { fileURLToPath, URL } from 'url'
import { dirname, resolve } from 'path'
import { defineConfig } from 'vite'
import { readFileSync } from 'fs'

const loadJSON = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url)))

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const buildMode = process.env.NODE_ENV
const isDev = buildMode === 'development'

// scope variable
// fallback for cypress testing
const appVersion = JSON.stringify(process.env.npm_package_version || 'nextcloud-vue')
const SCOPE_VERSION = md5(appVersion).slice(0, 7)

console.info('This build version hash is', SCOPE_VERSION, '\n')

const globalVariables = {
	PRODUCTION: JSON.stringify(!isDev),
	TRANSLATIONS: JSON.stringify(loadTranslations(resolve(__dirname, './l10n'))),
	SCOPE_VERSION: JSON.stringify(SCOPE_VERSION),
}

// Plugin for stripping out <docs> sections from vue files
const vueDocsPlugin = {
	name: 'vue-i18n',
	transform(code, id) {
		if (!/vue&type=doc/.test(id)) {
			return
		}
		return 'export default ""'
	},
}

export default defineConfig({
	plugins: [
		externals(),
		replace({
			preventAssignment: true,
			delimiters: ['\\b', '\\b'],
			include: ['src/*', 'src/**/*'],
			values: globalVariables,
		}),
		vue(),
		vueDocsPlugin,
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
			'~': resolve(__dirname, './node_modules'),
		},
	},
	css: {
		devSourcemap: true,
		preprocessorOptions: {
			scss: {
				additionalData: `@use 'sass:math'; $scope_version:${SCOPE_VERSION}; @import 'variables'; @import 'material-icons';`,
				sourceMapContents: false,
				includePaths: [
					resolve(__dirname, './src/assets'),
				],
			},
		},
	},
	build: {
		target: browserslistToEsbuild(),
		sourcemap: true,
		rollupOptions: {
			external: [
				...Object.keys(loadJSON('./package.json').peerDependencies),
				...Object.keys(loadJSON('./package.json').dependencies),
			],
			output: {
				globals: {
					vue: 'vue',
				},
			},
		},
		lib: {
			name: 'NextcloudVue',
			entry: resolve(__dirname, 'src/index.js'),
			formats: ['es', 'cjs'],
			fileName: (format, entry) => {
				return `${entry}.${format === 'es' ? 'esm' : format}.js`
			},
		},
	},
	test: {
		environment: 'jsdom',
		setupFiles: resolve(__dirname, './tests/setup.js'),
	},
})
