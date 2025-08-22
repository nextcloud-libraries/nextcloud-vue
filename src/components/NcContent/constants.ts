/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { InjectionKey } from 'vue'

/**
 * Injects a callback to register the app navigation to the content container.
 */
export const HAS_APP_NAVIGATION_KEY: InjectionKey<(hasAppNavigation: boolean) => void> = Symbol.for('NcContent:setHasAppNavigation')

/**
 * Injects the main content container selector
 */
export const CONTENT_SELECTOR_KEY: InjectionKey<string> = Symbol.for('NcContent:selector')
