import { parseUrl } from './autolink.js'

import { visit } from 'unist-util-visit'
import { u } from 'unist-builder'

export const remarkPlaceholder = function() {
	return function(ast) {
		visit(ast, (node) => node.type === 'text', visitor)

		/**
		 *
		 * @param {object} node The node
		 * @param {number} index The index of the node
		 * @param {object} parent The parent node
		 */
		function visitor(node, index, parent) {
			const placeholders = node.value.split(/(\{[a-z\-_.0-9]+\})/ig)
				.map((entry, index, list) => {
					const matches = entry.match(/^\{([a-z\-_.0-9]+)\}$/i)
					if (!matches) {
						return u('text', entry)
					}
					const [, component] = matches
					return u('element', {
						tagName: `#${component}`,
					})
				})

			parent.children.splice(index, 1, ...placeholders)
		}
	}
}

export const prepareTextNode = ({ h, context }, text) => {
	if (context.autolink) {
		text = parseUrl(text)
	}
	if (Array.isArray(text)) {
		return text.map((entry) => {
			if (typeof entry === 'string') {
				return entry
			}
			const { component, props } = entry
			// do not override class of NcLink
			const componentClass = component.name === 'NcLink' ? undefined : 'rich-text--component'
			return h(component, {
				...props,
				class: componentClass,
			})
		})
	}
	return text
}
