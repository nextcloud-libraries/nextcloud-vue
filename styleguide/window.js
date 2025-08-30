/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

// Global variables
window._oc_webroot = ''

window.OC = {
	debug: true,
	getCurrentUser() {
		return {
			uid: 'admin',
			displayName: 'Administrator',
		}
	},
	generateUrl() {
		return 'https://raw.githubusercontent.com/nextcloud/promo/master/nextcloud-icon.png'
	},
	getLanguage() {
		return 'en'
	},
	isUserAdmin() {
		return true
	},
	config: {
		// added by webpack
		version: NEXTCLOUD_VERSION,
	},
	Util: {
		/**
		 * Compare two strings to provide a natural sort
		 *
		 * @param {string} a first string to compare
		 * @param {string} b second string to compare
		 * @return {number} -1 if b comes before a, 1 if a comes before b
		 * or 0 if the strings are identical
		 */
		naturalSortCompare: function naturalSortCompare(a, b) {
			let x
			const aa = chunkify(a)
			const bb = chunkify(b)

			for (x = 0; aa[x] && bb[x]; x++) {
				if (aa[x] !== bb[x]) {
					const aNum = Number(aa[x])
					const bNum = Number(bb[x]) // note: == is correct here

					/* eslint-disable-next-line */
					if (aNum == aa[x] && bNum == bb[x]) {
						return aNum - bNum
					} else {
					// Note: This locale setting isn't supported by all browsers but for the ones
					// that do there will be more consistency between client-server sorting
						return aa[x].localeCompare(bb[x], OC.getLanguage())
					}
				}
			}

			return aa.length - bb.length
		},
	},
	coreApps: [
		'',
		'admin',
		'log',
		'core/search',
		'core',
		'3rdparty',
	],
	appswebroots: {
		calendar: '/apps/calendar',
		deck: '/apps/deck',
		files: '/apps/files',
		spreed: '/apps/spreed',
	},
	webroot: '',
}
window.OCA = {}

/**
 * From server util.js
 *
 * @param {string} t The string to chunkify
 * @return {Array}
 */
function chunkify(t) {
	// Adapted from http://my.opera.com/GreyWyvern/blog/show.dml/1671288
	const tz = []
	let x = 0
	let y = -1
	let n = 0
	let c

	while (x < t.length) {
		c = t.charAt(x) // only include the dot in strings

		const m = !n && (c === '.' || (c >= '0' && c <= '9'))

		if (m !== n) {
		// next chunk
			y++
			tz[y] = ''
			n = m
		}

		tz[y] += c
		x++
	}

	return tz
}
