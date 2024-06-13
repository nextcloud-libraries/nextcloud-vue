/**
 * SPDX-FileCopyrightText: 2021 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import linkifyStr from 'linkify-string'

/**
 * Linkify text
 *
 * @param {string} text The text to linkify
 * @return {string} The linkified string
 */
const Linkify = (text) => {
	return linkifyStr(text, {
		defaultProtocol: 'https',
		target: '_blank',
		className: 'external linkified',
		attributes: {
			rel: 'nofollow noopener noreferrer',
		},
	})
}

export default Linkify
