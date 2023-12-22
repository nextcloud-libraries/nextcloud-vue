import { defineConfig } from 'cypress'
import getCompareSnapshotsPlugin from 'cypress-visual-regression/dist/plugin'

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

		excludeSpecPattern: [
			'cypress/visual/AppNavigationItem.cy.ts',
		],


		devServer: {
			framework: 'vue',
			bundler: 'vite',
		},
	},
})
