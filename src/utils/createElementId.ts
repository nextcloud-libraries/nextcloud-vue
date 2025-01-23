/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
// make sure the id is unique
window._nc_vue_element_id = window._nc_vue_element_id ?? 0

/**
 * Get the next element id for use with HTML / CSS
 *
 * We can not be sure that the app has a prefix setup,
 * so we can use `useId` from Vue - so we need to use our own implementation.
 */
export function createElementId(): string {
	return `nc-vue-${window._nc_vue_element_id!++}`
}
