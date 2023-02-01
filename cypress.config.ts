import { defineConfig } from 'cypress'
import { DefinePlugin } from 'webpack'
import getCompareSnapshotsPlugin  from 'cypress-visual-regression/dist/plugin'
import path from 'path'
import webpackConfig from '@nextcloud/webpack-vue-config'
import webpackRules from '@nextcloud/webpack-vue-config/rules'

import { loadTranslations } from './resources/translations'

const SCOPE_VERSION = Date.now()
webpackRules.RULE_SCSS.use.push({
	loader: 'sass-loader',
	options: {
		additionalData: `@use 'sass:math'; $scope_version:${SCOPE_VERSION}; @import 'variables'; @import 'material-icons';`,
		/**
		 * ! needed for resolve-url-loader
		 */
		sourceMap: true,
		sassOptions: {
			sourceMapContents: false,
			includePaths: [
				path.resolve(__dirname, './src/assets'),
			],
		},
	},
})

webpackConfig.module.rules = Object.values(webpackRules)

export default defineConfig({
	projectId: '3paxvy',
	viewportWidth: 1920,
	viewportHeight: 1080,
	defaultCommandTimeout: 6000,

	env: {
		failSilently: false,
		type: 'actual',
		screenshotsFolder: './cypress/snapshots/actual',
		trashAssetsBeforeRuns: true,
	},

	component: {
		setupNodeEvents(on, config) {
			getCompareSnapshotsPlugin(on, config)

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
			bundler: 'webpack',
			webpackConfig: async () => {
				const translations = await loadTranslations(path.resolve(__dirname, './l10n'))
				webpackConfig.plugins.push(new DefinePlugin({
					PRODUCTION: false,
					SCOPE_VERSION,
					TRANSLATIONS: JSON.stringify(translations),
				}))

				return webpackConfig
			},
		},
	},
})
