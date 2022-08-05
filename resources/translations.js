// const glob = require('glob')
const { join, basename } = require('path')
const fs = require('fs/promises')
const gettextParser = require('gettext-parser')

// https://github.com/alexanderwallin/node-gettext#usage
// https://github.com/alexanderwallin/node-gettext#load-and-add-translations-from-mo-or-po-files
const parseFile = async (fileName) => {
	const locale = basename(fileName).slice(0, -'.pot'.length)
	const po = await fs.readFile(fileName)

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
	const files = await fs.readdir(baseDir)

	const promises = files
		.filter(name => name !== 'messages.pot' && name.endsWith('.pot'))
		.map(file => join(baseDir, file))
		.map(parseFile)

	return Promise.all(promises)
}

module.exports = {
	loadTranslations,
}
