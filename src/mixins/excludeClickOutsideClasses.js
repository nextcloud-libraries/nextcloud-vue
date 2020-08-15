/**
 * @copyright Copyright (c) 2020 Georg Ehrke <georg-nextcloud@ehrke.email>
 *
 * @author Georg Ehrke <georg-nextcloud@ehrke.email>
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

export default {
	props: {
		/**
		 * A class-name or an array of class-names
		 * to be ignored when clicking outside
		 * an element
		 */
		excludeClickOutsideClasses: {
			type: String | Array,
			default: () => [],
		},
	},
	methods: {
		/**
		 * Middleware Handler for V-Click-Outside
		 *
		 * @param {Event} event The click event
		 * @returns {Boolean}
		 */
		clickOutsideMiddleware(event) {
			const excludedClassList = Array.isArray(this.excludeClickOutsideClasses)
				? this.excludeClickOutsideClasses
				: [this.excludeClickOutsideClasses]

			// No need to iterate through all parents
			// if class-list is empty
			if (excludedClassList.length === 0) {
				return true
			}

			return !this.hasNodeOrAnyParentClass(event.target, excludedClassList)
		},
		/**
		 * Checks if given node or any of it's parents have a class of classArray
		 *
		 * @param {Element} node Node to test
		 * @param {Array} classArray List of classes to check for
		 * @returns {Boolean}
		 */
		hasNodeOrAnyParentClass(node, classArray) {
			for (const className of classArray) {
				if (node.classList.contains(className)) {
					return true
				}
			}

			return !!node.parentElement && this.hasNodeOrAnyParentClass(node.parentElement, classArray)
		},
	},
}
