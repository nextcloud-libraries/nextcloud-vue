/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Locale } from 'date-fns'
import type { Ref } from 'vue'

import { getCanonicalLocale } from '@nextcloud/l10n'
import { enUS } from 'date-fns/locale/en-US'
import { ref } from 'vue'
import { logger } from '../../utils/logger.ts'
import loader from './dateFnsLocaleLoader.ts'

const FALLBACK_LOCALE = enUS
let cachedLocale: undefined | Promise<Locale> | Locale

/**
 * Reset locale cache. Only used for tests.
 *
 * @internal
 */
export function resetDateFnsLocaleCache(): void {
	cachedLocale = undefined
}

/**
 * Try to load the corresponding locale from date-fns for {@link getCanonicalLocale()}.
 * Fall back to {@link enUS} while loading, if the requested locale does not exist or could not be loaded.
 */
export default function useDateFnsLocale(): { isLoading: Ref<boolean>, locale: Ref<Locale> } {
	const localeCode = getCanonicalLocale()
	if (localeCode === FALLBACK_LOCALE.code) {
		return {
			isLoading: ref(false),
			locale: ref(FALLBACK_LOCALE),
		}
	}

	if (cachedLocale === undefined) {
		cachedLocale = loadDateFnsLocale(localeCode)
	}

	if (cachedLocale instanceof Promise) {
		const isLoading = ref(true)
		const locale = ref(FALLBACK_LOCALE)
		cachedLocale
			.then((loadedLocale) => {
				cachedLocale = loadedLocale
				isLoading.value = false
				locale.value = cachedLocale
			})
		return {
			isLoading,
			locale,
		}
	}

	return {
		isLoading: ref(false),
		locale: ref(cachedLocale),
	}
}

/**
 * Given a locale code load the locale from the loader.
 *
 * @param localeCode Locale code (e.g, "nl-BE")
 */
async function loadDateFnsLocale(localeCode: string): Promise<Locale> {
	if (localeCode in loader) {
		try {
			return await loader[localeCode]()
		} catch (error) {
			logger.warn('Failed to load locale.', { localeCode, error })
			return FALLBACK_LOCALE
		}
	}

	if (localeCode.includes('-')) {
		// Try without region
		const shortLocale = localeCode.split('-')[0]
		return loadDateFnsLocale(shortLocale)
	}

	logger.warn('Found no locale to load.', { localeCode })
	return FALLBACK_LOCALE
}
