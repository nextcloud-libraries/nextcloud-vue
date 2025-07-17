/*!
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Literal } from 'unist'

/**
 * Unist literal node with string value like code blocks or text nodes
 */
export interface TextNode extends Literal {
	value: string
}

/**
 * Regex pattern to match links to be resolved by the link-reference provider
 */
export const URL_PATTERN = /(\s|^)(https?:\/\/)([-A-Z0-9+_.]+(?::[0-9]+)?(?:\/[-A-Z0-9+&@#%?=~_|!:,.;()]*)*)(\s|$)/ig

/**
 * Regex pattern to identify strings as links and then making them clickable
 */
export const URL_PATTERN_AUTOLINK = /(\s|\(|^)((https?:\/\/)([-A-Z0-9+_.]+[-A-Z0-9]+(?::[0-9]+)?(?:\/[-A-Z0-9+&@#%?=~_|!:,.;()]*)*))(?=\s|\)|$)/ig
