const fs = require('fs')
const gettextParser = require('gettext-parser')

// https://github.com/alexanderwallin/node-gettext#usage
// https://github.com/alexanderwallin/node-gettext#load-and-add-translations-from-mo-or-po-files
const translations = fs
	.readdirSync('./l10n')
	.filter(name => name !== 'messages.pot' && name.endsWith('.pot'))
	.map(file => {
		const path = './l10n/' + file
		const locale = file.slice(0, -'.pot'.length)

		const po = fs.readFileSync(path)
		const json = gettextParser.po.parse(po)

		// Compress translations Content
		const translations = {}
		for (const key in json.translations['']) {
			if (key !== '') {
				// Plural
				if ('msgid_plural'in json.translations[''][key]) {
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
	})

module.exports = translations
