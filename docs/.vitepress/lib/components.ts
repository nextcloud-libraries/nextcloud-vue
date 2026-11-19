/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { parse } from '@vue/compiler-sfc'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/** Root of the repository */
export const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '../../..')

/** Directory of the documentation sources */
export const DOCS = join(ROOT, 'docs')

export interface ComponentInfo {
	/** Name of the component as exported by the library */
	name: string
	/** Absolute path of the SFC */
	file: string
}

/**
 * List all public components, which are all components exported by `src/components/index.ts`.
 */
export function listComponents(): ComponentInfo[] {
	const index = readFileSync(join(ROOT, 'src/components/index.ts'), 'utf8')
	const components: ComponentInfo[] = []
	for (const [, name, dir] of index.matchAll(/export \{ default as (\w+) \} from '\.\/(\w+)\/index\.[jt]s'/g)) {
		const entry = ['index.ts', 'index.js']
			.map((file) => join(ROOT, 'src/components', dir!, file))
			.find((file) => existsSync(file))
		if (!entry) {
			continue
		}
		const target = readFileSync(entry, 'utf8').match(/export \{ default \} from '\.\/([^']+\.vue)'/)?.[1] ?? `${name}.vue`
		const file = join(dirname(entry), target)
		if (existsSync(file)) {
			components.push({ name: name!, file })
		}
	}
	return components.sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Read the content of the custom `<docs>` block of a SFC.
 *
 * @param file - Path of the SFC
 */
export function readDocsBlock(file: string): string {
	const { descriptor } = parse(readFileSync(file, 'utf8'), { filename: file, ignoreEmpty: false })
	return descriptor.customBlocks.find((block) => block.type === 'docs')?.content.trim() ?? ''
}

/**
 * Rewrite links of the old documentation (vue-styleguidist) to the new routes.
 * E.g. `[NcActions](#NcActions)` or `[Fields](#/Components/NcFields?id=ncinputfield)`.
 *
 * @param markdown - The markdown to rewrite
 * @param names - Names of all public components
 */
export function rewriteLegacyLinks(markdown: string, names: Set<string>): string {
	const findComponent = (name: string) => {
		const candidates = [name, `Nc${name}`]
		return candidates.find((candidate) => names.has(candidate))
			?? [...names].find((candidate) => candidates.some((c) => c.toLowerCase() === candidate.toLowerCase()))
	}

	return markdown.replace(/\]\(#(\/Components\/)?([\w-]+)(?:\?id=([\w-]+))?\)/g, (match, _prefix, target, id) => {
		const fromId = id ? findComponent(id.replace(/-\d+$/, '')) : undefined
		const component = fromId ?? findComponent(target)
		if (!component) {
			return match
		}
		return `](/components/${component})`
	})
}
