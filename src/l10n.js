// This is only a dummy file, the real translations are injected by the vite plugin from build/l10n-plugin!
import { getGettextBuilder } from '@nextcloud/l10n/gettext'

const gtBuilder = getGettextBuilder().detectLocale()
const gt = gtBuilder.build()

const n = gt.ngettext.bind(gt)
const t = gt.gettext.bind(gt)

export { t, n }
