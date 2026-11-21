/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { MarkdownRenderer } from 'vitepress'

import { createMarkdownRenderer } from 'vitepress'
import { DOCS, listComponents, readDocsBlock } from '../.vitepress/lib/components.ts'

export interface ComponentSummary {
	name: string
	description: string
}

declare const data: ComponentSummary[]
export { data }

/**
 * Get the first sentence of the first paragraph of the documentation as plain text summary
 *
 * @param md - The markdown renderer
 * @param markdown - The documentation
 */
function summarize(md: MarkdownRenderer, markdown: string): string {
	const tokens = md.parse(markdown, {})
	// The content of the first top level paragraph, so no lists, tables, quotes or code blocks
	const paragraph = tokens.find((token, index) => token.type === 'inline'
		&& tokens[index - 1]?.type === 'paragraph_open'
		&& tokens[index - 1]?.level === 0)

	const text = (paragraph?.children ?? [])
		.map((child) => {
			switch (child.type) {
				case 'text':
				case 'code_inline':
					return child.content
				case 'softbreak':
				case 'hardbreak':
					return ' '
				default:
					// Formatting, links and inline HTML only contribute their text content
					return ''
			}
		})
		.join('')
		.replace(/\s+/g, ' ')
		.trim()

	const sentence = text.match(/^.+?[.!?](\s|$)/)?.[0].trim() ?? text
	return sentence.length > 160 ? `${sentence.slice(0, 157)}…` : sentence
}

export default {
	watch: ['../../src/components/**/*.vue'],
	async load(): Promise<ComponentSummary[]> {
		const md = await createMarkdownRenderer(DOCS)
		return listComponents().map(({ name, file }) => ({
			name,
			description: summarize(md, readDocsBlock(file)),
		}))
	},
}
