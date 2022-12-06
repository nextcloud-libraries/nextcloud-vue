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
import * as components from './components/index.js'
import * as directives from './directives/index.js'

export * from './components/index.js'
export * from './functions/index.js'
export * from './directives/index.js'
export * from './mixins/index.js'
export * from './a11y/index.js'

export const NcComponents = components
export const NcDirectives = directives

// Vue plugin to install all components using `app.use(NcVuePlugin)`
export const NcVuePlugin = {
	/**
	 * @param {object} app The vue application
	 * @param {object} options Options to pass to `app.vue()`
	 */
	install(app, options) {
		Object.keys(components).forEach(key => {
			// eslint-disable-next-line import/namespace
			app.component(components[key]?.name || key, components[key])
		})
		Object.keys(directives).forEach(key => {
			// eslint-disable-next-line import/namespace
			app.directive(directives[key]?.name || key, directives[key])
		})
	},
}
