/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ComputedRef, InjectionKey } from 'vue'

export const NC_ACTIONS_IS_SEMANTIC_MENU: InjectionKey<ComputedRef<boolean>> = Symbol.for('NcActions:isSemanticMenu')
export const NC_ACTIONS_CLOSE_MENU: InjectionKey<(returnFocus: boolean) => void> = Symbol.for('NcActions:closeMenu')

// TODO: once NcActions migrated from mixins - add composables to created and use NcAction provider/context
