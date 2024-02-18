import { URL_PATTERN_AUTOLINK } from './helpers.js'

import type { RouteLocation, Router } from 'vue-router'
import { getBaseUrl, getRootUrl } from '@nextcloud/router'
import { u } from 'unist-builder'
import { visit, SKIP } from 'unist-util-visit'
import { defineComponent, h } from 'vue'

const NcLink = defineComponent({
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
})

export const remarkAutolink = function({ autolink, useMarkdown, useExtendedMarkdown }) {
	return function(tree) {
		// remark-gfm has its own autolink parser which can not be disabled
		// and thus a local one is not needed
		if (useExtendedMarkdown || !useMarkdown || !autolink) {
			return
		}

		visit(tree, (node) => node.type === 'text', (node, index, parent) => {
			let parsed = parseUrl(node.value)
			if (typeof parsed === 'string') {
				parsed = [u('text', parsed)]
			} else {
				parsed = parsed
					.map((n) => {
						if (typeof n === 'string') {
							return u('text', n)
						}

						return u('link', {
							url: n.props.href,
						}, [u('text', n.props.href)])
					})
					.filter((x) => x)
					.flat()
			}

			parent.children.splice(index, 1, ...parsed)
			return [SKIP, (index ?? 0) + parsed.length]
		})
	}
}

export const parseUrl = (text: string) => {
	let match = URL_PATTERN_AUTOLINK.exec(text)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const list: (string|Record<string, any>)[] = []
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

export const getRoute = (router: Router, url: string): RouteLocation | null => {
	const isAbsolutURL = url.match(/https?:\/\//)

	// Skip if Router is not defined in app, or root url does not match
	if (!router || (isAbsolutURL && !url.includes(getBaseUrl()))) {
		return null
	}

	// Remove webroot
	if (isAbsolutURL) {
		url = url.slice(getBaseUrl().length)
	} else {
		url = url.slice(getRootUrl().length)
	}
	// Remove base URL for matching
	url = url.slice(router.options.history.base.length)

	const route = router.resolve(url)
	if (route.name || route.matched.length > 0) {
		return route
	}
	return null
}
