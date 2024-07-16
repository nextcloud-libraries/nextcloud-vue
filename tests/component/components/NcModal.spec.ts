/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Component } from 'vue'

import { expect, test } from '@playwright/experimental-ct-vue'
import NcModal from '../../../src/components/NcModal/NcModal.vue'

test('Modal is labelled correctly if name is set', async ({ mount, page }) => {
	await mount(NcModal, {
		props: {
			show: true,
			name: 'My modal',
			size: 'small',
		},
		slots: {
			default: 'Text',
		},
	})

	await expect(page.getByRole('dialog', { name: 'My modal' })).toBeVisible()
})

test('Modal is labelled correctly if `labelId` is set', async ({ mount, page }) => {
	await mount(NcModal, {
		props: {
			show: true,
			size: 'small',
			labelId: 'my-id',
		},
		slots: {
			default: '<h2 id="my-id">Labelled modal</h2>',
		},
	})
	// There should be the dialog spawned
	const dialog = page.getByRole('dialog')
	await expect(dialog).toBeVisible()
	// With the heading inside
	await expect(dialog.getByRole('heading')).toHaveText('Labelled modal')
	// And the heading is used to label the dialog
	await expect(dialog).toHaveAccessibleName('Labelled modal')
})

test('Modal is labelled correctly if `labelId` and `name` are set', async ({ mount, page }) => {
	await mount(NcModal, {
		props: {
			show: true,
			size: 'small',
			name: 'My modal',
			labelId: 'my-id',
		},
		slots: {
			default: '<h2 id="my-id">Real name</h2>',
		},
	})
	await expect(page.getByRole('dialog', { name: 'Real name' })).toBeVisible()
})

test('Close button is visible when content is scrolled', async ({ mount, page }) => {
	await mount(NcModal, {
		props: {
			show: true,
			size: 'small',
			name: 'My modal',
			labelId: 'my-id',
		},
		slots: {
			default: '<div><div style="height: 200vh;"></div><div data-testid="bottom">Hello</div></div>',
		},
	})

	const dialog = page.getByRole('dialog')
	await expect(dialog).toBeVisible()

	await dialog.getByTestId('bottom').scrollIntoViewIfNeeded()
	await expect(dialog.getByTestId('bottom')).toBeVisible()

	await expect(dialog.getByRole('button', { name: 'Close' })).toBeVisible()
	await expect(dialog.getByRole('button', { name: 'Close' })).toBeInViewport()
})
