/**
 * SPDX-FileCopyrightText: Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Plugin } from 'vite'

import { readFileSync } from 'fs'
import { dirname, join, resolve } from 'path'
import { loadTranslations } from './translations.mts'

/**
 * This is a plugin to split all translations into chunks of users meaning components that use that translation
 * If a file imports `t` or `n` from 'l10n.js' that import will be replaced with a wrapper that registeres only the required translations for the file that imports the functions.
 * Allowing vite to treeshake all not needed translations when building applications
 *
 * @param dir Path to the l10n directory for loading the translations
 */
export default (dir: string) => {
	// mapping from filesnames -> variable name
	let nameMap: Record<string, string>
	// all loaded translations, as filenames ->
	const translations: Record<string, { l: string, t: Record<string, { v: string[], p?: string }> }[]> = {}
	let l10nRegistrationCode: string

	return {
		name: 'nextcloud-l10n-plugin',
		enforce: 'pre',

		/**
		 * Prepare l10n loading once the building start, this loads all translations and splits them into chunks by their usage in the components.
		 */
		async buildStart() {
			this.info('[l10n] Loading registration code')
			const l10nRegistrationPath = join(import.meta.dirname, 'l10n-registration-implementation.js')
			l10nRegistrationCode = readFileSync(l10nRegistrationPath).toString()
			this.info('[l10n] Loading translations')
			// all translations for all languages and components
			const allTranslations = await loadTranslations(dir)

			this.info('[l10n] Loading translation mapping for components')
			// mapping which files (filename:filename2:filename3) contain which message ids
			const context = (await import('./extract-l10n.mjs')).context
			nameMap = Object.fromEntries(Object.keys(context).map((key, index) => [key, `t${index}`]))

			this.info('[l10n] Building translation chunks for components')
			// This will split translations in a map like "using file(s)" => {locale, translations}
			for (const locale in allTranslations) {
				const currentTranslations = allTranslations[locale]
				for (const [usage, msgIds] of Object.entries(context)) {
					if (!(usage in translations)) {
						translations[usage] = []
					}
					// split the translations by usage in components
					translations[usage].push({
						l: locale,
						// We simply filter those translations whos msg IDs are used by current context
						// eslint-disable-next-line @typescript-eslint/no-unused-vars
						t: Object.fromEntries(Object.entries(currentTranslations).filter(([id, _value]) => msgIds.includes(id))),
					})
				}
			}
		},

		/**
		 * Hook into module resolver and fake all '../[...]/l10n.js' imports to inject our splitted translations
		 * @param source The file which is imported
		 * @param importer The file that imported the file
		 */
		resolveId(source, importer) {
			if (source.startsWith('\0')) {
				if (source === '\0l10n') {
					// return our l10n main module containing all translations
					return '\0l10n'
				}
				// dont handle other plugins imports
				return null
			} else if (source.endsWith('l10n.js') && importer && !importer.includes('node_modules')) {
				if (dirname(resolve(dirname(importer), source)).split('/').at(-1) === 'src') {
					// return our wrapper for handling the import
					return `\0l10nwrapper?source=${encodeURIComponent(importer)}`
				}
			}
		},

		/**
		 * This function injects the translation chunks by returning a module that exports one translation object per component
		 * @param id The name of the module that should be loaded
		 */
		load(id) {
			const match = id.match(/\0l10nwrapper\?source=(.+)/)
			if (match) {
				// In case this is the wrapper module we provide a module that imports only the required translations and exports t and n functions
				const source = decodeURIComponent(match[1])
				// filter function to check the paths (files that use this translation) includes the current source
				const filterByPath = (paths: string) => paths.split(':').some((path) => source.endsWith(path))
				// All translations that need to be imported for the current source
				const imports = Object.entries(nameMap)
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					.filter(([paths, _value]) => filterByPath(paths))
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					.map(([paths, alias]) => alias)
				return `import {t,n,register,${imports.join(',')}} from '\0l10n';register(${imports.join(',')});export {t,n};`
			} else if (id === '\0l10n') {
				// exports are all chunked translations
				const exports = Object.entries(nameMap).map(([usage, id]) => `export const ${id} = ${JSON.stringify(translations[usage])}`).join(';\n')
				return `${l10nRegistrationCode}\n${exports}`
			}
		},
	} as Plugin
}
