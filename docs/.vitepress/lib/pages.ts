/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ApiTag, ComponentApi } from './api.ts'
import type { ComponentInfo } from './components.ts'

import { getComponentApi } from './api.ts'
import { readDocsBlock, rewriteLegacyLinks } from './components.ts'

/**
 * Render the markdown page of a component
 *
 * @param component - The component
 * @param names - Names of all public components
 */
export async function renderComponentPage(component: ComponentInfo, names: Set<string>): Promise<string> {
	const docs = rewriteLegacyLinks(readDocsBlock(component.file), names)
	const api = getComponentApi(component.file)

	return [
		`# ${component.name}`,
		'',
		'```js',
		`import ${component.name} from '@nextcloud/vue/components/${component.name}'`,
		'```',
		'',
		docs,
		'',
		renderApi(api),
	].join('\n')
}

/**
 * Render the API of a component as markdown tables
 *
 * @param api - The API of the component
 */
export function renderApi(api: ComponentApi): string {
	const sections: string[] = []

	if (api.props.length > 0) {
		sections.push(table('Props', ['Name', 'Type', 'Default', 'Description'], api.props.map((prop) => [
			name(prop.name, prop.tags, prop.required ? ' **(required)**' : ''),
			code(prop.type),
			prop.default !== undefined ? code(prop.default) : '',
			description(prop.description, prop.tags),
		])))
	}

	if (api.events.length > 0) {
		sections.push(table('Events', ['Name', 'Payload', 'Description'], api.events.map((event) => [
			name(event.name, event.tags),
			event.payload ? code(event.payload) : '',
			description(event.description, event.tags),
		])))
	}

	if (api.slots.length > 0) {
		sections.push(table('Slots', ['Name', 'Bindings', 'Description'], api.slots.map((slot) => [
			name(slot.name, slot.tags),
			slot.bindings ? code(slot.bindings) : '',
			description(slot.description, slot.tags),
		])))
	}

	if (api.exposed.length > 0) {
		sections.push(table('Exposed', ['Name', 'Type', 'Description'], api.exposed.map((exposed) => [
			name(exposed.name, exposed.tags),
			exposed.type ? code(exposed.type) : '',
			description(exposed.description, exposed.tags),
		])))
	}

	if (sections.length === 0) {
		return ''
	}
	// The content must not be compiled by Vue, as it can contain mustaches or HTML of the source
	return ['## API', '', '::: v-pre', ...sections, ':::', ''].join('\n')
}

/**
 * Render a markdown table with a heading
 *
 * @param heading - The heading of the table
 * @param columns - The column names
 * @param rows - The cells of all rows
 */
function table(heading: string, columns: string[], rows: string[][]): string {
	return [
		`### ${heading}`,
		'',
		`| ${columns.join(' | ')} |`,
		`| ${columns.map(() => '---').join(' | ')} |`,
		...rows.map((cells) => `| ${cells.map(escapeCell).join(' | ')} |`),
		'',
	].join('\n')
}

/**
 * Render the name of an entry
 *
 * @param value - The name
 * @param tags - The tags of the entry
 * @param suffix - Additional markdown after the name
 */
function name(value: string, tags: ApiTag[], suffix = ''): string {
	// vue-styleguidist needed placeholder entries for "any other" props or events
	const rendered = value.trim() ? code(value) : '…'
	const deprecated = tags.some(({ name }) => name === 'deprecated')
	return (deprecated ? `~~${rendered}~~` : rendered) + suffix
}

/**
 * Render the description of an entry with the relevant tags
 *
 * @param text - The description
 * @param tags - The tags of the entry
 */
function description(text: string, tags: ApiTag[]): string {
	const parts = [escapeHtml(text.trim())]
	for (const tag of tags) {
		switch (tag.name) {
			case 'deprecated':
				parts.push(`**Deprecated**${tag.text ? `: ${escapeHtml(tag.text)}` : ''}`)
				break
			case 'since':
				parts.push(`*Since ${tag.text}*`)
				break
			case 'see':
				parts.push(`See ${/^https?:\/\//.test(tag.text ?? '') ? `<${tag.text}>` : escapeHtml(tag.text ?? '')}`)
				break
			case 'example':
				parts.push(`Example: ${code(tag.text ?? '')}`)
				break
		}
	}
	return parts.filter(Boolean).join('\n\n')
}

/**
 * Escape HTML tags outside of code spans, the descriptions are written as plain text or markdown.
 * E.g. "Wrap it in a <NcActions>" must not become an (unclosed) element.
 *
 * @param text - The text to escape
 */
function escapeHtml(text: string): string {
	return text
		.split(/(`+[^`]*`+)/)
		.map((part, index) => (index % 2 === 1 ? part : part.replace(/<(?=[a-zA-Z/!])/g, '&lt;')))
		.join('')
}

/**
 * Render a value as inline code
 *
 * @param value - The value
 */
function code(value: string): string {
	const singleLine = value.replace(/\s*\n\s*/g, ' ')
	const fence = singleLine.includes('`') ? '``' : '`'
	return `${fence}${singleLine}${fence}`
}

/**
 * Escape a table cell, tables do not support line breaks or pipes
 *
 * @param value - The content of the cell
 */
function escapeCell(value: string): string {
	return value
		.trim()
		.replace(/\|/g, '\\|')
		// Keep paragraphs, but join the lines of a paragraph
		.split(/\n\s*\n/)
		.map((paragraph) => paragraph.replace(/\s*\n\s*/g, ' '))
		.join('<br><br>')
}
