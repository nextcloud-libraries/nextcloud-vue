/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ComponentInternalInstance } from 'vue'

import { getCurrentInstance, warn } from 'vue'

/**
 * Get the parent instance of the instance only if the instance is the root node of the parent
 * - Parent > Child - same root node
 * - Parent > div > Child - different root node
 * - Parent > WrapperWithSlot > Child - different root node
 *
 * @param instance - Current instance (internal)
 */
function getSameNodeParent(instance: ComponentInternalInstance): ComponentInternalInstance | null {
	if (!instance.parent) {
		return null
	}

	if ('vapor' in instance || 'vapor' in instance.parent) {
		warn('Vapor instances are not supported in useScopeIdAttrs :(')
		return null
	}

	if (instance.parent.subTree !== instance.vnode) {
		return null
	}

	return instance.parent
}

/**
 * Get all ancestor instances of the instance that are on the same root node
 *
 * @param instance - Current instance (internal)
 */
function getSameNodeAncestors(instance: ComponentInternalInstance): ComponentInternalInstance[] {
	const ancestors: ComponentInternalInstance[] = [instance]
	let parent = getSameNodeParent(instance)
	while (parent) {
		ancestors.push(parent)
		parent = getSameNodeParent(parent)
	}
	return ancestors
}

/**
 * Get a binding object for all data-v-scopeid attributes that are supposed to be on the root node.
 * It allows to have scoped styles from parents in edge cases not covered by Vue:
 * - Teleport on the root
 * - Fragments
 *
 * @todo Do we need to support slotScopeIds for `:slotted()`?
 *
 * @example
 * ```ts
 * <script setup>
 * import { useScopeIdAttrs } from './useScopeIdAttrs.ts'
 * const scopeIdAttrs = useScopeIdAttrs()
 * </script>
 * <template>
 *   <teleport to="body">
 *     <div v-bind="scopeIdAttrs" />
 *   </teleport>
 * </template>
 * ```
 */
export function useScopeIdAttrs() {
	const instance = getCurrentInstance()

	if (!instance) {
		throw new Error('useScopeId must be called within a setup context')
	}

	const sameNodeAncestors = getSameNodeAncestors(instance)
	const scopeIds = sameNodeAncestors.map((instance) => instance.vnode.scopeId).filter(Boolean)
	const scopeIdAttrs = Object.fromEntries(scopeIds.map((scopeId) => [scopeId, '']))
	return scopeIdAttrs
}
