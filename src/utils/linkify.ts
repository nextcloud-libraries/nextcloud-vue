/**
 * SPDX-FileCopyrightText: 2024 Nick Frasser <https://nfrasser.com>
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { IntermediateRepresentation } from 'linkifyjs'

import escapeHTML from 'escape-html'
import { Options, tokenize } from 'linkifyjs'

/**
 * Convert a plan text string to an HTML string with links. Expects that the
 * given strings does not contain any HTML entities. Use the linkify-html
 * interface if you need to parse HTML entities.
 *
 * @param str - String to linkify
 */
export function linkifyString(str: string): string {
	const options = new Options({
		defaultProtocol: 'https',
		target: '_blank',
		className: 'external linkified',
		attributes: {
			rel: 'nofollow noopener noreferrer',
		},
	}, defaultRender)

	const tokens = tokenize(str)
	const result: string[] = []

	for (const token of tokens) {
		if (token.t === 'nl' && options.get('nl2br')) {
			result.push('<br>\n')
		} else if (!token.isLink || !options.check(token)) {
			result.push(escapeHTML(token.toString()))
		} else {
			result.push(options.render(token))
		}
	}

	return result.join('')
}

/**
 * Escape quotation marks in links for href attribute
 *
 * @param href The link to escape
 */
function escapeAttr(href: string): string {
	return href.replace(/"/g, '&quot;')
}

/**
 * Map attributes to a string.
 *
 * @param attributes - The attribute mapping
 */
function attributesToString(attributes: Record<string, string>): string {
	const result: string[] = []
	for (const attr in attributes) {
		const val = attributes[attr] + ''
		result.push(`${attr}="${escapeAttr(val)}"`)
	}
	return result.join(' ')
}

/**
 * Render the link.
 *
 * @param options - Options
 * @param options.tagName - The tag name
 * @param options.attributes - The attributes
 * @param options.content - The text content
 */
function defaultRender({ tagName, attributes, content }: IntermediateRepresentation): string {
	return `<${tagName} ${attributesToString(attributes)}>${escapeHTML(content)}</${tagName}>`
}
