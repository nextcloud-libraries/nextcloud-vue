/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

// This is only a dummy file, the real translations are injected by the vite plugin from build/l10n-plugin!
import { getGettextBuilder } from '@nextcloud/l10n/gettext'

const gtBuilder = getGettextBuilder().detectLanguage()
const gt = gtBuilder.build()

const n = gt.ngettext.bind(gt)
const t = gt.gettext.bind(gt)

export { t, n }
