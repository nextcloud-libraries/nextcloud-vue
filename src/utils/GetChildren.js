/**
 * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license AGPL-3.0-or-later
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

/**
 * Get the all the children matching the provided name
 *
 * @param {object} context the context to search from (usualy this)
 * @param {string} name the children name
 * @return {object[]} the children components
 */
const GetChildren = function(context, name) {
	const children = []
	if (context.$children) {
		context.$children.forEach(child => {
			if (child.$options && child.$options.name === name) {
				children.push(child)
			}
			// if more children, get down one level and append search results
			if (child.$children) {
				children.push(...GetChildren(child, name))
			}
		})
	}
	return children
}

export default GetChildren
