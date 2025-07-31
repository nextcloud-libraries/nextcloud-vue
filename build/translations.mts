/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { readdir, readFile } from 'fs/promises'
import { po as poParser } from 'gettext-parser'
import { basename, join } from 'path'

/**
 * @param baseDir
 */
export async function loadTranslations(baseDir: string) {
	const files = await readdir(baseDir)

	const promises = files
		.filter((name) => name !== 'messages.pot' && name.endsWith('.pot'))
		.map((file) => join(baseDir, file))
		.map(parseFile)

	const parsedTranslations = await Promise.all(promises)
	// In `parseFile` reduced the returned translations to only available.
	// In that process some languages can be stripped completely resulting in an empty translation set.
	// Those languages need to be filtered now.
	const nonEmptyTranslations = parsedTranslations.filter(([, value]) => Object.keys(value).length > 0)

	return Object.fromEntries(nonEmptyTranslations)
}

/**
 * @param fileName - The full filename to open and parse
 *
 * @see https://github.com/alexanderwallin/node-gettext#usage
 * @see https://github.com/alexanderwallin/node-gettext#load-and-add-translations-from-mo-or-po-files
 */
async function parseFile(fileName: string) {
	const fileBasename = basename(fileName).slice(0, -'.pot'.length)
	const languageArray = fileBasename.split(/[_@]/)
	if (languageArray[1]?.toLowerCase() === 'latin') {
		languageArray[1] = 'Latn' // BCP47 uses 4 letter script tag
	}
	const languageName = languageArray.join('-')
	const po = await readFile(fileName)

	// compress translations
	const json = Object.fromEntries(Object.entries(poParser.parse(po).translations[''])
		// Remove the meta data entry
		.filter(([key]) => key !== '')
		// Remove not translated string to save space
		.filter(([, value]) => value.msgstr.length > 1 || value.msgstr[0] !== '')
		// Compress translations to remove duplicated information and reduce asset size
		.map(([id, value]) => [id, { ...(value.msgid_plural ? { p: value.msgid_plural } : {}), v: value.msgstr }]))

	return [languageName, json] as const
}
