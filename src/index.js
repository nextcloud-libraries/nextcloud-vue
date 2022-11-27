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
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
import * as NcComponents from './components/index.js'

export * from './components/index.js'
export * from './functions/index.js'
export * from './directives/index.js'
export * from './mixins/index.js'
export * from './a11y/index.js'

// Vue plugin to install all components using `Vue.use(NextcloudVue)`
export const NextcloudVue = {
	/**
	 * @param {object} Vue The vue instance
	 */
	install: Vue => {
		Object.values(NcComponents).forEach(component => {
			Vue.component(component.name, component)
		})
	},
}
