/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ComputedRef, InjectionKey } from 'vue'

/**
 * Enforced dark / light theme state
 *
 * @private
 */
export const INJECTION_KEY_THEME: InjectionKey<ComputedRef<'light' | 'dark' | ''>> = Symbol.for('nc:theme:enforced')
