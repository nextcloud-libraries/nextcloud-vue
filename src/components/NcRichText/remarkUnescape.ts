/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Plugin } from 'unified'
import type { Node, Parent } from 'unist'
import type { TextNode } from './helpers.ts'

import { SKIP, visitParents } from 'unist-util-visit-parents'

/**
 * Check if the given node is a literal and specifically a text node
 *
 * @param node - A Unist node
 */
function isTextNode(node: Node): node is TextNode {
	return ['text', 'code', 'inlineCode'].includes(node.type)
}

export const remarkUnescape: Plugin = function() {
	return function(tree: Node) {
		visitParents(tree, isTextNode, (node: TextNode, ancestors: Parent[]) => {
			const parent = ancestors.at(-1)
			const index = parent!.children.indexOf(node)

			parent!.children.splice(index!, 1, {
				...node,
				value: node.value.replace(/&lt;/gmi, '<').replace(/&gt;/gmi, '>'),
			} as TextNode)
			return [SKIP, index! + 1]
		})
	}
}
