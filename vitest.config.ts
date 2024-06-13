/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { UserConfig } from 'vite'
import { resolve } from 'node:path'
import viteConfig from './vite.config'

export default async (env) => {
	const config = typeof viteConfig === 'function' ? await viteConfig(env) : viteConfig
	// node-externals conflicts with vitest
	config.plugins = config.plugins!.filter((plugin) => plugin && (!('name' in plugin) || plugin?.name !== 'node-externals'))

	return {
		...config,
		test: {
			environment: 'jsdom',
			setupFiles: resolve(__dirname, './tests/setup.js'),
		},
	} as UserConfig
}
