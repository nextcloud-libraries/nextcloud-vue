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

/**
 * Manually scope a vue component to be used with an external css file
 * The external css must have the root element set with [data-v-#{$scope_version}]
 * 
 * e.g. .multiselect[data-v-#{$scope_version}]
 * import ScopeComponent from 'Utils/ScopeComponent'
 * import Multiselect from 'vue-multiselect'
 * import './index.scss'
 * ScopeComponent(Multiselect)
 * 
 * @param {Object} Component the vue component
 */
const ScopeComponent = (Component) => {
	Component.mounted = [
		function() {
			this.$el.setAttribute(`data-v-${SCOPE_VERSION}`, '')
		}
	]
}

export default ScopeComponent