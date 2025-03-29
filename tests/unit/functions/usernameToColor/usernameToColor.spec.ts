/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { describe, expect, it } from 'vitest'
import usernameToColor from '../../../../src/functions/usernameToColor/index.ts'

const rgbToHex = (color) => {
	return '#' + ((1 << 24) + (color.r << 16) + (color.g << 8) + color.b).toString(16).slice(1)
}

describe('usernameToColor', () => {

	it.for([
		'', ',', '.', 'admin', 'foo', 'bar', 'asd', 'wasd', 'a user', 'another user', 'admin@cloud.example.com',
		'Lorelai Taylor',
		'Lillian Wall',
		'Haseeb Stephens',
		'Rae Hope',
		'Santiago Singleton',
		'Daphne Roy',
		'Arham Johnson',
		'Madina Knight',
		'Sid Combs',
		'Zaki Cortes',
		'Ellena Wright Frederic Conway',
		'Alishia Ann Lowry',
		'Idris Mac',
		'Kristi Fisher',
		'Gianluca Hills',
		'Vivienne Jacobs',
		'Brayden Truong',
		'Akeel Robertson',
		'Tom Mörtel',
		'🙈',
		'مرحبا بالعالم',
		'123e4567-e89b-12d3-a456-426614174000',
		'Meeting',
		'TestCircle',
		'Private Circle',
	])('%s has the proper color', (name: string) => {
		const color = usernameToColor(name)
		expect(rgbToHex(color)).toMatchSnapshot()
	})
})
