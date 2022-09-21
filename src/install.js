import * as NcComponents from './components/index.js'

/**
 * @param {object} Vue The vue instance
 */
function install(Vue) {
	Object.values(NcComponents).forEach((component) => {
		Vue.component(component.name, component)
	})
}

if (typeof window !== 'undefined' && window.Vue) {
	install(window.Vue)
}

export default install
