/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Locale } from 'date-fns'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'

import { computedAsync } from '@vueuse/core'
import { enUS } from 'date-fns/locale/en-US'
import { computed, toValue } from 'vue'
import loader from './dateFnsLocaleLoader.ts'

/**
 * Given a locale try to load the corresponding locale from date-fns.
 * Fall back to en-US while loading, if the request locale does not exist or could not be loaded.
 *
 * @param locale locale code (e.g., 'de-DE')
 */
export default function useDateFnsLocale(locale: MaybeRefOrGetter<string>): ComputedRef<Locale> {
	const loadedLocale = computedAsync(() => loadDateFnsLocale(toValue(locale)))
	return computed(() => loadedLocale.value ?? enUS)
}

/**
 * Given a locale code load the locale from the loader.
 *
 * @param locale Locale code (e.g, nl-BE.js)
 */
async function loadDateFnsLocale(locale: string): Promise<Locale | undefined> {
	if (locale in loader) {
		return await loader[locale]()
	}

	if (locale.includes('-')) {
		// Try without region
		const shortLocale = locale.split('-')[0]
		return loadDateFnsLocale(shortLocale)
	}

	return undefined
}
