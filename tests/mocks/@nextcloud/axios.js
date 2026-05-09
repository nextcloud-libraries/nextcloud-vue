/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

module.exports = {
	default: {
		get: () => Promise.resolve({ data: {} }),
		post: () => Promise.resolve({ data: {} }),
		put: () => Promise.resolve({ data: {} }),
		delete: () => Promise.resolve({ data: {} }),
		patch: () => Promise.resolve({ data: {} }),
		request: () => Promise.resolve({ data: {} }),
	},
	__esModule: true,
}
