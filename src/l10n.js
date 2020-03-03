import { getGettextBuilder } from '@nextcloud/l10n/dist/gettext'

const gtBuilder = getGettextBuilder()
	.detectLocale()
TRANSLATIONS.map(data => gtBuilder.addTranslation(data.locale, data.json))
const gt = gtBuilder.build()

const n = gt.ngettext.bind(gt)
const t = gt.gettext.bind(gt)

export { t, n }
