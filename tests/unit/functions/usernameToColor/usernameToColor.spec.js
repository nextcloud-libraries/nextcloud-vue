/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import usernameToColor from '../../../../src/functions/usernameToColor/index.js'

function rgbToHex(color) {
	return '#' + ((1 << 24) + (color.r << 16) + (color.g << 8) + color.b).toString(16).slice(1)
}

describe('usernameToColor', () => {
	'use strict'

	const usernames = [
		'',
		',',
		'.',
		'admin',
		'foo',
		'bar',
		'asd',
		'wasd',
		'a user',
		'another user',
		'admin@cloud.example.com',
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
	]

	usernames.forEach((key) => {
		it(key + ' has the proper color', () => {
			expect(rgbToHex(usernameToColor(key))).toMatchSnapshot()
		})
	})
})
