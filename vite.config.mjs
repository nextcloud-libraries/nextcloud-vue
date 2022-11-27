import md5 from 'md5'
import glob from 'glob'
import vue from '@vitejs/plugin-vue2'
import { externals } from 'rollup-plugin-node-externals'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import injectProcessEnv from 'rollup-plugin-inject-process-env'
import { loadTranslations } from './resources/translations.mjs'
import { fileURLToPath, URL } from 'url'
import { dirname, join, resolve } from 'path'
import { defineConfig } from 'vite'
import { readFileSync } from 'fs'

const loadJSON = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url)))

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// scope variable
// fallback for cypress testing
const appVersion = JSON.stringify(process.env.npm_package_version || 'nextcloud-vue')
const SCOPE_VERSION = md5(appVersion).slice(0, 7)

console.info('This build version hash is', SCOPE_VERSION, '\n')

const processEnvironment = {
	TRANSLATIONS: loadTranslations(resolve(__dirname, './l10n')),
	SCOPE_VERSION,
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
	test: {
		environment: 'jsdom',
		setupFiles: resolve(__dirname, './tests/setup.js'),
		env: processEnvironment,
	},
	build: {
		target: browserslistToEsbuild(),
		sourcemap: true,
		rollupOptions: {
			plugins: [
				externals(),
				injectProcessEnv(processEnvironment),
			],
			external: [
				...Object.keys(loadJSON('./package.json').peerDependencies),
			],
			output: {
				chunkFileNames: (n) => n.isEntry ? n.name : `common/${n.name}${n.name.endsWith('.es') ? 'm' : ''}.js`,
			},
		},
		lib: {
			name: 'NextcloudVue',
			entry: {
				index: resolve(__dirname, 'src/index.js'),
				install: join(__dirname, 'src', 'install.js'),
				...glob.sync('src/components/*/index.js').reduce((acc, item) => {
					const name = item
						.replace('/index.js', '')
						.replace('src/components/', 'Components/')
					acc[name] = join(__dirname, item)
					return acc
				}, {}),
				...glob.sync('src/directives/*/index.js').reduce((acc, item) => {
					const name = item
						.replace('/index.js', '')
						.replace('src/directives/', 'Directives/')
					acc[name] = join(__dirname, item)
					return acc
				}, {}),
				...glob.sync('src/functions/*/index.js').reduce((acc, item) => {
					const name = item
						.replace('/index.js', '')
						.replace('src/functions/', 'Functions/')
					acc[name] = join(__dirname, item)
					return acc
				}, {}),
				...glob.sync('src/mixins/*/index.js').reduce((acc, item) => {
					const name = item
						.replace('/index.js', '')
						.replace('src/mixins/', 'Mixins/')
					acc[name] = join(__dirname, item)
					return acc
				}, {}),
			},
			fileName: (format, entry) => {
				return `${entry}.${format.startsWith('es') ? 'mjs' : format}`
			},
		},
	},
})
