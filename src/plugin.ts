/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { DefineComponent, Directive, PluginObject } from 'vue'

import * as NcComponents from './components/index.js'
import * as NcDirectives from './directives/index.js'

/**
 * Install all Nextcloud Vue components and directives globally
 *
 * @example
 * ```js
 * import { NextcloudVuePlugin } from '@nextcloud/vue'
 * import Vue from 'vue'
 *
 * // ...
 *
 * Vue.use(NextcloudVuePlugin)
 * new Vue({
 *     // options
 * })
 * ```
 */
export const NextcloudVuePlugin: PluginObject<never> = {
	install(Vue) {
		// Install components
		Object.entries(NcComponents as { [key: string]: DefineComponent }).forEach(([name, component]) => {
			Vue.component(component.name || name, component)
		})

		// Install directives
		Object.entries(NcDirectives as { [key: string]: Directive }).forEach(([name, directive]) => {
			Vue.directive(name, directive)
		})
	},
}
