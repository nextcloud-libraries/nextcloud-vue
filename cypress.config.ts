import { defineConfig } from 'cypress'
import webpack from 'webpack'
import getCompareSnapshotsPlugin from 'cypress-visual-regression/dist/plugin.js'
import path from 'path'
import webpackConfig from '@nextcloud/webpack-vue-config'
import webpackRules from '@nextcloud/webpack-vue-config/rules.js'

const SCOPE_VERSION = Date.now();

(webpackRules.RULE_SCSS.use as webpack.RuleSetUse[]).push({
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
		SNAPSHOT_BASE_DIRECTORY: './cypress/snapshots/base',
		SNAPSHOT_DIFF_DIRECTORY: './cypress/snapshots/diff',
		INTEGRATION_FOLDER: 'cypress/visual/',
		trashAssetsBeforeRuns: true,
	},

	screenshotsFolder: './cypress/snapshots/actual',

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
				webpackConfig.plugins.push(new webpack.DefinePlugin({
					PRODUCTION: false,
					SCOPE_VERSION,
				}))

				return webpackConfig
			},
		},
	},
})
