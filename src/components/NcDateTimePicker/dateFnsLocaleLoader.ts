/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/// <reference types="@types/webpack-env" />

import type { Locale } from 'date-fns'

// This is only required for `npm run styleguide`.
// For `npm run build`, `npm run dev` and everything else using Vite
// all the code from this file is overriden by `build/date-fns-locales-plugin.mts`.
const webpackContext = import.meta.webpackContext('../../../node_modules/date-fns/locale', {
	recursive: false,
	regExp: /\.js$/,
	exclude: /(types|en-US|cdn(\.min)?)\.js$/,
	mode: 'lazy',
})

/**
 * Given a `key` load the locale from the webpack context.
 *
 * @param key File name for the locale e.g., ./nl-BE.js'
 */
async function loadLocale(key: string) {
	const mod = await webpackContext<Promise<{ default: Locale }>>(key)
	return mod.default
}

const loader: Record<string, () => Promise<Locale>> = {}

for (const key of webpackContext.keys()) {
	// Remove prefix `./` and suffix `.js` to get the locale code.
	const localeCode = key.slice(2, -3)
	loader[localeCode] = () => loadLocale(key)
}

export default loader
