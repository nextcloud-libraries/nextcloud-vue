/**
 * @copyright Copyright (c) 2022 Vinicius Reis <vinicius@nextcloud.com>
 *
 * @author Vinicius Reis <vinicius@nextcloud.com>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

// https://github.com/alexanderwallin/node-gettext#usage
// https://github.com/alexanderwallin/node-gettext#load-and-add-translations-from-mo-or-po-files
const parseFile = async (fileName) => {
	// We need to import dependencies dynamically to support this module to be imported by vite and to be required by Cypress
	// If we use require, vite will fail with 'Dynamic require of "path" is not supported'
	// If we convert it to an ES module, webpack and vite are fine but Cypress will fail because it can not handle ES imports in Typescript configs in commonjs packages
	const { basename } = await import('path')
	const { readFile } = await import('fs/promises')
	const gettextParser = await import('gettext-parser')

	const locale = basename(fileName).slice(0, -'.pot'.length)
	const po = await readFile(fileName)

	const json = gettextParser.po.parse(po)

	// Compress translations Content
	const translations = {}
	for (const key in json.translations['']) {
		if (key !== '') {
			// Plural
			if ('msgid_plural' in json.translations[''][key]) {
				translations[json.translations[''][key].msgid] = {
					pluralId: json.translations[''][key].msgid_plural,
					msgstr: json.translations[''][key].msgstr,
				}
				continue
			}

			// Singular
			translations[json.translations[''][key].msgid] = json.translations[''][key].msgstr[0]
		}
	}

	return {
		locale,
		translations,
	}
}

const loadTranslations = async (baseDir) => {
	const { join } = await import('path')
	const { readdir } = await import('fs/promises')
	const files = await readdir(baseDir)

	const promises = files
		.filter(name => name !== 'messages.pot' && name.endsWith('.pot'))
		.map(file => join(baseDir, file))
		.map(parseFile)

	return Promise.all(promises)
}

module.exports = {
	loadTranslations,
}
