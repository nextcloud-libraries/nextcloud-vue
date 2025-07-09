/*!
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { setLanguage } from '@nextcloud/l10n'
import { beforeEach, describe, expect, test, vi } from 'vitest'

describe('Custom L10n plugin is working', () => {
	beforeEach(() => vi.resetModules())

	test('Default language', async () => {
		const { defaultPalette } = await import('../../../src/utils/colors.ts')
		expect(defaultPalette[1].name).toBe('Rosy brown')
	})

	test('Other translation', async () => {
		setLanguage('de')
		const { defaultPalette } = await import('../../../src/utils/colors.ts')

		expect(defaultPalette[1].name).toBe('Rosiges Braun')
	})
})
