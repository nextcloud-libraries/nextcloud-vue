/**
 * @copyright Copyright (c) 2022 Vinicius Reis <vinicius@nextcloud.com>
 *
 * @author Vinicius Reis <vinicius@nextcloud.com>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import commonjs from 'vite-plugin-commonjs'
import md5 from 'md5'
import { dependencies, version } from './package.json'
import { loadTranslations } from './resources/translations.js'

const versionHash = md5(version).slice(0, 7)
const SCOPE_VERSION = JSON.stringify(versionHash)

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const external = [
	...Object.keys(dependencies),
	/vue-material-design-icons\/.*/,
]

const vueDoc = {
	name: 'vue-doc',
	transform(code, id) {
		if (/vue&type=docs/.test(id)) {
			return 'export default null' // just ignore doc blocks
		}

		return code
	},
}

export default async () => {
	const translations = await loadTranslations(resolve(__dirname, './l10n'))

	return defineConfig({
		plugins: [vue(), commonjs, vueDoc],
		define: {
			SCOPE_VERSION,
			TRANSLATIONS: JSON.stringify(translations),
		},
		alias: {
			'@': resolve(__dirname, './src'),
		},
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `@use 'sass:math';\n$scope_version:${SCOPE_VERSION};\n@import 'variables';\n@import 'material-icons';\n`,
					includePaths: [
						resolve(__dirname, './src/assets'),
					],
				},
			},
		},
		build: {
			outDir: './dist',
			lib: {
				entry: resolve(__dirname, 'src/index.js'),
				name: '@nextcloud/vue',
				fileName: (format) => `index.${format}.js`,
				formats: ['es', 'cjs'],
			},
			rollupOptions: {
				external,
				output: {
					globals: { vue: 'Vue' },
				},
			},
			minify: false,
		},
	})
}
