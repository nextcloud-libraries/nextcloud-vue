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

export const remarkAutolink = function({ autolink, useMarkdown, useExtendedMarkdown }) {
	return function(tree) {
		// remark-gfm has its own autolink parser which can not be disabled
		// and thus a local one is not needed
		if (useExtendedMarkdown || !useMarkdown || !autolink) {
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

export const getRoute = (router, url) => {
	// Skip if Router is not defined in app, or baseUrl does not match
	if (!router || !url.includes(getBaseUrl())) {
		return null
	}

	const regexArray = router.getRoutes()
		// route.regex matches only complete string (^.$), need to remove these characters
		.map(route => new RegExp(route.regex.source.slice(1, -1), route.regex.flags))

	for (const regex of regexArray) {
		const match = url.search(regex)
		if (match !== -1) {
			return url.slice(match)
		}
	}
}
