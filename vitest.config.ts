/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import viteConfig from './vite.config'

export default async (env) => {
	const config = typeof viteConfig === 'function' ? await viteConfig(env) : viteConfig
	// node-externals conflicts with vitest
	config.plugins = config.plugins!.filter((plugin) => plugin && (!('name' in plugin) || plugin?.name !== 'node-externals'))

	return defineConfig({
		...config,
		test: {
			environment: 'jsdom',
			setupFiles: resolve(__dirname, './tests/setup.js'),
			exclude: [
				'tests/component/**',
				'node_modules/**',
				'docs/**',
			],
		},
	})
}
