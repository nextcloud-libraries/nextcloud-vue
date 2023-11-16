import { URL_PATTERN_AUTOLINK } from './helpers.js'

import { visit, SKIP } from 'unist-util-visit'
import { u } from 'unist-builder'
import { h } from 'vue'

const NcLink = {
	name: 'NcLink',
	props: {
		href: {
			type: String,
			required: true,
		},
	},
	render() {
		return h('a', {
			href: this.href,
			rel: 'noopener noreferrer',
			target: '_blank',
			class: 'rich-text--external-link',
		}, [this.href.trim()])
	},
}

export const remarkAutolink = function({ autolink, useMarkdown }) {
	return function(tree) {

		if (!useMarkdown || !autolink) {
			return
		}

		visit(tree, (node) => node.type === 'text', (node, index, parent) => {
			let parsed = parseUrl(node.value)
			parsed = parsed.map((n) => {
				if (typeof n === 'string') {
					return u('text', n)
				}

				return u('link', {
					url: n.props.href,
				}, [u('text', n.props.href)])
			}).filter((x) => x)

			parent.children.splice(index, 1, ...parsed.flat())
			return [SKIP, index + parsed.flat().length]
		})
	}
}

export const parseUrl = (text) => {
	let match = URL_PATTERN_AUTOLINK.exec(text)
	const list = []
	let start = 0
	while (match !== null) {
		let href = match[2]
		let textAfter
		let textBefore = text.substring(start, match.index + match[1].length)
		if (href[0] === ' ') {
			textBefore += href[0]
			href = href.substring(1).trim()
		}
		const lastChar = href[(href.length - 1)]
		if (lastChar === '.' || lastChar === ',' || lastChar === ';' || (match[0][0] === '(' && lastChar === ')')) {
			href = href.substring(0, href.length - 1)
			textAfter = lastChar
		}
		list.push(textBefore)
		list.push({ component: NcLink, props: { href } })
		if (textAfter) {
			list.push(textAfter)
		}
		start = match.index + match[0].length
		match = URL_PATTERN_AUTOLINK.exec(text)
	}
	list.push(text.substring(start))
	const joinedText = list.map((item) => typeof item === 'string' ? item : item.props.href).join('')
	if (text === joinedText) {
		return list
	}
	console.error('Failed to reassemble the chunked text: ' + text)
	return text
}
