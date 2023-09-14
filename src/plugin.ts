import type { DefineComponent, Directive, Plugin } from 'vue'

import * as NcComponents from './components/index'
import * as NcDirectives from './directives/index'

/**
 * Install all Nextcloud Vue components and directives globally
 * @example
 * ```js
 * import { NextcloudVuePlugin } from '@nextcloud/vue'
 * import { createApp } from 'vue'
 *
 * const app = createApp({})
 *
 * app.use(NextcloudVuePlugin, {
 *   // optional options
 * })
 * ```
 */
export const NextcloudVuePlugin: Plugin = {
	install(app) {
		// Install components
		Object.entries(NcComponents).forEach(([name, component]) => {
			app.component(component.name || name, component)
		})

		// Install directives
		Object.entries(NcDirectives as { [key: string]: Directive }).forEach(([name, directive]) => {
			app.directive(name, directive)
		})
	},
}
