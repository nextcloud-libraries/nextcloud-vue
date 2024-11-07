/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */

import type { ConfigEnv } from 'vite'
import { mergeConfig } from 'vite'
import prefixwrap from 'postcss-prefixwrap'
import baseConfig from '../vite.config.ts'

export default async (env: ConfigEnv) => {
	const config = await baseConfig(env)
	return mergeConfig(config, {
		css: {
			postcss: {
				plugins: [
					prefixwrap('[data-server-root]', {
						whitelist: ["server.css", "apps.css"],
					}),
				],
			},
		}
	})
}
