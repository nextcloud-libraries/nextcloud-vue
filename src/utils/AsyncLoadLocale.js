
/**
 * @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

const AsyncLoadLocale = async function(locale) {
	// default load e.g. 'fr-fr'
	try {
		await import('moment/locale/' + locale)
		return locale // update local locale
	} catch (e1) {
		try {
			console.error(e1)
			await import('moment/locale/' + locale.split('-')[0]) // failure: fallback to 'fr'
			return locale.split('-')[0] // update local locale
		} catch (e2) {
			console.error(e2)
			return 'en' // last fallback to English
		}
	}
}

export default AsyncLoadLocale
