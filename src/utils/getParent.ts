/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ComponentPublicInstance } from 'vue'

/**
 * Get the first parent component matching the provided name
 *
 * @param context - The component to search from (usually this)
 * @param name - The parent name
 */
export function getParent(context: ComponentPublicInstance, name: string) {
	let parent = context.$parent
	while (parent) {
		if (parent.$options.name === name) {
			return parent
		}
		parent = parent.$parent
	}
}
