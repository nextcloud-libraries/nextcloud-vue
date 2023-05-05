/**
 * @copyright Copyright (c) 2020 Georg Ehrke <georg-nextcloud@ehrke.email>
 *
 * @author Georg Ehrke <georg-nextcloud@ehrke.email>
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
		 * A query-selector or an array of query-selectors
		 * to be ignored when clicking outside an element
		 */
		excludeClickOutsideSelectors: {
			type: [String, Array],
			default: () => [],
		},

		/**
		 * A class-name or an array of class-names
		 * to be ignored when clicking outside
		 * an element
		 *
		 * @deprecated since 7.9.0, use `excludeClickOutsideSelectors` instead
		 */
		excludeClickOutsideClasses: {
			type: [String, Array],
			default: () => [],
		},
	},
	computed: {
		clickOutsideOptions() {
			const excludedQuerySelectors = Array.isArray(this.excludeClickOutsideSelectors)
				? this.excludeClickOutsideSelectors
				: [this.excludeClickOutsideSelectors]

			// TODO: Drop if prop is removed
			const excludeClickOutsideClasses = Array.isArray(this.excludeClickOutsideClasses)
				? this.excludeClickOutsideClasses
				: [this.excludeClickOutsideClasses]

			return { ignore: [...excludedQuerySelectors, ...excludeClickOutsideClasses.map(cls => `.${cls}`)] }
		},
	},
}
