/**
 * @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
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
 * but WITHOUT ANY WARRANTY without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
import { warn } from 'vue'

/**
 * Validate children of a vue component
 *
 * @param {object} vm the vue component instance
 * @param {string[]} allowed the allowed components name
 */
const ValidateChildren = (vm, allowed) => {
	vm.$children.forEach((child, index) => {
		const isChildren = allowed.indexOf(child.$options.name) !== 1
		const isWrappedChildren = child.$children.length === 1
			&& allowed.indexOf(child.$children[0].$options.name) === -1

		// allow direct children action or wrapped action in case of using
		// a fake component with :is="myActionWrapper" and some custom methods
		// that you import  with import myActionWrapper from 'myActionWrapper'
		if (!(isChildren || isWrappedChildren)) {
			// warn
			warn(`${child.$options.name} is not allowed inside the ${vm.$options.name} component`, vm)

			// cleanup
			vm.$children.splice(index, 1)
			child.$el.remove()
		}
	})
}

export default ValidateChildren
