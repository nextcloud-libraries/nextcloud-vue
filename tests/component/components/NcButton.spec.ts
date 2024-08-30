/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import NcButton from '../../../src/components/NcButton/NcButton.vue'

test('Text is rendered when provided', async ({ mount, page }) => {
	await mount(NcButton, {
		props: {
			text: 'Nextcloud',
		},
	})
	await expect(page.getByRole('button')).toHaveText('Nextcloud')
	await expect(page.getByRole('button')).toHaveAccessibleName('Nextcloud')
})

test('Text is rendered when provided as slot', async ({ mount, page }) => {
	await mount(NcButton, {
		slots: {
			default: 'Nextcloud',
		},
	})
	await expect(page.getByRole('button')).toHaveText('Nextcloud')
	await expect(page.getByRole('button')).toHaveAccessibleName('Nextcloud')
})

test('Can overwrite accessible name', async ({ mount, page }) => {
	await mount(NcButton, {
		props: {
			ariaLabel: 'Nextcloud',
			text: 'Your favorite cloud',
		},
	})
	await expect(page.getByRole('button')).toHaveText('Your favorite cloud')
	await expect(page.getByRole('button')).toHaveAccessibleName('Nextcloud')
})

test('Can overwrite accessible name provided as slot', async ({ mount, page }) => {
	await mount(NcButton, {
		props: {
			ariaLabel: 'Nextcloud',
		},
		slots: {
			default: 'Your favorite cloud',
		},
	})
	await expect(page.getByRole('button')).toHaveText('Your favorite cloud')
	await expect(page.getByRole('button')).toHaveAccessibleName('Nextcloud')
})
