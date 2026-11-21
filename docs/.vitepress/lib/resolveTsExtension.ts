/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Plugin } from 'vite'

/**
 * Resolve relative `.js` imports to `.ts` files also for JavaScript importers.
 * The library imports TypeScript files with the `.js` extension, Vite 5 only resolves those from TypeScript files.
 */
export function resolveTsExtension(): Plugin {
	return {
		name: 'nextcloud-vue-docs:resolve-ts-extension',
		enforce: 'pre',

		async resolveId(source, importer, options) {
			if (!importer || !/^\.\.?\/.*\.js$/.test(source)) {
				return
			}
			const resolved = await this.resolve(source, importer, { ...options, skipSelf: true })
			return resolved ?? this.resolve(source.replace(/\.js$/, '.ts'), importer, { ...options, skipSelf: true })
		},
	}
}
