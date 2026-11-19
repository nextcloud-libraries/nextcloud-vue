/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Plugin } from 'postcss'

/** Class of the container the server styles are scoped to */
export const SCOPE_CLASS = 'nc-example-scope'

/**
 * Selector of all elements the styles of the examples apply to:
 * The examples and elements teleported to the body by examples (like modals or popovers).
 * Using `:where` keeps the original specificity of the styles.
 */
export const SCOPE_SELECTOR = `:where(.${SCOPE_CLASS}, body > :not(#app))`

/**
 * PostCSS plugin to scope the global styles of the Nextcloud server to the examples.
 * The server styles contain a CSS reset and global element styles,
 * which would otherwise break the layout of the documentation itself.
 *
 * @param files - Pattern of the style files to scope
 */
export function scopeServerStyles(files: RegExp): Plugin {
	const scope = SCOPE_SELECTOR

	/**
	 * Scope a selector, rules for the document itself (like `body`) are dropped
	 * as they would break the layout of the examples (e.g. fixed position).
	 *
	 * @param selector - The selector to scope
	 */
	const scopeSelector = (selector: string): string | undefined => {
		// Theme selectors are set on the body, so the scope must come after them
		const theme = selector.match(/^(?:body)?((?:\[data-theme[^\]]*\])+)(.*)$/)
		if (theme) {
			return theme[2] ? `${theme[1]} ${scope}${theme[2]}` : undefined
		}
		const root = selector.match(/^(?::root|html|body)((?:\[[^\]]*\]|[.#:][\w-]+)*)(.*)$/)
		if (root) {
			return root[2]!.trim() ? `${scope}${root[1]}${root[2]}` : undefined
		}
		return `${scope} ${selector}`
	}

	return {
		postcssPlugin: 'nextcloud-vue-docs:scope-server-styles',
		Once(root, { result }) {
			if (!files.test(result.opts.from ?? '')) {
				return
			}

			root.walkRules((rule) => {
				// Keyframes must not be scoped
				if (rule.parent?.type === 'atrule' && /keyframes$/.test((rule.parent as { name: string }).name)) {
					return
				}
				// Custom properties on the document are harmless and needed by teleported elements
				const onlyVariables = rule.nodes.every((node) => node.type !== 'decl' || node.prop.startsWith('--'))
				if (onlyVariables && rule.selectors.every((selector) => /^(:root|html|body)$/.test(selector))) {
					return
				}
				const selectors = rule.selectors.map(scopeSelector).filter((selector) => selector !== undefined)
				if (selectors.length > 0) {
					rule.selectors = selectors
				} else {
					rule.remove()
				}
			})
		},
	}
}
