/**
 * SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
// make sure the id is unique
window._nc_vue_element_id = window._nc_vue_element_id ?? 0

/**
 * Get the next element id for use with HTML / CSS.
 * We can not be sure that the app has a prefix setup so we prefix ourself
 */
export function getElementId() {
	return `nc-vue-${window._nc_vue_element_id!++}`
}
