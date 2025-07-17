/*!
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Plugin, Transformer } from 'unified'
import type { Node, Parent } from 'unist'
import type { TextNode } from './helpers.ts'

import { u } from 'unist-builder'
import { visit } from 'unist-util-visit'

/**
 * Check if the given node is a literal and specifically a text node
 * @param node - A Unist node
 */
function isTextNode(node: Node): node is TextNode {
	return node.type === 'text'
}

const transformPlaceholders: Transformer = function(ast: Node) {
	// Apply the visitor to all text nodes of the AST
	visit(ast, isTextNode, visitor)

	/**
	 * @param node - The text node
	 * @param index - The index of the node
	 * @param parent - The parent node
	 */
	function visitor(node: TextNode, index?: number, parent?: Parent) {
		const placeholders = node.value.split(/(\{[a-z\-_.0-9]+\})/ig)
			.map((entry: string) => {
				const matches = entry.match(/^\{([a-z\-_.0-9]+)\}$/i)
				if (!matches) {
					return u('text', entry)
				}
				const [, component] = matches
				return u('element', {
					tagName: `#${component}`,
					children: [],
				})
			})

		parent!.children.splice(index!, 1, ...placeholders)
	}
}

export const remarkPlaceholder: Plugin = () => transformPlaceholders
