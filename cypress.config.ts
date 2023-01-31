import { defineConfig } from 'cypress'
import getCompareSnapshotsPlugin  from 'cypress-visual-regression/dist/plugin'

import viteConfig from './vite.config.mjs'

export default defineConfig({
	projectId: '3paxvy',
	viewportWidth: 1920,
	viewportHeight: 1080,
	defaultCommandTimeout: 6000,

	env: {
		failSilently: false,
		type: 'actual',
	},

	screenshotsFolder: 'cypress/snapshots/actual',
	trashAssetsBeforeRuns: true,

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
			bundler: 'vite',
			viteConfig,
		},
	},
})
