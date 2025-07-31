/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ComputedRef, InjectionKey } from 'vue'

/**
 * Enforced dark / light theme state
 *
 */
export const INJECTION_KEY_THEME: InjectionKey<ComputedRef<'light' | 'dark' | ''> | undefined> = Symbol.for('nc:theme:enforced')
