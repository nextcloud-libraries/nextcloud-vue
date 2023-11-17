/**
 * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 * @author Grigorii K. Shartsev <me@shgk.me>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

/**
 * Originally taken from https://github.com/nextcloud/server/blob/master/core/js/placeholder.js
 */

import { t } from '../l10n.js'

class Color {

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
 * Generate colors from the official nextcloud color
 * You can provide how many colors you want (multiplied by 3)
 * if step = 6
 * 3 colors * 6 will result in 18 generated colors
 *
 * @param {number} [steps] Number of steps to go from a color to another
 * @return {object[]}
 */
function GenColors(steps) {
	if (!steps) {
		steps = 6
	}

	const red = new Color(182, 70, 157, t('Purple'))
	const yellow = new Color(221, 203, 85, t('Gold'))
	const blue = new Color(0, 130, 201, t('Nextcloud blue'))

	const palette1 = mixPalette(steps, red, yellow)
	const palette2 = mixPalette(steps, yellow, blue)
	const palette3 = mixPalette(steps, blue, red)

	return palette1.concat(palette2).concat(palette3)
}

export default GenColors
