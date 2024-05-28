/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
module.exports = {
	env: {
		jest: true,
		'cypress/globals': true,
	},
	extends: [
		'plugin:cypress/recommended',
	],
}
