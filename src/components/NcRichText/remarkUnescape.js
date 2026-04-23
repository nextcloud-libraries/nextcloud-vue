/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { SKIP, visitParents } from 'unist-util-visit-parents'

/**
 *
 */
export function remarkUnescape() {
	return function(tree) {
		visitParents(tree, (node) => ['text', 'code', 'inlineCode'].includes(node.type), (node, ancestors) => {
			const parent = ancestors.at(-1)
			const index = parent.children.indexOf(node)

			parent.children.splice(index, 1, {
				...node,
				value: node.value.replace(/&lt;/gmi, '<').replace(/&gt;/gmi, '>'),
			})
			return [SKIP, index + 1]
		})
	}
}
