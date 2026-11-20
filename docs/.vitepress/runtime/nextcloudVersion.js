/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

// The simulated Nextcloud server version of the examples.
// The library reads the server version once when it is loaded (see `src/utils/legacy.ts`),
// so changing the version requires reloading the page.
// This module must not import anything, as it is also bundled into a classic script for the REPL.

/**
 * @typedef {object} NextcloudVersion
 * @property {string} id - Identifier used in the URL and storage
 * @property {string} label - Name shown in the version selector
 * @property {string} version - The simulated server version
 */

/** @type {NextcloudVersion[]} */
export const NEXTCLOUD_VERSIONS = [
	{ id: 'upcoming', label: 'Upcoming', version: '36.0.0' },
	{ id: '35', label: 'Nextcloud 35', version: '35.0.0' },
	{ id: '34', label: 'Nextcloud 34', version: '34.0.0' },
	{ id: '33', label: 'Nextcloud 33', version: '33.0.0' },
	{ id: '32', label: 'Nextcloud 32', version: '32.0.0' },
	{ id: '31', label: 'Nextcloud 31', version: '31.0.0' },
]

/** Query parameter to select the version, so links with a specific version can be shared */
export const VERSION_QUERY_PARAMETER = 'nc'

const STORAGE_KEY = 'nextcloud-vue-docs:nextcloud-version'

/**
 * Get the version used if none is selected.
 * This is the version the documentation was built for, see `NEXTCLOUD_VERSION` in `lib/viteShared.ts`.
 *
 * @return {NextcloudVersion}
 */
export function getDefaultVersion() {
	// eslint-disable-next-line no-undef -- replaced at build time
	const [major] = NEXTCLOUD_VERSION.split('.')
	return NEXTCLOUD_VERSIONS.find(({ id }) => id === major) ?? NEXTCLOUD_VERSIONS[1]
}

/**
 * Get the selected version from the URL or from the last selection.
 * Within the REPL the URL of the documentation is used, as the REPL runs in an iframe.
 *
 * @return {NextcloudVersion}
 */
export function getSelectedVersion() {
	const find = (id) => NEXTCLOUD_VERSIONS.find((version) => version.id === id)

	let search = window.location.search
	try {
		if (window.parent !== window) {
			search = window.parent.location.search
		}
	} catch {
		// Not allowed to access the parent
	}

	const fromUrl = find(new URLSearchParams(search).get(VERSION_QUERY_PARAMETER))
	if (fromUrl) {
		storeVersion(fromUrl.id)
		return fromUrl
	}

	try {
		return find(window.localStorage.getItem(STORAGE_KEY)) ?? getDefaultVersion()
	} catch {
		// Storage can be disabled
		return getDefaultVersion()
	}
}

/**
 * Select a version and reload the page to apply it
 *
 * @param {string} id - The id of the version
 */
export function selectVersion(id) {
	storeVersion(id)
	const url = new URL(window.location.href)
	url.searchParams.set(VERSION_QUERY_PARAMETER, id)
	window.location.assign(url)
}

/**
 * Remember the selected version
 *
 * @param {string} id - The id of the version
 */
function storeVersion(id) {
	try {
		window.localStorage.setItem(STORAGE_KEY, id)
	} catch {
		// Storage can be disabled
	}
}
