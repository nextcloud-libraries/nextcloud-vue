/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { t } from '../l10n.js'

export class Color {

	/**
	 * @param {number} r The red value
	 * @param {number} g The green value
	 * @param {number} b The blue value
	 * @param {string} [name] The name of the color
	 */
	constructor(r, g, b, name) {
		this.r = r
		this.g = g
		this.b = b
		if (name) {
			this.name = name
		}
	}

	get color() {
		const toHex = (num) => `00${num.toString(16)}`.slice(-2)
		return `#${toHex(this.r)}${toHex(this.g)}${toHex(this.b)}`
	}

}

/**
 * Calculate the number of steps
 *
 * @param {number} steps The number of steps
 * @param {Array} ends The ends
 * @return {Array} Array containing the number of steps per color
 */
function stepCalc(steps, ends) {
	const step = new Array(3)
	step[0] = (ends[1].r - ends[0].r) / steps
	step[1] = (ends[1].g - ends[0].g) / steps
	step[2] = (ends[1].b - ends[0].b) / steps
	return step
}

/**
 * Create a color palette from two colors
 *
 * @param {number} steps The number of steps the palette has
 * @param {Color} color1 The first color
 * @param {Color} color2 The second color
 * @return {Array} The created palette array
 */
function mixPalette(steps, color1, color2) {
	const palette = []
	palette.push(color1)
	const step = stepCalc(steps, [color1, color2])
	for (let i = 1; i < steps; i++) {
		const r = Math.floor(color1.r + step[0] * i)
		const g = Math.floor(color1.g + step[1] * i)
		const b = Math.floor(color1.b + step[2] * i)
		palette.push(new Color(r, g, b))
	}
	return palette
}

/**
 * Like GenColor(4) but with labels
 */
export const defaultPalette = [
	new Color(182, 70, 157, t('Purple')),
	new Color(
		191, 103, 139,
		t('Rosy brown'), // TRANSLATORS: A color name for RGB(191, 103, 139)
	),
	new Color(
		201, 136, 121,
		t('Feldspar'), // TRANSLATORS: A color name for RGB(201, 136, 121)
	),
	new Color(
		211, 169, 103,
		t('Whiskey'), // TRANSLATORS: A color name for RGB(211, 169, 103)
	),
	new Color(
		221, 203, 85,
		t('Gold'),
	),
	new Color(
		165, 184, 114,
		t('Olivine'), // TRANSLATORS: A color name for RGB(165, 184, 114)
	),
	new Color(
		110, 166, 143,
		t('Acapulco'), // TRANSLATORS: A color name for RGB(110, 166, 143)
	),
	new Color(
		55, 148, 172,
		t('Boston Blue'), // TRANSLATORS: A color name for RGB(55, 148, 172)
	),
	new Color(
		0, 130, 201,
		t('Nextcloud blue'),
	),
	new Color(
		45, 115, 190,
		t('Mariner'), // TRANSLATORS: A color name for RGB(45, 115, 190)
	),
	new Color(
		91, 100, 179,
		t('Blue Violet'), // TRANSLATORS: A color name for RGB(91, 100, 179)
	),
	new Color(
		136, 85, 168,
		t('Deluge'), // TRANSLATORS: A color name for RGB(136, 85, 168)
	),
]

/**
 * Generate colors from the official nextcloud color
 * You can provide how many colors you want (multiplied by 3)
 * if step = 6
 * 3 colors * 6 will result in 18 generated colors
 *
 * @param {number} [steps] Number of steps to go from a color to another
 * @return {object[]}
 */
export function GenColors(steps) {
	if (!steps) {
		steps = 6
	}

	if (steps === 4) {
		return defaultPalette
	}

	const red = new Color(182, 70, 157, t('Purple'))
	const yellow = new Color(221, 203, 85, t('Gold'))
	const blue = new Color(0, 130, 201, t('Nextcloud blue'))

	const palette1 = mixPalette(steps, red, yellow)
	const palette2 = mixPalette(steps, yellow, blue)
	const palette3 = mixPalette(steps, blue, red)

	return palette1.concat(palette2).concat(palette3)
}
