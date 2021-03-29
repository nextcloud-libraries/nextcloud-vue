import { getGettextBuilder } from '@nextcloud/l10n/dist/gettext'

const gtBuilder = getGettextBuilder()
	.detectLocale()

// Decompress Translations to gettext format and add to gtBuilder
TRANSLATIONS.forEach((lang) => {
	const translations = {}

	for (const key in lang.translations) {
		// Plural
		if (lang.translations[key].pluralId) {
			translations[key] = {
				msgid: key,
				msgid_plural: lang.translations[key].pluralId,
				msgstr: lang.translations[key].msgstr,
			}
			continue
		}

		// Singular
		translations[key] = {
			msgid: key,
			msgstr: [
				lang.translations[key],
			],
		}
	}

	gtBuilder.addTranslation(lang.locale, {
		translations: {
			'': translations,
		},
	})
})

const gt = gtBuilder.build()

const n = gt.ngettext.bind(gt)
const t = gt.gettext.bind(gt)

export { t, n }
