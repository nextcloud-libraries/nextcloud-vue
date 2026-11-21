/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

declare module 'virtual:nextcloud-server-styles' {
	/**
	 * Load the styles of the Nextcloud server of a version
	 *
	 * @param id - The id of the version (see `runtime/nextcloudVersion.js`)
	 */
	export function loadServerStyles(id: string): Promise<void>
}
