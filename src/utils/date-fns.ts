/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Locale } from 'date-fns'

import { logger } from './logger.ts'

// this is a fix only for the styleguide as webpack does not have glob import
let modules: Record<string, () => Promise<{ default: Locale }>>
try {
	modules = import.meta.glob('/node_modules/date-fns/locale/*.js')
} catch {
	modules = {}
}

/**
 * Load a date-fns locale module.
 *
 * @param locale - The canonical locale to load
 */
export async function loadDateFnsLocale(locale: string): Promise<Locale | undefined> {
	logger.debug(`Loading date-fns locale for '${locale}'`)
	const modulePath = `/node_modules/date-fns/locale/${locale}.js`
	if (modules[modulePath]) {
		logger.debug(`Import date-fns locale for '${locale}'`)
		const mod = await modules[modulePath]()
		return mod.default
	}

	if (locale.includes('-')) {
		// Try without region
		const shortLocale = locale.split('-')[0]!
		return await loadDateFnsLocale(shortLocale)
	}

	logger.debug(`No date-fns locale found for '${locale}'`)
}
