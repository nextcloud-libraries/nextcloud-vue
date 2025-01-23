/**
 * SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import Vue from 'vue'

/**
 * Validate children of a vue component
 *
 * @param {object[]} slots the vue component slot
 * @param {string[]} allowed the allowed components name
 * @param {object} vm the vue component instance
 */
const ValidateSlot = (slots, allowed, vm) => {
	if (slots === undefined) {
		return
	}

	for (let index = slots.length - 1; index >= 0; index--) {
		const node = slots[index]
		// also check against allowed to avoid uninitiated vnodes with no componentOptions
		const isHtmlElement = !node.componentOptions && node.tag && allowed.indexOf(node.tag) === -1
		const isVueComponent = !!node.componentOptions && typeof node.componentOptions.tag === 'string'
		const isForbiddenComponent = isVueComponent && allowed.indexOf(node.componentOptions.tag) === -1

		// if html element or not a vue component or vue component not in allowed tags
		if (isHtmlElement || !isVueComponent || isForbiddenComponent) {
			// only warn when html element or forbidden component
			// sometimes text nodes are present which are hardly removable by the developer and spam the warnings
			if (isHtmlElement || isForbiddenComponent) {
				Vue.util.warn(`${isHtmlElement ? node.tag : node.componentOptions.tag} is not allowed inside the ${vm.$options.name} component`, vm)
			}

			// cleanup
			slots.splice(index, 1)
		}
	}
}

export default ValidateSlot
