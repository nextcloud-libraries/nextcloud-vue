/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */

import { createAppConfig } from '@nextcloud/vite-config'
import { defineConfig } from 'cypress'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { configureVisualRegression } from 'cypress-visual-regression'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const SCOPE_VERSION = Date.now().toString()

export default defineConfig({
	projectId: '3paxvy',
	viewportWidth: 1920,
	viewportHeight: 1080,
	defaultCommandTimeout: 6000,

	env: {
		visualRegressionType: 'regression',
		visualRegressionBaseDirectory: './cypress/snapshots/base',
		visualRegressionDiffDirectory: './cypress/snapshots/diff',
		visualRegressionGenerateDiff: true,
		visualRegressionFailSilently: false,
	},

	screenshotsFolder: './cypress/snapshots/actual',

	component: {
		setupNodeEvents(on) {
			configureVisualRegression(on)

			// Disable spell checking to prevent rendering differences
			on('before:browser:launch', (browser, launchOptions) => {
				if (browser.family === 'chromium' && browser.name !== 'electron') {
					launchOptions.preferences.default['browser.enable_spellchecking'] = false
					return launchOptions
				}

				if (browser.family === 'firefox') {
					launchOptions.preferences['layout.spellcheckDefault'] = 0
					return launchOptions
				}

				if (browser.name === 'electron') {
					launchOptions.preferences.spellcheck = false
					return launchOptions
				}
			})

		},

		devServer: {
			framework: 'vue',
			bundler: 'vite',
			viteConfig: async () => {
				const vueDocsPlugin = {
					name: 'vue-docs-plugin',
					transform(code, id) {
						if (!/vue&type=doc/.test(id)) {
							return
						}
						return 'export default ""'
					},
				}
				const config = await createAppConfig({}, {
					inlineCSS: true,
					replace: {
						PRODUCTION: 'false',
						SCOPE_VERSION,
					},
					config: {
						plugins: [vueDocsPlugin],
						define: {
							NEXTCLOUD_VERSION: '"32.0.0"',
						},
						css: {
							devSourcemap: true,
							preprocessorOptions: {
								scss: {
									additionalData: `@use 'sass:math'; @use 'variables.scss' as *; @use 'material-icons.css' as *; $scope_version:${SCOPE_VERSION};`,
									sourceMapContents: false,
									loadPaths: [
										resolve(__dirname, 'src/assets'),
									],
								},
							},
						},
					},
				})({ mode: 'production', command: 'serve' })

				return config
			},
		},
	},
})
