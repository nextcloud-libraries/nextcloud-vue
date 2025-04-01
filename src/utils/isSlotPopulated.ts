/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { VNode, VNodeNormalizedChildren } from 'vue'
import { Fragment, Comment, Text } from 'vue'

/**
 * Checks whether a slot is populated
 *
 * @param vnodes The array of vnodes to check
 */
export function isSlotPopulated(vnodes?: VNode[] | VNodeNormalizedChildren) {
	return Array.isArray(vnodes) && vnodes.some(node => {
		if (node === null) return false
		if (typeof node === 'object') {
			const vnode = node as VNode
			if (vnode.type === Comment) return false
			if (vnode.type === Fragment && !isSlotPopulated(vnode.children)) return false
			if (vnode.type === Text && !(vnode.children as string).trim()) return false
		}
		return true
	})
}
