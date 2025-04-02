/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { InjectionKey, ComputedRef } from 'vue'

export const NC_ACTIONS_IS_SEMANTIC_MENU: InjectionKey<ComputedRef<boolean>> = Symbol.for('NcActions:isSemanticMenu')

// TODO: once NcActions migrated from mixins - add composables to created and use NcAction provider/context
