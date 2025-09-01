/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Get the first parent component matching the provided name
 *
 * @param {object} context the context to search from (usually this)
 * @param {string} name the parent name
 * @return {object|undefined} the parent component
 */
function GetParent(context, name) {
	let parent = context.$parent
	while (parent) {
		if (parent.$options.name === name) {
			return parent
		}
		parent = parent.$parent
	}
}

export default GetParent
