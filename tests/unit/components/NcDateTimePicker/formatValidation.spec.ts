/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest'
import { checkForNonStandardTokens } from '../../../../src/components/NcDateTimePicker/formatValidation.ts'

describe('checkForNonStandardTokens', () => {
	it.for([
		"''",
		"h 'o''clock'",
		"yyyy''",
		'hh@mm',
	])('detects in %s no non-standard tokens', (format) => {
		const tokens = checkForNonStandardTokens(format)

		expect(tokens).toHaveLength(0)
	})

	const casesWithNonStandardTokens = [
		['II-RR', ['I', 'R']],
		['iIRtToPp', ['i', 'I', 'R', 't', 'T', 'o', 'P', 'p']],
	] as const

	it.for(casesWithNonStandardTokens)('detects in %s non-standard tokens %j ', ([format, nonStandardTokens]) => {
		const tokens = checkForNonStandardTokens(format)

		expect(tokens).toEqual(nonStandardTokens)
	})
})
