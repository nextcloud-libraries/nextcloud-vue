/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ComputedRef, InjectionKey } from 'vue'

/**
 * The injection key for injecting the app name provided by `NcContent`.
 */
export const INJECT_APP_NAME_KEY: InjectionKey<ComputedRef<string>> = Symbol('appName')

/**
 * The injection key for injecting the content selector of the app's main content container.
 */
export const INJECT_CONTENT_SELECTOR: InjectionKey<string> = Symbol('NcContent:selector')

/**
 * The injection key for injecting a callback to tell the `NcContent` whether the app navigation is available or not.
 */
export const INJECT_CONTENT_HAS_NAVIGATION: InjectionKey<(value: boolean) => void> = Symbol('NcContent:setHasAppNavigation')
