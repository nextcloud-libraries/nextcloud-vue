/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Page } from '@playwright/test'

import { expect, test } from '@playwright/experimental-ct-vue'
import NcStepper from '../../../src/components/NcStepper/NcStepper.vue'

const steps = [
	{ id: 'name', label: 'Name' },
	{ id: 'details', label: 'Details' },
	{ id: 'members', label: 'Members' },
]

/**
 * Where the line after each step is drawn, and where the markers of the step and the next one are.
 *
 * @param page - The page
 */
function linesAndMarkers(page: Page) {
	return page.evaluate(() => [...document.querySelectorAll('li')].slice(0, -1).map((item) => {
		const style = getComputedStyle(item, '::after')
		const box = item.getBoundingClientRect()
		const markers = [item, item.nextElementSibling!].map((element) => element.querySelector('[aria-hidden="true"]')!.getBoundingClientRect())
		return {
			line: {
				left: box.left + parseFloat(style.left),
				right: box.right - parseFloat(style.right),
				top: box.top + parseFloat(style.top),
				bottom: box.bottom - parseFloat(style.bottom),
			},
			markers: markers.map(({ left, right, top, bottom }) => ({ left, right, top, bottom })),
		}
	}))
}

test('draws the line in a row between the markers', async ({ mount, page }) => {
	await mount(NcStepper, { props: { steps, modelValue: 'details', style: 'width: 600px' } })
	for (const { line, markers: [marker, next] } of await linesAndMarkers(page)) {
		expect(line.left).toBeGreaterThan(marker.right)
		expect(line.right).toBeLessThan(next.left)
		// Through the middle of the marker
		expect((line.top + line.bottom) / 2).toBeCloseTo((marker.top + marker.bottom) / 2, 0)
	}
})

test('draws the line in a row between the markers from right to left', async ({ mount, page }) => {
	await page.evaluate(() => document.documentElement.setAttribute('dir', 'rtl'))
	await mount(NcStepper, { props: { steps, modelValue: 'details', style: 'width: 600px' } })
	for (const { line, markers: [marker, next] } of await linesAndMarkers(page)) {
		expect(line.right).toBeLessThan(marker.left)
		expect(line.left).toBeGreaterThan(next.right)
	}
})

test('draws the line below each other between the markers', async ({ mount, page }) => {
	await mount(NcStepper, { props: { steps, modelValue: 'details', orientation: 'vertical', style: 'width: 300px' } })
	for (const { line, markers: [marker, next] } of await linesAndMarkers(page)) {
		expect(line.top).toBeGreaterThan(marker.bottom)
		expect(line.bottom).toBeLessThan(next.top)
		// Through the middle of the marker
		expect((line.left + line.right) / 2).toBeCloseTo((marker.left + marker.right) / 2, 0)
	}
})

test('does not break a name inside a word in a narrow row, and scrolls instead', async ({ mount, page }) => {
	const many = ['Account', 'Organisation', 'Members', 'Permissions', 'Notifications', 'Review'].map((label) => ({ id: label.toLowerCase(), label }))
	const stepper = await mount(NcStepper, { props: { steps: many, modelValue: 'members', style: 'width: 360px' } })
	// Upcoming steps, so their text is only the name
	for (const name of ['Permissions', 'Notifications']) {
		const box = (await page.getByText(name, { exact: true }).boundingBox())!
		// One line high
		expect(box.height).toBeLessThan(30)
	}
	expect(await stepper.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true)
})

for (const dir of ['ltr', 'rtl']) {
	test(`keeps the current step in view in a row that scrolls, ${dir}`, async ({ mount, page }) => {
		await page.evaluate((dir) => document.documentElement.setAttribute('dir', dir), dir)
		const many = ['Account', 'Organisation', 'Members', 'Permissions', 'Notifications', 'Review'].map((label) => ({ id: label.toLowerCase(), label }))
		const stepper = await mount(NcStepper, { props: { steps: many, modelValue: 'review', style: 'width: 360px' } })
		const inView = async (name: string) => {
			const [list, step] = await Promise.all([stepper.boundingBox(), page.getByText(name, { exact: true }).boundingBox()])
			return step!.x >= list!.x && step!.x + step!.width <= list!.x + list!.width
		}
		expect(await inView('Review')).toBe(true)

		await stepper.update({ props: { modelValue: 'account' } })
		await expect.poll(() => inView('Account')).toBe(true)
	})
}
