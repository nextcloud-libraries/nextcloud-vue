/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */
import type { Plugin } from 'vite'

import { exactRegex } from '@rolldown/pluginutils'
import { glob } from 'fs/promises'
import { createRequire } from 'module'
import { dirname, join } from 'path'

/**
 * This plugin generates a module that can be used to dynamically load locales from `date-fns`.
 * It generates it in a way that it works with the externalization of the `date-fns` locales
 * and with Vite and Webpack apps.
 *
 * A plugin is used because Vite's dynamic imports and glob imports cannot generate imports in such a way.
 */
export default () => {
	let localeFiles: string[] = []
	const virtualModuleId = 'virtual:date-fns-locales'
	const resolvedVirtualModuleId = '\0' + virtualModuleId
	return {
		name: 'date-fns-locales-plugin',
		enforce: 'pre',
		async buildStart() {
			this.info('Collectioning locales in date-fns/locales')
			const require = createRequire(import.meta.url)
			const pkgJsonPath = require.resolve('date-fns/package.json')
			const localeDir = join(dirname(pkgJsonPath), 'locale')
			localeFiles = await Array.fromAsync(glob('*.js', {
				cwd: localeDir,
				exclude: ['types.js', 'en-US.js', 'cdn.js', 'cdn.min.js'],
			}))
		},
		resolveId: {
			filter: { id: /dateFnsLocaleLoader\.ts$/ },
			handler() {
				return resolvedVirtualModuleId
			},
		},
		load: {
			filter: { id: exactRegex(resolvedVirtualModuleId) },
			handler() {
				let content = ''
				content += 'const loader = {}\n'
				content += 'export default loader\n'
				for (const localeFile of localeFiles) {
					// e.g., "pt-BR.js" -> "pt-BR"
					const localeCode = localeFile.slice(0, -3)
					let exportName = localeCode.replaceAll('-', '')
					// One locale is named inconsistently...
					if (localeCode === 'be-tarask') {
						exportName = 'beTarasak'
					}
					content += `loader['${localeCode}'] = async () => (await import('date-fns/locale/${localeCode}')).${exportName}\n`
				}
				return content
			},
		},
	} as Plugin
}
