/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Plugin } from 'unified'
import type { Node, Parent } from 'unist'
import type { TextNode } from './helpers.ts'

import { visit, SKIP } from 'unist-util-visit'

/**
 * Check if the given node is a literal and specifically a text node
 * @param node - A Unist node
 */
function isTextNode(node: Node): node is TextNode {
	return ['text', 'code', 'inlineCode'].includes(node.type)
}

export const remarkUnescape: Plugin = function() {
	return function(tree: Node) {
		visit(tree, isTextNode, (node: TextNode, index?: number, parent?: Parent) => {
			parent!.children.splice(index!, 1, {
				...node,
				value: node.value.replace(/&lt;/gmi, '<').replace(/&gt;/gmi, '>'),
			} as TextNode)
			return [SKIP, index! + 1]
		})
	}
}
