/*!
 * SPDX-FileCopyrightText: Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

// This file is included by the l10n-plugin - its provided as source code here to allow linting

import { getLanguage } from '@nextcloud/l10n'
import { getGettextBuilder } from '@nextcloud/l10n/gettext'
const gettext = getGettextBuilder()
	.detectLanguage()
	.build()

export const n = (...args) => gettext.ngettext(...args)
export const t = (...args) => gettext.gettext(...args)

/**
 * @param {{ l: string, t: Record<string, { v: string[], p?: string }> }[]} chunks 
 */
export function register(...chunks) {
	for (const chunk of chunks) {
		if (chunk.registered) {
			continue
		}

		// for every language in the chunk: decompress and register if matching
		for (const { l: language, t: translations } of chunk) {
			if (language !== getLanguage() || !translations) {
				continue
			}

			const decompressed = Object.fromEntries(
				Object.entries(translations)
				.map(([id, value]) => [
					id,
					{
						msgid: id,
						msgid_plural: value.p,
						msgstr: value.v,
					}
				])
			)

			gettext.addTranslations({
				translations: {
					'': decompressed,
				},
			})
		}
		chunk.registered = true
	}
}
