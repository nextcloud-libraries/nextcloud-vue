/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */
import { defineConfig } from 'cypress'
import { configureVisualRegression } from 'cypress-visual-regression/dist/plugin'

export default defineConfig({
	projectId: '3paxvy',
	viewportWidth: 1920,
	viewportHeight: 1080,
	defaultCommandTimeout: 6000,

	env: {
		visualRegressionType: 'regression',
		visualRegressionBaseDirectory: 'cypress/snapshots/base',
		visualRegressionDiffDirectory: 'cypress/snapshots/diff',
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
			viteConfig: {
				configFile: 'vite.config.ts',
				// Ensure we use the runtime compiler of vue
				resolve: {
					alias: {
						vue: 'vue/dist/vue.esm-bundler.js',
					},
				},
			},
		},
	},
})
