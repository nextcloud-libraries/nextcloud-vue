/* eslint-disable n/no-extraneous-import */
/*!
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */
import { defineConfig, devices } from '@playwright/experimental-ct-vue'
import { resolve } from 'node:path'

// Configure projects for major browsers
const projects = [
	{
		name: 'chromium',
		use: { ...devices['Desktop Chrome'] },
	},
	{
		name: 'firefox',
		use: { ...devices['Desktop Firefox'] },
	},
]
// This requires Debian or Ubuntu system so do not run by default locally
if (process.env.CI) {
	projects.push({
		name: 'webkit',
		use: { ...devices['Desktop Safari'] },
	})
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: 'tests/component',
	/* The base directory, relative to the config file, for snapshot files created with toMatchSnapshot and toHaveScreenshot. */
	snapshotDir: 'tests/component/snapshots',
	/* Maximum time one test can run for. */
	timeout: 10 * 1000,
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,

	// On CI we are using the github annotations + blob which will be merged by workflow to a downloadable HTML report (like the one we receive locally)
	reporter: process.env.CI ? 'blob' : 'html',

	use: {
		// for consistent visual tests
		colorScheme: 'light',

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: 'on-first-retry',

		/* Port to use for Playwright component endpoint. */
		ctPort: 3100,

		ctTemplateDir: 'tests/component/setup',

		ctViteConfig: async () => ({
			plugins: [
				// normally added by default but we overwrite the plugins so we need to add it back manually
				(await import('@vitejs/plugin-vue')).default(),
				// We do have some dependencies that use node modules -> we need to polyfill
				(await import('vite-plugin-node-polyfills')).nodePolyfills(),
				// We need to strip off the docs sections for the vue plugin
				(await import('./vite.config')).vueDocsPlugin,
			],
			define: {
				PRODUCTION: 'false',
				SCOPE_VERSION: '"testing"',
			},
			css: {
				devSourcemap: false,
				preprocessorOptions: {
					scss: {
						additionalData: '@use \'sass:math\'; @use \'variables\' as *; @use \'material-icons\' as *; $scope_version:abcdef;',
						sourceMapContents: false,
						loadPaths: [
							resolve(import.meta.dirname, 'src/assets'),
						],
					},
				},
			},
		}),
	},

	projects,
})
