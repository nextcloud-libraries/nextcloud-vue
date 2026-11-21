/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Plugin } from 'vite'

type FilteredHook = { filter?: { id?: RegExp }, handler: (...args: unknown[]) => unknown }

/**
 * Apply the `filter` of object hooks manually.
 * The plugins of the library use hook filters, which are not supported by Vite 5 used by VitePress.
 *
 * @param plugin - The plugin to wrap
 */
export function applyHookFilters(plugin: Plugin): Plugin {
	for (const name of ['resolveId', 'load', 'transform'] as const) {
		const hook = plugin[name] as FilteredHook | undefined
		if (typeof hook !== 'object' || !hook.filter?.id) {
			continue
		}
		const { filter, handler } = hook
		// resolveId receives the source, load and transform receive the id as first or second argument
		const idIndex = name === 'transform' ? 1 : 0
		plugin[name] = function(this: unknown, ...args: unknown[]) {
			if (filter.id!.test(String(args[idIndex]))) {
				return handler.apply(this, args)
			}
		} as never
	}
	return plugin
}
