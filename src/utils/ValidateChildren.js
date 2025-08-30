/**
 * SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import Vue from 'vue'

/**
 * Validate children of a vue component
 *
 * @param {object} vm the vue component instance
 * @param {string[]} allowed the allowed components name
 */
function ValidateChildren(vm, allowed) {
	vm.$children.forEach((child, index) => {
		const isChildren = allowed.indexOf(child.$options.name) !== 1
		const isWrappedChildren = child.$children.length === 1
			&& allowed.indexOf(child.$children[0].$options.name) === -1

		// allow direct children action or wrapped action in case of using
		// a fake component with :is="myActionWrapper" and some custom methods
		// that you import  with import myActionWrapper from 'myActionWrapper'
		if (!(isChildren || isWrappedChildren)) {
			// warn
			Vue.util.warn(`${child.$options.name} is not allowed inside the ${vm.$options.name} component`, vm)

			// cleanup
			vm.$children.splice(index, 1)
			child.$el.remove()
		}
	})
}

export default ValidateChildren
