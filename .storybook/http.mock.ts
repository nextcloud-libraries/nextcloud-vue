/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

// A copy of styleguide/global.requires.js
// TODO: use proper mocking with msw.io
// @ts-nocheck

import axios from '@nextcloud/axios'

const USER_GROUPS = [
	{ id: 'admin', displayname: 'The administrators' },
	{ id: 'accounting', displayname: 'Accounting team' },
	{ id: 'developer', displayname: 'Engineering team' },
	{ id: 'support', displayname: 'Support crew' },
	{ id: 'users', displayname: 'users' },
]

/**
 * Mock some requests for docs
 *
 * @param {object} error Axios error
 */
function mockRequests(error) {
	const { request } = error
	let data = null

	// Mock requesting groups
	const requestGroups = request.responseURL.match(/cloud\/groups\/details\?search=([^&]*)&limit=\d+$/)
	if (requestGroups) {
		data = { groups: USER_GROUPS.filter(e => !requestGroups[1] || e.displayname.startsWith(requestGroups[1]) || e.id.startsWith(requestGroups[1])) }
	}

	if (data) {
		return Promise.resolve({ data: { ocs: { data } } })
	}
	return Promise.reject(error)
}

axios.interceptors.response.use((r) => r, e => mockRequests(e))
