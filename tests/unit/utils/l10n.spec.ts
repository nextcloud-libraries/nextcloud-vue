/*!
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { beforeEach, describe, expect, test, vi } from 'vitest'

describe('Custom L10n plugin is working', () => {
	beforeEach(() => vi.resetModules())

	test('Default language', async () => {
		const { defaultPalette } = await import('../../../src/utils/GenColors.js')
		expect(defaultPalette[1].name).toBe('Rosy brown')
	})

	test('Other translation', async () => {
		document.documentElement.lang = 'de'
		const { defaultPalette } = await import('../../../src/utils/GenColors.js')

		expect(defaultPalette[1].name).toBe('Rosiges Braun')
	})
})
