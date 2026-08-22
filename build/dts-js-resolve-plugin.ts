/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */

import type { Plugin } from 'vite'

import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const RE_DTS = /\.d\.[cm]?ts$/
const RE_JS = /\.([cm]?)js$/

const sourceRoot = resolve(import.meta.dirname, '../src')

/**
 * Link declarations of plain JavaScript sources.
 *
 * `rolldown-plugin-dts` only rewrites an import to the declaration of its target
 * if that target is a Typescript, JSON or Vue file. For a plain `.js` source it
 * bails out, so the import is resolved by Rolldown instead and the emitted
 * declaration ends up importing the *JavaScript* chunk - which has no types.
 *
 * As long as `src/` contains Javascript files this plugin closes that gap by
 * resolving such imports to the declaration the plugin generated for them.
 *
 * @see https://github.com/sxzz/rolldown-plugin-dts/blob/main/src/resolver.ts
 */
export default function dtsJavascriptResolvePlugin(): Plugin {
	return {
		name: 'nextcloud-dts-javascript-resolve',
		enforce: 'pre',

		async resolveId(source, importer) {
			// Only imports within generated declarations are affected
			if (!importer || !RE_DTS.test(importer) || !RE_JS.test(source)) {
				return
			}
			// Only relative imports can point to our own sources
			if (!source.startsWith('.')) {
				return
			}

			// Only our own sources have generated declarations, dependencies ship theirs
			const target = resolve(dirname(importer), source)
			if (!target.startsWith(`${sourceRoot}/`) || !existsSync(target)) {
				return
			}

			// Make sure the declaration was generated for the Javascript source
			await this.load({ id: target })
			return target.replace(RE_JS, '.d.$1ts')
		},
	}
}
