/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { getBaseUrl, getRootUrl } from '@nextcloud/router'
import { u } from 'unist-builder'
import { SKIP, visit } from 'unist-util-visit'
import { URL_PATTERN_AUTOLINK } from './helpers.js'

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

/**
 * Remark plugin for autolink parsing
 *
 * @param {object} root0 - Options
 * @param {boolean} root0.autolink - Whether to enable autolink parsing
 * @param {boolean} root0.useMarkdown - Whether markdown is being used
 * @param {boolean} root0.useExtendedMarkdown - Whether extended markdown is being used
 */
export function remarkAutolink({ autolink, useMarkdown, useExtendedMarkdown }) {
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

/**
 * Parse URLs in text and create link components
 *
 * @param {string} text - Text to parse
 * @return {Array<string | { component: typeof NcLink, props: { href: string } }>} Array of text parts - plain text and description of the link component to use
 */
export function parseUrl(text) {
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
 * Try to get path for router link from an absolute or relative URL.
 *
 * @param {import('vue-router').default} router - VueRouter instance of the router link
 * @param {string} url - absolute URL to parse
 * @return {string|null} a path that can be used in the router link or null if this URL doesn't match this router config
 * @example http://cloud.ltd/nextcloud/index.php/apps/files/favorites?fileid=2#fragment => /files/favorites?fileid=2#fragment
 */
export function getRoute(router, url) {
	/**
	 * http://cloud.ltd /nextcloud /index.php /apps/files /favorites?fileid=2#fragment
	 * |_____origin____|___________router-base____________|                           |
	 * |__________base____________|          |______________relative-url______________|
	 * |               |___root___|_optional_|__app-base__|_________router-path_______|
	 */

	const removePrefix = (str, prefix) => str.startsWith(prefix) ? str.slice(prefix.length) : str
	const removePrefixes = (str, ...prefixes) => prefixes.reduce((acc, prefix) => removePrefix(acc, prefix), str)

	// Router is not defined in the app => not an app route
	if (!router) {
		return null
	}

	const isAbsoluteURL = /^https?:\/\//.test(url)

	// URL is a "mailto:", "tel:" or any custom app protocol link
	const isNonHttpLink = /^[a-z][a-z0-9+.-]*:.+/.test(url)
	if (!isAbsoluteURL && isNonHttpLink) {
		return null
	}

	// URL is not a link to this Nextcloud server instance => not an app route
	if (isAbsoluteURL && !url.startsWith(getBaseUrl())) {
		return null
	}

	if (!isAbsoluteURL && !url.startsWith('/')) {
		// Relative URL without a leading slash are not allowed
		// VueRouter handles such urls according to the URL RFC,
		// for example, being on /call/abc page, link "def" is resolved as "/call/def" relative to "/call/".
		// We don't want to support such links,
		// so relative URL MUST start with a slash.
		return null
	}

	// URL relative to the instance root
	const relativeUrl = isAbsoluteURL ? removePrefixes(url, getBaseUrl(), '/index.php') : url

	// Router base relative to the instance root (app-base above)
	const relativeRouterBase = removePrefixes(router.history.base, getRootUrl(), '/index.php')

	// Root route may have an empty '' path, fallback to '/'
	const potentialRouterPath = removePrefixes(relativeUrl, relativeRouterBase) || '/'

	// Check if there is actually matching route in the router for this path
	const route = router.resolve(potentialRouterPath).route

	if (!route.matched.length) {
		return null
	}

	return route.fullPath
}
