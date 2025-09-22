/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from '@jest/globals'
import { Color, defaultPalette, generatePalette } from '../../../src/utils/colors.ts'

describe('utils: colors', () => {
	describe('default palette', () => {
		it('has 12 colors', () => {
			expect(defaultPalette).toHaveLength(12)
		})

		it('contains Nextcloud blue', () => {
			const nextcloudBlue = defaultPalette.find((color) => color.color === '#0082c9')
			expect(nextcloudBlue).not.toBeUndefined()
			expect(nextcloudBlue!.name).toBe('Nextcloud blue')
		})

		it('has all colors named', () => {
			expect(defaultPalette.every((color) => Boolean(color.name))).toBe(true)
		})
	})

	describe('Color class', () => {
		it('can be named', () => {
			const black = new Color(0, 0, 0, 'black')
			expect(black.name).toBe('black')
		})

		it('has correct colors', () => {
			const color = new Color(11, 22, 33)
			expect(color.r).toBe(11)
			expect(color.g).toBe(22)
			expect(color.b).toBe(33)
			expect(color.color).toMatchInlineSnapshot('"#0b1621"')
		})

		it.each([
			/* eslint-disable @stylistic/no-multi-spaces */
			['#000000',   0,   0,   0],
			['#ff0000', 255,   0,   0],
			['#00ff00',   0, 255,   0],
			['#010200',   1,   2,   0],
			['#ffffff', 512, 999, 256],
			/* eslint-enabled no-multi-spaces,array-bracket-spacing */
		])('correctly generated color string', (expected: string, r: number, g: number, b: number) => {
			expect(new Color(r, g, b).color).toBe(expected)
		})
	})

	describe('generatePalette', () => {
		it('falls back to 6 steps if invalid value is passed', () => {
			expect(generatePalette(0)).toHaveLength(6 * 3)
			expect(generatePalette(-1)).toHaveLength(6 * 3)
		})

		it('uses default palette when 4-steps are passed', () => {
			expect(generatePalette(4)).toStrictEqual(defaultPalette)
		})

		it('can generate only base colors', () => {
			const palette = generatePalette(1)
			expect(palette).toHaveLength(3)
			expect(palette.every((color) => Boolean(color.name))).toBe(true)
		})
	})
})
