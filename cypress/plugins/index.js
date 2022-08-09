// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const getCompareSnapshotsPlugin = require('cypress-visual-regression/dist/plugin')

const webpack = require('@cypress/webpack-preprocessor')
const { startDevServer } = require('@cypress/webpack-dev-server')

const webpackOptions = require('../../webpack.config.js')
webpackOptions.externals = {}

const options = {
	// send in the options from your webpack.config.js, so it works the same
	// as your app's code
	webpackOptions,
	watchOptions: {},
}

module.exports = (on, config) => {
	getCompareSnapshotsPlugin(on, config)
	on('file:preprocessor', webpack(options))

	on('dev-server:start', (options) => {
		return startDevServer({ options, webpackConfig: webpackOptions })
	  })

	// Disable spell checking to prevent rendering differences
	on('before:browser:launch', (browser, launchOptions) => {
		if (browser.family === 'chromium' && browser.name !== 'electron') {
			Object.assign(launchOptions.preferences.default, {
				browser: Object.assign(launchOptions.preferences.default.browser, { enable_spellchecking: false, enable_autospellcorrect: false }),
				spellcheck: Object.assign(launchOptions.preferences.default.spellcheck, { dictionary: [] }),
			})
			return launchOptions
		}

		if (browser.family === 'firefox') {
			launchOptions.preferences['layout.spellcheckDefault'] = 0
			return launchOptions
		}

		if (browser.name === 'electron') {
			Object.assign(launchOptions.preferences, {
				webPreferences: Object.assign(launchOptions.preferences.webPreferences, { spellcheck: false }),
			})
			return launchOptions
		}
	})
	return config
}
