/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ComponentMeta, PropertyMeta } from 'vue-component-meta'

import { readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { createChecker } from 'vue-component-meta'
import { ROOT } from './components.ts'
import { extractFromSource } from './sourceDocs.ts'

export interface ApiTag {
	name: string
	text?: string
}

export interface ApiProp {
	name: string
	type: string
	default?: string
	required: boolean
	description: string
	tags: ApiTag[]
}

export interface ApiEvent {
	name: string
	payload?: string
	description: string
	tags: ApiTag[]
}

export interface ApiSlot {
	name: string
	bindings?: string
	description: string
	tags: ApiTag[]
}

export interface ApiExposed {
	name: string
	type?: string
	description: string
	tags: ApiTag[]
}

export interface ComponentApi {
	props: ApiProp[]
	events: ApiEvent[]
	slots: ApiSlot[]
	exposed: ApiExposed[]
}

// The paths file of the component pages is reloaded on changes in the dev server,
// so the checker is kept globally as creating it is expensive.
const state = (globalThis as { __ncDocsComponentMeta?: { checker?: ReturnType<typeof createChecker>, modificationTimes: Map<string, number> } })
	.__ncDocsComponentMeta ??= { modificationTimes: new Map() }

/**
 * Get the type checker for the components, files changed since the last call are updated.
 *
 * @param file - The component file which will be checked
 */
function getChecker(file: string) {
	if (!state.checker) {
		state.checker = createChecker(join(ROOT, 'src/tsconfig.json'), {
			// Do not resolve the schema of types, it is not used and expensive
			schema: { ignore: [() => true] as never },
			printer: { newLine: 1 },
		})
	}

	const mtime = statSync(file).mtimeMs
	const lastMtime = state.modificationTimes.get(file)
	if (lastMtime !== undefined && lastMtime !== mtime) {
		state.checker.updateFile(file, readFileSync(file, 'utf8'))
	}
	state.modificationTimes.set(file, mtime)
	return state.checker
}

/**
 * Get the API (props, events, slots, exposed) of a component.
 *
 * The API is read using `vue-component-meta`.
 * For components using the Options API the events and slots are not typed,
 * so they are read from the documentation comments in the source instead (like vue-styleguidist did).
 *
 * @param file - Path of the component
 */
export function getComponentApi(file: string): ComponentApi {
	const source = readFileSync(file, 'utf8')
	const fromSource = extractFromSource(source, file)

	let meta: ComponentMeta | undefined
	try {
		meta = getChecker(file).getComponentMeta(file)
	} catch (error) {
		// eslint-disable-next-line no-console -- Build time warning
		console.warn(`[docs] Could not get meta of ${file}:`, error)
	}

	// Invalid names are a result of props or events which could not be resolved (e.g. spread props)
	const isValidName = (name: string) => /^[\w:-]+$/.test(name)

	const events = meta?.events.filter(({ name }) => isValidName(name)).map((event) => ({
		name: event.name,
		payload: cleanEventType(event.type),
		description: event.description,
		tags: event.tags,
	})) ?? []

	const eventNames = new Set([...events, ...fromSource.events].map(({ name }) => name))
	const props = (meta?.props ?? [])
		// Global props (like `class`) and the listeners of the events (Options API) are no props of the component
		.filter((prop) => !prop.global && isValidName(prop.name) && !isEventListener(prop.name, eventNames))
		.map((prop) => toApiProp(prop, source))

	const usesScriptSetup = /<script\s[^>]*\bsetup\b/.test(source)
	// Without `expose` the Options API exposes the whole instance
	const hasExplicitExpose = usesScriptSetup || /^\s+expose:\s*\[/m.test(source)

	return {
		props: props.length > 0 ? props : fromSource.props,
		events: events.length > 0 ? mergeDescriptions(events, fromSource.events) : fromSource.events,
		slots: meta?.slots.length
			? mergeDescriptions(meta.slots.map((slot) => ({
					name: slot.name,
					bindings: cleanSlotType(slot.type),
					description: slot.description,
					tags: slot.tags,
				})), fromSource.slots)
			: fromSource.slots,
		exposed: hasExplicitExpose && meta?.exposed.length
			? meta.exposed.map((exposed) => ({
					name: exposed.name,
					type: exposed.type,
					description: exposed.description,
					tags: exposed.tags,
				}))
			: fromSource.methods,
	}
}

/**
 * Check if a prop is the listener of an event, like `onClick` for the `click` event.
 *
 * @param name - Name of the prop
 * @param eventNames - Names of all events
 */
function isEventListener(name: string, eventNames: Set<string>): boolean {
	const match = name.match(/^on([A-Z].*)$/)
	if (!match) {
		return false
	}
	const event = match[1]!
	const candidates = [
		event.charAt(0).toLowerCase() + event.slice(1),
		event.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(),
		event.replace(/^Update:/, 'update:').replace(/^update:([A-Z])/, (_, c) => `update:${c.toLowerCase()}`),
	]
	return candidates.some((candidate) => eventNames.has(candidate))
}

/**
 * Convert the prop meta to the documented prop
 *
 * @param prop - The prop meta
 * @param source - The source of the component
 */
function toApiProp(prop: PropertyMeta, source: string): ApiProp {
	const defaultTag = prop.tags.find(({ name }) => name === 'default')?.text
	let defaultValue = prop.default ?? defaultTag
	if (defaultValue === undefined && /^boolean( \| undefined)?$/.test(prop.type)) {
		// Vue casts missing boolean props to false
		defaultValue = 'false'
	}

	return {
		name: prop.name,
		type: declaredType(prop, source) ?? cleanType(prop.type, prop.required),
		default: defaultValue === 'undefined' ? undefined : defaultValue,
		required: prop.required,
		description: prop.description,
		tags: prop.tags.filter(({ name }) => name !== 'default'),
	}
}

/**
 * Get the type of a prop as written in the source, which is more readable than the resolved type.
 * E.g. `RouteLocationRaw` instead of the expanded union of the resolved type.
 *
 * @param prop - The prop meta
 * @param source - The source of the component
 */
function declaredType(prop: PropertyMeta, source: string): string | undefined {
	for (const declaration of prop.getDeclarations()) {
		const text = readFileSync(declaration.file, 'utf8').slice(declaration.range[0], declaration.range[1])
		// Type literal of `defineProps<{ ... }>()`: `name?: Type`
		const match = text.match(/^\s*(?:\/\*\*[\s\S]*?\*\/\s*)?['"]?[\w-]+['"]?\??\s*:\s*([\s\S]+?)[,;]?\s*$/)
		if (match && declaration.file.endsWith('.vue') && source.includes(text)) {
			// Options API props are objects like `{ type: String, default: '' }`
			if (/^\{/.test(match[1]!.trim())) {
				return undefined
			}
			return cleanType(match[1]!.replace(/\s*\n\s*/g, ' '), prop.required)
		}
	}
	return undefined
}

/**
 * Remove the `undefined` of optional values
 *
 * @param type - The type
 * @param required - If the value is required
 */
function cleanType(type: string, required: boolean): string {
	return required ? type : type.replace(/^\|\s*/, '').replace(/\s*\|\s*undefined\b/g, '').replace(/^undefined\s*\|\s*/, '')
}

/**
 * Event types are tuples of the arguments, show the arguments without the tuple
 *
 * @param type - The type of the event
 */
function cleanEventType(type: string): string | undefined {
	const args = type.match(/^\[(.*)\]$/s)?.[1]?.trim()
	if (args === undefined) {
		return type === 'any[]' ? undefined : type
	}
	return args || undefined
}

/**
 * Show the bindings of a slot, slots without bindings have the type `any`
 *
 * @param type - The type of the slot props
 */
function cleanSlotType(type: string): string | undefined {
	return ['any', 'any[]', '{}', 'Record<string, never>', 'undefined'].includes(type.trim()) ? undefined : type
}

/**
 * Add descriptions found in the source to the entries without a description
 *
 * @param entries - The entries from the meta
 * @param fromSource - The entries from the source
 */
function mergeDescriptions<T extends { name: string, description: string, tags: ApiTag[] }>(entries: T[], fromSource: T[]): T[] {
	const byName = new Map(fromSource.map((entry) => [entry.name, entry]))
	return entries.map((entry) => {
		const other = byName.get(entry.name)
		if (!entry.description && other) {
			return { ...other, ...entry, description: other.description, tags: entry.tags.length ? entry.tags : other.tags }
		}
		return entry
	})
}
