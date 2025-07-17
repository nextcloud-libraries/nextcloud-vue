/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { t } from '../l10n.ts'

export class Color {

	/**
	 * @param r - The red value
	 * @param g - The green value
	 * @param b - The blue value
	 * @param name - The name of the color
	 */
	constructor(
		public readonly r: number,
		public readonly g: number,
		public readonly b: number,
		public readonly name?: string,
	) {
		this.r = Math.min(r, 255)
		this.g = Math.min(g, 255)
		this.b = Math.min(b, 255)
		this.name = name
	}

	/**
	 * The hexadecimal color string.
	 */
	get color(): string {
		const toHex = (int: number) => `00${int.toString(16)}`.slice(-2)
		return `#${toHex(this.r)}${toHex(this.g)}${toHex(this.b)}`
	}

}

/**
 * Calculate the increment needed to blend color1 into color2 within specified number of steps.
 *
 * @param steps - The number of steps
 * @param color1 - The color to start with
 * @param color2 - The color to end at
 * @return The increment needed per color channel
 */
function calculateStepIncrement(steps: number, color1: Color, color2: Color): { r: number, g: number, b: number } {
	return {
		r: (color2.r - color1.r) / steps,
		g: (color2.g - color1.g) / steps,
		b: (color2.b - color1.b) / steps,
	}
}

/**
 * Create a color palette from two colors
 *
 * @param steps - The number of steps the palette should have
 * @param color1 - The first color to mix
 * @param color2 - The second color to mix
 * @return The created palette array (mixed `color1` and `color2` with `steps` steps)
 */
function mixPalette(steps: number, color1: Color, color2: Color): Color[] {
	const palette: Color[] = []
	palette.push(color1)
	const increment = calculateStepIncrement(steps, color1, color2)
	for (let i = 1; i < steps; i++) {
		const r = Math.floor(color1.r + increment.r * i)
		const g = Math.floor(color1.g + increment.g * i)
		const b = Math.floor(color1.b + increment.b * i)
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
 * You can provide how many colors you want (multiplied by 3).
 *
 * For example if steps is set to 6, then 3 colors * 6 will result in 18 generated colors.
 *
 * @param steps - Number of steps to go from a color to another
 */
export function generatePalette(steps: number): Color[] {
	if (steps <= 0) {
		steps = 6
	}

	if (steps === 4) {
		return [...defaultPalette]
	}

	const red = new Color(182, 70, 157, t('Purple'))
	const yellow = new Color(221, 203, 85, t('Gold'))
	const blue = new Color(0, 130, 201, t('Nextcloud blue'))

	const palette1 = mixPalette(steps, red, yellow)
	const palette2 = mixPalette(steps, yellow, blue)
	const palette3 = mixPalette(steps, blue, red)

	return palette1.concat(palette2).concat(palette3)
}
