/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Plugin } from 'unified'
import type { Node, Parent } from 'unist'
import type { TextNode } from './helpers.ts'

import { SKIP, visitParents } from 'unist-util-visit-parents'

/**
 * Check if the given node is a literal and specifically a fenced node (inline code or code block)
 *
 * @param node - A Unist node
 */
function isCodeNode(node: Node): node is TextNode {
	return ['code', 'inlineCode'].includes(node.type)
}

export const remarkStripCode: Plugin = function() {
	return function(tree: Node) {
		visitParents(tree, isCodeNode, (node: TextNode, ancestors: Parent[]) => {
			const parent = ancestors.at(-1)
			const index = parent!.children.indexOf(node)

			parent!.children.splice(index!, 1, {
				...node,
				value: '',
			} as TextNode)
			return [SKIP, index! + 1]
		})
	}
}
