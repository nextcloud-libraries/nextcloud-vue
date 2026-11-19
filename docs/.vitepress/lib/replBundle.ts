/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Plugin } from 'vite'

import { createReadStream, existsSync, statSync } from 'node:fs'
import { cp } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { DOCS } from './components.ts'

/** Output directory of the REPL bundle (see `repl/vite.config.ts`) */
export const REPL_DIST = join(DOCS, '.vitepress', 'repl-dist')

/**
 * Dependencies the examples can import in the REPL, with the info if they have a default export.
 * Besides those, examples can import `vue`, all entry points of the library and raw SVG icons of `@mdi/svg`.
 */
export const REPL_DEPENDENCIES: Record<string, boolean> = {
	'@mdi/js': false,
	'@nextcloud/axios': true,
	'@nextcloud/event-bus': false,
	'@nextcloud/files': false,
	'@nextcloud/files/upload': false,
	'@nextcloud/l10n': false,
	'@nextcloud/router': false,
}

/** Path the REPL bundle is served from */
export const REPL_PATH = '/repl/'

export interface ReplManifest {
	/** Import map of the REPL, relative to the REPL path */
	importMap: { imports: Record<string, string> }
	/** Style sheets to load in the REPL, relative to the REPL path */
	styles: string[]
	/** Classic scripts to load in the REPL before any module, relative to the REPL path */
	scripts: string[]
}

const MIME_TYPES: Record<string, string> = {
	'.css': 'text/css',
	'.js': 'text/javascript',
	'.json': 'application/json',
}

/**
 * Warn if the REPL bundle was not built
 */
function checkReplBundle(): boolean {
	if (!existsSync(join(REPL_DIST, 'repl.json'))) {
		// eslint-disable-next-line no-console -- Build time warning
		console.warn('[docs] The REPL bundle is missing, editing examples will not work. Run `npm run docs:repl` to build it.')
		return false
	}
	return true
}

/**
 * Serve the REPL bundle in the dev server
 */
export function replBundlePlugin(): Plugin {
	return {
		name: 'nextcloud-vue-docs:repl-bundle',

		configureServer(server) {
			checkReplBundle()
			server.middlewares.use(REPL_PATH, (req, res, next) => {
				const path = normalize(decodeURIComponent((req.url ?? '/').split('?')[0]!)).replace(/^(\.\.[/\\])+/, '')
				const file = join(REPL_DIST, path)
				if (!file.startsWith(REPL_DIST) || !existsSync(file) || !statSync(file).isFile()) {
					return next()
				}
				res.setHeader('Content-Type', MIME_TYPES[extname(file)] ?? 'application/octet-stream')
				createReadStream(file).pipe(res)
			})
		},
	}
}

/**
 * Copy the REPL bundle to the built documentation
 *
 * @param outDir - The output directory of the documentation
 */
export async function copyReplBundle(outDir: string) {
	if (checkReplBundle()) {
		await cp(REPL_DIST, join(outDir, REPL_PATH), { recursive: true })
	}
}
