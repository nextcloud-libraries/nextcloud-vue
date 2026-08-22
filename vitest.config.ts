/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'
import viteConfig from './vite.config.ts'

export default defineConfig(async (env) => {
	const config = typeof viteConfig === 'function' ? await viteConfig(env) : viteConfig

	return defineConfig({
		...config,
		// Vitest merges the config with the vite config,
		// which concatenates the "target" array causing ocx to fail because of duplicated entries.
		// ref: https://github.com/vitest-dev/vitest/issues/11035
		oxc: {
			...config.oxc,
			target: 'esnext',
		},
		test: {
			// ensure we have a consistent testing environment between local and CI
			env: {
				// used by Intl.* API
				LANG: 'en-US',
				// used by the Date API
				TZ: 'UTC',
			},
			environment: 'jsdom',
			setupFiles: resolve(import.meta.dirname, './tests/setup.js'),
			globalSetup: resolve(import.meta.dirname, './tests/global-setup.js'),
			exclude: [
				'tests/component/**',
				'node_modules/**',
				'docs/**',
			],
			// @nextcloud/vue-select's ESM bundle imports its own CSS inline
			// (`import './assets/*.css'` at the top of dist/index.mjs). Routing
			// it through Vite's transform pipeline lets the CSS import be
			// handled instead of reaching Node's native ESM loader.
			server: {
				deps: {
					inline: ['@nextcloud/vue-select'],
				},
			},
		},
	})
})
