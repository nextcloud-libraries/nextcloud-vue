/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * @vitest-environment node
 */

import { globSync } from 'glob'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createMarkdownRenderer } from 'vitepress'
import { describe, expect, it } from 'vitest'
import { DOCS, listComponents, readDocsBlock, ROOT } from '../../../docs/.vitepress/lib/components.ts'
import { isLiveExample, toSfc, validateExample } from '../../../docs/.vitepress/lib/examples.ts'
import { REPL_DEPENDENCIES } from '../../../docs/.vitepress/lib/replBundle.ts'

const pages: [string, string][] = [
	...listComponents().map(({ file }) => [file.slice(ROOT.length + 1), readDocsBlock(file)] as [string, string]),
	...globSync('**/*.md', { cwd: DOCS, ignore: ['.vitepress/**'] })
		.map((file) => [`docs/${file}`, readFileSync(join(DOCS, file), 'utf8')] as [string, string]),
]

const md = await createMarkdownRenderer(DOCS)
const examples = pages.flatMap(([page, source]) => md.parse(source, {})
	.filter((token) => token.type === 'fence' && isLiveExample(token.info))
	.map((token) => [`${page}:${(token.map?.[0] ?? 0) + 1}`, toSfc(token.content)] as const))

/**
 * Check if a module can be imported by examples within the REPL
 *
 * @param specifier - The imported module
 */
function isAvailableInRepl(specifier: string): boolean {
	return specifier === 'vue'
		|| specifier in REPL_DEPENDENCIES
		|| /^@nextcloud\/vue(\/(components|composables|directives|functions)\/\w+)?$/.test(specifier)
		|| /^@mdi\/svg\/svg\/[\w-]+\.svg\?raw$/.test(specifier)
}

describe('Documentation examples', () => {
	it('finds the examples', () => {
		expect(examples.length).toBeGreaterThan(200)
	})

	it.each(examples)('%s is a valid component', (_, code) => {
		expect(validateExample(code)).toBeUndefined()
	})

	it.each(examples)('%s only uses features supported by the REPL', (_, code) => {
		const imports = [...code.matchAll(/(?:import|from)\s+['"]([^'"]+)['"]/g)].map(([, specifier]) => specifier!)
		expect(imports.filter((specifier) => !isAvailableInRepl(specifier))).toEqual([])
		// Pre-processors are not available in the browser
		expect(code).not.toMatch(/<style[^>]*\slang=["'](?!css)/)
	})
})
