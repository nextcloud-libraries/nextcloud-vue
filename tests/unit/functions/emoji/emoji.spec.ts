/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest'
import { emojiGetShortName } from '../../../../src/functions/emoji/index.ts'

describe('emoji: emojiGetShortName', () => {
	it.each([
		['😅', 'sweat_smile'],
		['👍🏽', '+1'],
		['👨‍👩‍👧', 'man-woman-girl'],
		['❤️', 'heart'],
		['❤', 'heart'],
	])('returns the short name of %s', (native, shortName) => {
		expect(emojiGetShortName(native)).toBe(shortName)
	})

	it.each(['x', 'sweat_smile', ''])('returns null for non-emoji %j', (text) => {
		expect(emojiGetShortName(text)).toBeNull()
	})
})
