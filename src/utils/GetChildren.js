/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Get the all the children matching the provided name
 *
 * @param {object} context the context to search from (usualy this)
 * @param {string} name the children name
 * @return {object[]} the children components
 */
function GetChildren(context, name) {
	const children = []
	if (context.$children) {
		context.$children.forEach(child => {
			if (child.$options && child.$options.name === name) {
				children.push(child)
			}
			// if more children, get down one level and append search results
			if (child.$children) {
				children.push(...GetChildren(child, name))
			}
		})
	}
	return children
}

export default GetChildren
