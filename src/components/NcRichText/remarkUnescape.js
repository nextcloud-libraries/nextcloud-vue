/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { SKIP, visit } from 'unist-util-visit'

export function remarkUnescape() {
	return function(tree) {
		visit(tree, (node) => ['text', 'code', 'inlineCode'].includes(node.type),
			(node, index, parent) => {
				parent.children.splice(index, 1, {
					...node,
					value: node.value.replace(/&lt;/gmi, '<').replace(/&gt;/gmi, '>'),
				})
				return [SKIP, index + 1]
			})
	}
}
