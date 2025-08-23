/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
export default {
	debug: true,

	getLanguage() {
		return 'en-GB'
	},

	getLocale() {
		return 'en_GB'
	},

	isUserAdmin() {
		return true
	},

	Util: {
		naturalSortCompare(a, b) {
			return String(a).localeCompare(String(b))
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

	config: {
		version: '32.0.0',
	},

	appswebroots: {
		calendar: '/apps/calendar',
		deck: '/apps/deck',
		files: '/apps/files',
		spreed: '/apps/spreed',
	},
}
