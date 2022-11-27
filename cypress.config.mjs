import { defineConfig } from 'cypress'
import plugins from './cypress/plugins/index.mjs'
import viteConfig from './vite.config.mjs'

export default defineConfig({
	projectId: '3paxvy',
	viewportWidth: 1920,
	viewportHeight: 1080,
	defaultCommandTimeout: 6000,

	env: viteConfig.test.env,

	screenshotsFolder: 'cypress/snapshots/actual',
	trashAssetsBeforeRuns: true,

	component: {
		devServer: {
			framework: 'vue',
			bundler: 'vite',
			viteConfig,
		},
		specPattern: 'tests/visual/**/*.visual.*',
		setupNodeEvents(on, config) {
			return plugins(on, config)
		},
	},
})
