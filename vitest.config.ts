/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import viteConfig from './vite.config'

export default async (env) => {
	const config = typeof viteConfig === 'function' ? await viteConfig(env) : viteConfig

	return defineConfig({
		...config,
		test: {
			// ensure we have a consistent testing environment between local and CI
			env: {
				// used by Intl.* API
				LANG: 'en-US',
				// used by the Date API
				TZ: 'UTC',
			},
			environment: 'jsdom',
			setupFiles: resolve(__dirname, './tests/setup.js'),
			globalSetup: resolve(__dirname, './tests/global-setup.js'),
			exclude: [
				'tests/component/**',
				'node_modules/**',
				'docs/**',
			],
		},
	})
}
