/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

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

test('Close button is contained within the dialog by default', async ({ mount, page }) => {
	await mount(NcModal, {
		props: {
			show: true,
			size: 'small',
			name: 'test modal',
		},
	})

	const button = page.getByRole('dialog', { name: 'test modal' })
		.locator('.modal-container')
		.getByRole('button', { name: 'Close' })

	await expect(button).toBeVisible()
})

test('Close button can be moved to the modal header', async ({ mount, page }) => {
	await mount(NcModal, {
		props: {
			closeButtonOutside: true,
			show: true,
			size: 'small',
			name: 'test modal',
		},
	})

	const button = page.getByRole('dialog', { name: 'test modal' })
		.locator('.modal-header')
		.getByRole('button', { name: 'Close' })

	await expect(button).toBeVisible()
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

test('Modal focus trap works correctly', async ({ mount, page }) => {
	await mount(NcModal, {
		props: {
			show: true,
			size: 'small',
			name: 'Focus trap test modal',
		},
		slots: {
			default: '<button>Test Button</button>',
		},
	})

	const dialog = page.getByRole('dialog', { name: 'Focus trap test modal' })
	await expect(dialog).toBeVisible()

	const testButton = dialog.getByRole('button', { name: 'Test Button' })
	const closeButton = dialog.getByRole('button', { name: 'Close' })

	// first content child is focused by default
	await expect(testButton).toBeFocused()

	// tab should move focus to the close button
	await page.keyboard.press('Tab')
	await expect(closeButton).toBeFocused()

	// due to focus-trap its now back to the first focusable element
	await page.keyboard.press('Tab')
	await expect(testButton).toBeFocused()
})

test('Slideshow progress ring is centred on the play button', async ({ mount, page }) => {
	await mount(NcModal, {
		props: {
			show: true,
			name: 'My modal',
			enableSlideshow: true,
			hasNext: true,
		},
		slots: {
			default: 'Text',
		},
	})

	// The ring used to be a fixed 50x50 box, which only lined up while the
	// header was 50px tall. The bundled styles here still say 50, so ask for
	// the height Nextcloud actually uses.
	await page.addStyleTag({ content: '.modal-header { --header-height: 44px !important; }' })

	await page.locator('.play-pause-icons').click()
	await expect(page.locator('.progress-ring')).toBeVisible()

	const measured = await page.evaluate(() => {
		const box = (selector: string) => document.querySelector(selector)!.getBoundingClientRect()
		const centre = (selector: string) => {
			const rect = box(selector)
			return [Math.round(rect.x + rect.width / 2), Math.round(rect.y + rect.height / 2)]
		}
		return {
			buttonCentre: centre('.play-pause-icons'),
			ringCentre: centre('.progress-ring__circle'),
			ringWidth: Math.round(box('.progress-ring__circle').width),
			hoverDiscWidth: Math.round(box('.play-pause-icons__icon').width),
		}
	})

	expect(measured.ringCentre).toEqual(measured.buttonCentre)
	// The ring reads as the outline of the disc the button shows on hover,
	// so it has to sit outside it rather than cut across it
	expect(measured.ringWidth).toBeGreaterThan(measured.hoverDiscWidth)
})
