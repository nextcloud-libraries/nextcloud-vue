import usernameToColor from './index'

describe('usernameToColor', () => {
	'use strict'

	const usernames = ['admin', 'foo', 'bar', 'asd', 'wasd', 'a user', 'another user', 'admin@cloud.example.com',
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
		'Akeel Robertson']

	usernames.forEach((key) => {
		it(key + ' has the proper color', () => {
			expect(usernameToColor(key)).toMatchSnapshot()
		})
	})

})
