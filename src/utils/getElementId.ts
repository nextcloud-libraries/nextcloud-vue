/**
 * SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import md5 from 'md5'

// unique hash for this app and library version (make sure that there is no clash with different apps)
const instanceId = md5(`${appName}@${SCOPE_VERSION}`).slice(0, 5)
let id = 0

/**
 * Get the next element id for use with HTML / CSS.
 * We can not be sure that the app has a prefix setup so we prefix ourself
 */
export function getElementId() {
	return `nc${instanceId}-${id++}`
}
