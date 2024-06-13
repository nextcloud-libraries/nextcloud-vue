/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
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
