/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */
import vuePlugin from '@vitejs/plugin-vue'
import { resolve } from 'path'
import prefixwrap from 'postcss-prefixwrap'
import { defineConfig } from 'vite'
import vueDocsPlugin from '../build/docs-plugin.ts'
import l10nPlugin from '../build/l10n-plugin.mjs'

/**
 * We need a custom vite config as storybook uses the HTML build
 * also our Nextcloud config sets some Nextcloud only settings like the built URL etc.
 */
export default defineConfig({
	plugins: [
		vueDocsPlugin,
		vuePlugin(),
		l10nPlugin(resolve(import.meta.dirname, '../l10n')),
	],
	build: {
		target: ['firefox140', 'chrome105'],
	},
	define: {
		appName: '"nextcloud-vue"',
		appVersion: '"current"',
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: '@use \'sass:math\'; @use \'variables\' as *; @use \'material-icons\' as *; $scope_version:ffab00;',
				sourceMapIncludeSources: false,
				loadPaths: [
					resolve(import.meta.dirname, '../src/assets'),
				],
			},
		},
		postcss: {
			plugins: [
				prefixwrap('[data-server-root]', {
					whitelist: ['server.css', 'apps.css'],
				}),
			],
		},
	},
})
