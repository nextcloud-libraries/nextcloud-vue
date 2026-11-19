/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Alias, Plugin } from 'vite'

import { existsSync } from 'node:fs'
import { join } from 'node:path'
import dateFnsLocalesPlugin from '../../../build/date-fns-locales-plugin.mts'
import vueDocsPlugin from '../../../build/docs-plugin.ts'
import packageJson from '../../../package.json' with { type: 'json' }
import { applyHookFilters } from './applyHookFilters.ts'
import { DOCS, ROOT } from './components.ts'
import { resolveTsExtension } from './resolveTsExtension.ts'

export const SRC = join(ROOT, 'src')

/** Build the documentation with the styling of the oldest supported Nextcloud version */
export const isLegacy = !!process.env.NEXTCLOUD_LEGACY

/** Directory of the cached styles of the Nextcloud server */
export const SERVER_STYLES_DIR = join(DOCS, 'assets')

/**
 * The style files of the server, in the order they need to be loaded.
 * The light theme is the default theme (`default.css`), so it needs no separate styles.
 */
export const serverStyleFiles = (isLegacy
	? ['legacy/default.css', 'legacy/server.css', 'legacy/dark.css']
	: ['default.css', 'dark.css', 'server.css', 'apps.css'])
	.filter((file) => existsSync(join(SERVER_STYLES_DIR, file)))

/** Global constants used by the library and the docs runtime */
export const defines = {
	NEXTCLOUD_VERSION: JSON.stringify(isLegacy ? '31.0.0' : '35.0.0'),
	appVersion: JSON.stringify(packageJson.version),
	PRODUCTION: JSON.stringify(process.env.NODE_ENV === 'production'),
}

/** Use the sources of the library for all imports of the library */
export const libraryAliases: Alias[] = [
	{ find: /^@nextcloud\/vue$/, replacement: join(SRC, 'index.ts') },
	{ find: /^@nextcloud\/vue\/(components|composables|directives|functions)$/, replacement: join(SRC, '$1', 'index.ts') },
	{ find: /^@nextcloud\/vue\/(components|composables|directives|functions)\/(\w+)$/, replacement: join(SRC, '$1', '$2', 'index') },
]

/** Same Sass options as for the library build */
export const scssOptions = {
	api: 'modern-compiler' as const,
	additionalData: '@use "sass:math"; @use "variables" as *; @use "material-icons" as *;',
	loadPaths: [join(SRC, 'assets')],
}

/**
 * Plugins needed to build the sources of the library
 */
export function libraryPlugins(): Plugin[] {
	return [
		// Remove the documentation blocks from the components
		vueDocsPlugin,
		applyHookFilters(dateFnsLocalesPlugin()),
		resolveTsExtension(),
	]
}
