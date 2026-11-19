/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Plugin } from 'vite'

import { join } from 'node:path'
import { SERVER_STYLES_DIR, serverStyleFiles } from './viteShared.ts'

const VIRTUAL_ID = 'virtual:nextcloud-server-styles'

/**
 * Virtual module importing the styles of the Nextcloud server,
 * either of the current or of the oldest supported (legacy) Nextcloud version.
 */
export function serverStylesPlugin(): Plugin {
	return {
		name: 'nextcloud-vue-docs:server-styles',

		resolveId(id) {
			if (id === VIRTUAL_ID) {
				return '\0' + VIRTUAL_ID
			}
		},

		load(id) {
			if (id === '\0' + VIRTUAL_ID) {
				return serverStyleFiles
					.map((file) => `import ${JSON.stringify(join(SERVER_STYLES_DIR, file))}`)
					.join('\n')
			}
		},
	}
}
