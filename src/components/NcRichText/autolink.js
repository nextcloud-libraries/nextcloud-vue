/**
 * @copyright Copyright (c) 2022 Julius Härtl <jus@bitgrid.net>
 *
 * @author Julius Härtl <jus@bitgrid.net>
 * @author Raimund Schlüßler <raimund.schluessler@mailbox.org>
 * @author Maksim Sukharev <antreesy.web@gmail.com>
 * @author Grigorii K. Shartsev <me@shgk.me>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import { URL_PATTERN_AUTOLINK } from './helpers.js'

import { visit, SKIP } from 'unist-util-visit'
import { u } from 'unist-builder'
import { getBaseUrl, getRootUrl } from '@nextcloud/router'

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
 * Try to get path for router link from an absolute or relative URL.
 *
 * @param {import('vue-router').default} router - VueRouter instance of the router link
 * @param {string} url - absolute URL to parse
 * @return {string|null} a path that can be useed in the router link or null if this URL doesn't match this router config
 * @example http://cloud.ltd/nextcloud/index.php/app/files/favorites?fileid=2#fragment => /files/favorites?fileid=2#fragment
 */
export const getRoute = (router, url) => {
	/**
	 * http://cloud.ltd /nextcloud /index.php/app/files /favorites?fileid=2#fragment
	 * |_____origin____|__________router-base__________|_________router-path________|
	 * |__________base____________|
	 *                 |___root___|
	 */

	// Router is not defined in the app => not an app route
	if (!router) {
		return null
	}

	const isAbsoluteURL = /^https?:\/\//.test(url)

	// URL is not a link to this Nextcloud server instance => not an app route
	if ((isAbsoluteURL && !url.startsWith(getBaseUrl())) || (!isAbsoluteURL && !url.startsWith(getRootUrl()))) {
		return null
	}

	// Vue 3: router.options.history.base
	const routerBase = router.history.base

	const urlWithoutOrigin = isAbsoluteURL ? url.slice(new URL(url).origin.length) : url

	// Remove index.php - it is optional in general case in both, VueRouter base and the URL
	const urlWithoutOriginAndIndexPhp = url.startsWith((isAbsoluteURL ? getBaseUrl() : getRootUrl()) + '/index.php') ? urlWithoutOrigin.replace('/index.php', '') : urlWithoutOrigin
	const routerBaseWithoutIndexPhp = routerBase.replace('/index.php', '')

	// This URL is not a part of this router by base
	if (!urlWithoutOriginAndIndexPhp.startsWith(routerBaseWithoutIndexPhp)) {
		return null
	}

	// Root route may have an empty '' path, fallback to '/'
	const routerPath = urlWithoutOriginAndIndexPhp.replace(routerBaseWithoutIndexPhp, '') || '/'

	// Check if there is actually matching route in the router for this path
	const route = router.resolve(routerPath).route

	if (!route.matched.length) {
		return null
	}

	return route.fullPath
}
