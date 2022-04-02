import * as NcComponents from './components/index.js'

import { createApp } from 'vue'

/**
 *
 */
function install() {
	console.debug('component')
	const app = createApp({})

	Object.values(NcComponents).forEach((component) => {
		app.component(component.name, component)
	})
}

if (typeof window !== 'undefined') {
	install()
}

export default install
