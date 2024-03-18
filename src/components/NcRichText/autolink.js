import { URL_PATTERN_AUTOLINK } from './helpers.js'

import { visit, SKIP } from 'unist-util-visit'
import { u } from 'unist-builder'
import { getBaseUrl } from '@nextcloud/router'

const NcLink = {
	name: 'NcLink',
	props: {
		href: {
			type: String,
			required: true,
		},
	},
	render(h) {
		return h('a', {
			attrs: {
				href: this.href,
				rel: 'noopener noreferrer',
				target: '_blank',
				class: 'rich-text--external-link',
			},
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

/**
 * Try to get path for router link from absolute URL
 *
 * @param {import('vue-router').default} router - VueRouter instance of router link
 * @param {string} url - absolute URL to parse
 * @return {string|null} router link path or null if this URL doesn't match this router config
 * @example http://cloud.ltd/nextcloud/index.php/app/files/favorites?fileid=2#fragment => /files/favorites?fileid=2#fragment
 */
export const getRoute = (router, url) => {
	// http://cloud.ltd/nextcloud/index.php/app/files/favorites?fileid=2#fragment
	// |_____origin____|_________router-base_________|______router-location______|
	// |__________base___________|

	// Skip if Router is not defined in app, or URL is not a link to this Nextcloud server instance
	if (!router || !url.startsWith(getBaseUrl())) {
		return null
	}

	const origin = new URL(url).origin
	const urlWithoutOrigin = url.replace(origin, '')

	// Remove index.php - it is optional in general case
	const urlWithoutOriginAndIndexPhp = url.startsWith(getBaseUrl() + '/index.php') ? urlWithoutOrigin.replace('/index.php', '') : urlWithoutOrigin
	const routerBaseWithoutIndexPhp = router.history.base.replace('/index.php', '')

	// This URL is not a part of this router
	if (!urlWithoutOriginAndIndexPhp.startsWith(routerBaseWithoutIndexPhp)) {
		return null
	}

	// Root route may have empty '' path, fallback to '/'
	return urlWithoutOriginAndIndexPhp.replace(routerBaseWithoutIndexPhp, '') || '/'
}
