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

import { join, basename } from 'path'
import { readdir, readFile } from 'fs/promises'
import { po as poParser } from 'gettext-parser'

// https://github.com/alexanderwallin/node-gettext#usage
// https://github.com/alexanderwallin/node-gettext#load-and-add-translations-from-mo-or-po-files
const parseFile = async (fileName) => {
	const locale = basename(fileName).slice(0, -'.pot'.length)
	const po = await readFile(fileName)

	// compress translations
	const json = Object.fromEntries(Object.entries(poParser.parse(po).translations[''])
		// Remove not translated string to save space
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		.filter(([_id, value]) => value.msgstr.length > 0 || value.msgstr[0] !== '')
		// Compress translations to remove duplicated information and reduce asset size
		.map(([id, value]) => [id, { ...(value.msgid_plural ? { p: value.msgid_plural } : {}), v: value.msgstr }]))
	return [locale, json] as const
}

export const loadTranslations = async (baseDir: string) => {
	const files = await readdir(baseDir)

	const promises = files
		.filter(name => name !== 'messages.pot' && name.endsWith('.pot'))
		.map(file => join(baseDir, file))
		.map(parseFile)

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return Object.fromEntries((await Promise.all(promises)).filter(([_locale, value]) => Object.keys(value).length > 0))
}
