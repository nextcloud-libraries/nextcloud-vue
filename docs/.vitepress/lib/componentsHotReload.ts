/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Plugin } from 'vite'

import { join } from 'node:path'
import { DOCS, ROOT } from './components.ts'

/**
 * Update the component pages when a component changes in the dev server.
 *
 * VitePress only updates dynamic routes when their paths file or its imports change,
 * but the component pages are generated from the components.
 * So a change of a component is forwarded as a change of the paths file.
 */
export function componentsHotReloadPlugin(): Plugin {
	const componentsDir = join(ROOT, 'src', 'components')
	const pathsFile = join(DOCS, 'components', '[component].paths.ts')

	return {
		name: 'nextcloud-vue-docs:components-hot-reload',
		apply: 'serve',

		configureServer(server) {
			server.watcher.add(componentsDir)
			server.watcher.on('change', (file) => {
				if (file.startsWith(componentsDir) && file.endsWith('.vue')) {
					server.watcher.emit('change', pathsFile)
				}
			})
		},
	}
}
