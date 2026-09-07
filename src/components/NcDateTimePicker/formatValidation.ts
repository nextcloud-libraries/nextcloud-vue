/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * List of tokens supported by date-fns but not Unicode Technical Standard #35.
 *
 * @see https://date-fns.org/v4.4.0/docs/format
 */
const NON_STANDARD_TOKENS_OF_DATE_FNS = new Set([
	'i',
	'I',
	'R',
	't',
	'T',
	'o',
	'P',
	'p',
])

const QUOTE_CHAR = "'"

/**
 * Returns array of used non-standard tokens.
 *
 * @param format The format string.
 */
export function checkForNonStandardTokens(format: string): string[] {
	const usedNonStandardTokens = new Set<string>()
	let isQuoted = false
	for (const char of format) {
		if (char === QUOTE_CHAR) {
			isQuoted = !isQuoted
		} else if (!isQuoted) {
			if (NON_STANDARD_TOKENS_OF_DATE_FNS.has(char)) {
				usedNonStandardTokens.add(char)
			}
		}
	}
	return [...usedNonStandardTokens]
}
