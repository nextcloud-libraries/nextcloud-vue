/**
 * @copyright Copyright (c) 2023 Raimund Schlüßler <raimund.schluessler@mailbox.org>
 *
 * @author Raimund Schlüßler <raimund.schluessler@mailbox.org>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import type { VNode, VNodeNormalizedChildren } from 'vue'
import { Fragment, Comment, Text } from 'vue'

/**
 * Checks whether a slot is populated
 *
 * @param vnodes The array of vnodes to check
 */
const isSlotPopulated = function(vnodes?: VNode[] | VNodeNormalizedChildren) {
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

export default isSlotPopulated
