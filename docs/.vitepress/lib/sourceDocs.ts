/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Node as BabelNode, ObjectExpression, ObjectMethod, ObjectProperty } from '@babel/types'
import type { ElementNode, TemplateChildNode } from '@vue/compiler-dom'
import type { ApiEvent, ApiExposed, ApiProp, ApiSlot, ApiTag } from './api.ts'

import { NodeTypes, parse as parseTemplate } from '@vue/compiler-dom'
import { babelParse, parse, walk } from '@vue/compiler-sfc'

export interface SourceDocs {
	props: ApiProp[]
	events: ApiEvent[]
	slots: ApiSlot[]
	methods: ApiExposed[]
}

interface DocComment {
	description: string
	tags: ApiTag[]
}

/** Names of the runtime types of props */
const RUNTIME_TYPES: Record<string, string> = {
	String: 'string',
	Number: 'number',
	Boolean: 'boolean',
	Array: 'array',
	Object: 'object',
	Function: 'function',
	Date: 'Date',
	Symbol: 'symbol',
}

/**
 * Read the documentation of a component from the comments in its source,
 * using the same conventions as vue-styleguidist:
 * - Props are documented with JSDoc comments
 * - Events are documented with a JSDoc comment on the `$emit` call
 * - Slots are documented with a `<!-- @slot description -->` comment before the slot
 * - Methods are documented with JSDoc comments and must be marked as `@public`
 *
 * @param source - The source of the component
 * @param filename - The file name of the component
 */
export function extractFromSource(source: string, filename: string): SourceDocs {
	const { descriptor } = parse(source, { filename })
	const result: SourceDocs = { props: [], events: [], slots: [], methods: [] }

	for (const block of [descriptor.script, descriptor.scriptSetup]) {
		if (!block) {
			continue
		}
		const isTs = block.lang === 'ts'
		const ast = babelParse(block.content, {
			sourceType: 'module',
			plugins: isTs ? ['typescript'] : [],
		})
		const content = block.content
		const slice = (node: BabelNode) => content.slice(node.start!, node.end!)

		const options = findComponentOptions(ast as unknown as BabelNode)
		if (options) {
			result.props.push(...extractProps(options, slice))
			result.methods.push(...extractPublicMethods(options))
			for (const event of extractEmits(options)) {
				addEvent(result.events, event)
			}
		}

		// Events documented on the emit calls
		walk(ast as never, {
			enter(node: BabelNode, parent: BabelNode | null) {
				if (node.type === 'CallExpression' && node.callee.type === 'Identifier' && node.callee.name === 'defineEmits') {
					for (const event of extractTypedEmits(node, slice)) {
						addEvent(result.events, event)
					}
					return
				}
				if (node.type !== 'CallExpression' || !isEmitCall(node.callee)) {
					return
				}
				const [event] = node.arguments
				if (event?.type !== 'StringLiteral') {
					return
				}
				const comment = parseDocComment(lastDocComment(node) ?? lastDocComment(parent))
				const payload = comment.tags.find(({ name }) => name === 'type')?.text?.match(/^\{(.+)\}/)?.[1]
				addEvent(result.events, {
					name: event.value,
					payload,
					description: comment.description,
					tags: comment.tags.filter(({ name }) => name !== 'type'),
				})
			},
		})

		// Slots of render functions
		for (const match of content.matchAll(/\$?slots(?:\.(\w+)|\[['"]([\w-]+)['"]\])/g)) {
			addSlot(result.slots, { name: match[1] ?? match[2]!, description: '', tags: [] })
		}
	}

	if (descriptor.template) {
		const template = descriptor.template.content
		for (const match of template.matchAll(/\$emit\(\s*['"]([\w:-]+)['"]/g)) {
			addEvent(result.events, { name: match[1]!, description: '', tags: [] })
		}

		const ast = parseTemplate(template, { comments: true })
		visitTemplate(ast.children, result.slots)
	}

	// Slots found in the script without documentation are listed after the documented ones
	result.slots.sort((a, b) => Number(!a.description) - Number(!b.description))
	return result
}

/**
 * Find the options object of the component (`export default {}` or `export default defineComponent({})`)
 *
 * @param ast - The AST of the script
 */
function findComponentOptions(ast: BabelNode): ObjectExpression | undefined {
	if (ast.type !== 'File') {
		return
	}
	for (const statement of ast.program.body) {
		if (statement.type !== 'ExportDefaultDeclaration') {
			continue
		}
		let declaration = statement.declaration as BabelNode
		if (declaration.type === 'CallExpression' && declaration.arguments[0]?.type === 'ObjectExpression') {
			declaration = declaration.arguments[0]
		}
		if (declaration.type === 'ObjectExpression') {
			return declaration
		}
	}
}

/**
 * Get a property of an object expression by name
 *
 * @param object - The object
 * @param name - The name of the property
 */
function getProperty(object: ObjectExpression, name: string): ObjectProperty | ObjectMethod | undefined {
	return object.properties.find((property): property is ObjectProperty | ObjectMethod => (property.type === 'ObjectProperty' || property.type === 'ObjectMethod')
		&& getKeyName(property) === name)
}

/**
 * Get the name of a property key
 *
 * @param property - The property
 */
function getKeyName(property: ObjectProperty | ObjectMethod): string | undefined {
	if (property.key.type === 'Identifier') {
		return property.key.name
	}
	if (property.key.type === 'StringLiteral') {
		return property.key.value
	}
}

/**
 * Get the props of the Options API
 *
 * @param options - The component options
 * @param slice - Get the source of a node
 */
function extractProps(options: ObjectExpression, slice: (node: BabelNode) => string): ApiProp[] {
	const props = getProperty(options, 'props')
	if (props?.type !== 'ObjectProperty') {
		return []
	}

	if (props.value.type === 'ArrayExpression') {
		return props.value.elements
			.filter((element) => element?.type === 'StringLiteral')
			.map((element) => ({ name: element.value, type: 'any', required: false, description: '', tags: [] }))
	}
	if (props.value.type !== 'ObjectExpression') {
		return []
	}

	const result: ApiProp[] = []
	for (const property of props.value.properties) {
		if (property.type !== 'ObjectProperty') {
			continue
		}
		const name = getKeyName(property)
		if (!name) {
			continue
		}
		const comment = parseDocComment(lastDocComment(property))
		const definition = property.value as BabelNode
		let typeNode: BabelNode | undefined = definition
		let required = false
		let defaultValue: string | undefined

		if (definition.type === 'ObjectExpression') {
			const type = getProperty(definition, 'type')
			typeNode = type?.type === 'ObjectProperty' ? type.value as BabelNode : undefined
			const requiredProperty = getProperty(definition, 'required')
			required = requiredProperty?.type === 'ObjectProperty' && requiredProperty.value.type === 'BooleanLiteral' && requiredProperty.value.value
			const defaultProperty = getProperty(definition, 'default')
			if (defaultProperty?.type === 'ObjectProperty') {
				const value = defaultProperty.value as BabelNode
				// Factory functions for objects and arrays: `() => []`
				defaultValue = value.type === 'ArrowFunctionExpression' && value.body.type !== 'BlockStatement'
					? slice(value.body).replace(/^\((.*)\)$/s, '$1')
					: slice(value)
			} else if (defaultProperty?.type === 'ObjectMethod') {
				defaultValue = 'function'
			}
		}

		const defaultTag = comment.tags.find((tag) => tag.name === 'default')?.text
		const type = typeNode ? runtimeType(typeNode, slice) : 'any'
		result.push({
			name,
			type,
			required,
			default: defaultValue ?? defaultTag ?? (type === 'boolean' ? 'false' : undefined),
			description: comment.description,
			tags: comment.tags.filter((tag) => !['default', 'type'].includes(tag.name)),
		})
	}
	return result
}

/**
 * Get the type of a prop from the runtime declaration
 *
 * @param node - The node of the type declaration
 * @param slice - Get the source of a node
 */
function runtimeType(node: BabelNode, slice: (node: BabelNode) => string): string {
	if (node.type === 'Identifier') {
		return RUNTIME_TYPES[node.name] ?? node.name
	}
	if (node.type === 'ArrayExpression') {
		return node.elements.map((element) => (element ? runtimeType(element as BabelNode, slice) : 'any')).join(' | ')
	}
	if (node.type === 'TSAsExpression') {
		// Object as PropType<Foo>
		const annotation = node.typeAnnotation
		if (annotation.type === 'TSTypeReference' && annotation.typeParameters?.params[0]) {
			return slice(annotation.typeParameters.params[0])
		}
		return slice(annotation)
	}
	return slice(node)
}

/**
 * Get the declared events of the Options API
 *
 * @param options - The component options
 */
function extractEmits(options: ObjectExpression): ApiEvent[] {
	const emits = getProperty(options, 'emits')
	if (emits?.type !== 'ObjectProperty') {
		return []
	}

	const nodes: [string, BabelNode][] = []
	if (emits.value.type === 'ArrayExpression') {
		for (const element of emits.value.elements) {
			if (element?.type === 'StringLiteral') {
				nodes.push([element.value, element])
			}
		}
	} else if (emits.value.type === 'ObjectExpression') {
		for (const property of emits.value.properties) {
			const name = property.type !== 'SpreadElement' ? getKeyName(property) : undefined
			if (name !== undefined) {
				nodes.push([name, property])
			}
		}
	}

	return nodes.map(([name, node]) => ({ name, ...parseDocComment(lastDocComment(node)) }))
}

/**
 * Get the events declared by `defineEmits<{ ... }>()`
 *
 * @param call - The call of `defineEmits`
 * @param slice - Get the source of a node
 */
function extractTypedEmits(call: BabelNode, slice: (node: BabelNode) => string): ApiEvent[] {
	if (call.type !== 'CallExpression') {
		return []
	}
	const type = call.typeParameters?.params[0]
	if (type?.type !== 'TSTypeLiteral') {
		return []
	}

	const events: ApiEvent[] = []
	for (const member of type.members) {
		const comment = parseDocComment(lastDocComment(member))
		if (member.type === 'TSPropertySignature') {
			// Named tuple syntax: `name: [arg: Type]`
			const name = member.key.type === 'Identifier'
				? member.key.name
				: (member.key.type === 'StringLiteral' ? member.key.value : undefined)
			const annotation = member.typeAnnotation?.typeAnnotation
			if (name) {
				events.push({
					name,
					payload: annotation?.type === 'TSTupleType' ? annotation.elementTypes.map(slice).join(', ') || undefined : undefined,
					description: comment.description,
					tags: comment.tags,
				})
			}
		} else if (member.type === 'TSCallSignatureDeclaration') {
			// Call signature syntax: `(event: 'name', arg: Type): void`
			const [event, ...args] = member.parameters
			const eventType = event?.type === 'Identifier' ? event.typeAnnotation : undefined
			const literal = eventType?.type === 'TSTypeAnnotation' && eventType.typeAnnotation.type === 'TSLiteralType'
				? eventType.typeAnnotation.literal
				: undefined
			if (literal?.type === 'StringLiteral') {
				events.push({
					name: literal.value,
					payload: args.map(slice).join(', ') || undefined,
					description: comment.description,
					tags: comment.tags,
				})
			}
		}
	}
	return events
}

/**
 * Get the methods marked as `@public`
 *
 * @param options - The component options
 */
function extractPublicMethods(options: ObjectExpression): ApiExposed[] {
	const methods = getProperty(options, 'methods')
	if (methods?.type !== 'ObjectProperty' || methods.value.type !== 'ObjectExpression') {
		return []
	}

	const result: ApiExposed[] = []
	for (const method of methods.value.properties) {
		if (method.type !== 'ObjectMethod' && method.type !== 'ObjectProperty') {
			continue
		}
		const comment = parseDocComment(lastDocComment(method))
		if (!comment.tags.some(({ name }) => name === 'public')) {
			continue
		}
		const params = comment.tags
			.filter(({ name }) => name === 'param')
			.map(({ text }) => text?.match(/^(?:\{([^}]+)\}\s*)?([\w.[\]]+)/))
			.filter((match) => match && !match[2]!.includes('.'))
			.map((match) => `${match![2]}${match![1] ? `: ${match![1]}` : ''}`)
		result.push({
			name: getKeyName(method)!,
			type: `(${params.join(', ')}) => void`,
			description: comment.description,
			tags: comment.tags.filter(({ name }) => !['public', 'param'].includes(name)),
		})
	}
	return result
}

/**
 * Check if a callee is an emit call: `$emit()`, `this.$emit()`, `emit()` or `context.emit()`
 *
 * @param callee - The callee of a call expression
 */
function isEmitCall(callee: BabelNode): boolean {
	if (callee.type === 'Identifier') {
		return callee.name === 'emit' || callee.name === '$emit'
	}
	if (callee.type === 'MemberExpression' && callee.property.type === 'Identifier') {
		return callee.property.name === '$emit' || callee.property.name === 'emit'
	}
	return false
}

/**
 * Get the last JSDoc comment before a node
 *
 * @param node - The node
 */
function lastDocComment(node: BabelNode | null | undefined): string | undefined {
	return node?.leadingComments
		?.findLast((comment) => comment.type === 'CommentBlock' && comment.value.startsWith('*'))
		?.value
}

/**
 * Parse a JSDoc comment
 *
 * @param comment - The content of the comment (without the comment delimiters)
 */
export function parseDocComment(comment?: string): DocComment {
	if (!comment) {
		return { description: '', tags: [] }
	}
	const lines = comment
		.split('\n')
		.map((line) => line.replace(/^\s*\*+ ?/, '').replace(/\s+$/, ''))
	const description: string[] = []
	const tags: ApiTag[] = []
	for (const line of lines) {
		const tag = line.match(/^@(\w+)\s*(.*)$/)
		if (tag) {
			tags.push({ name: tag[1]!, text: tag[2] || undefined })
		} else if (tags.length > 0) {
			// Continuation of a tag
			const last = tags.at(-1)!
			last.text = last.text ? `${last.text}\n${line}` : line
		} else {
			description.push(line)
		}
	}
	return {
		description: description.join('\n').trim(),
		tags: tags.map((tag) => ({ ...tag, text: tag.text?.trim() || undefined })),
	}
}

/**
 * Add an event, merging it with an existing event of the same name
 *
 * @param events - The events
 * @param event - The event to add
 */
function addEvent(events: ApiEvent[], event: ApiEvent) {
	const existing = events.find(({ name }) => name === event.name)
	if (!existing) {
		events.push(event)
	} else if (!existing.description && event.description) {
		Object.assign(existing, event)
	}
}

/**
 * Add a slot, merging it with an existing slot of the same name
 *
 * @param slots - The slots
 * @param slot - The slot to add
 */
function addSlot(slots: ApiSlot[], slot: ApiSlot) {
	if (['length', 'value'].includes(slot.name)) {
		return
	}
	const existing = slots.find(({ name }) => name === slot.name)
	if (!existing) {
		slots.push(slot)
	} else {
		existing.description ||= slot.description
		existing.bindings ??= slot.bindings
		if (existing.tags.length === 0) {
			existing.tags = slot.tags
		}
	}
}

/**
 * Find all slots in the template with their documentation comments
 *
 * @param children - The nodes of the template
 * @param slots - The found slots
 */
function visitTemplate(children: TemplateChildNode[], slots: ApiSlot[]) {
	children.forEach((node, index) => {
		if (node.type !== NodeTypes.ELEMENT) {
			return
		}
		if (node.tag === 'slot') {
			addSlot(slots, templateSlot(node, children.slice(0, index)))
		}
		visitTemplate(node.children, slots)
	})
}

/**
 * Get the documentation of a slot element
 *
 * @param node - The slot element
 * @param previous - The previous siblings of the slot element
 */
function templateSlot(node: ElementNode, previous: TemplateChildNode[]): ApiSlot {
	let name = 'default'
	const bindings: string[] = []
	for (const prop of node.props) {
		if (prop.type === NodeTypes.ATTRIBUTE) {
			if (prop.name === 'name') {
				name = prop.value?.content ?? name
			} else {
				bindings.push(prop.name)
			}
		} else if (prop.name === 'bind' && prop.arg?.type === NodeTypes.SIMPLE_EXPRESSION) {
			bindings.push(prop.arg.content)
		}
	}

	// The documentation comment is the last comment before the slot
	const comment = previous
		.filter((sibling) => sibling.type !== NodeTypes.TEXT || sibling.content.trim())
		.at(-1)
	const text = comment?.type === NodeTypes.COMMENT ? comment.content.trim() : ''
	const doc = text.startsWith('@slot') ? parseSlotComment(text.slice(5)) : { description: '', tags: [] }

	const bindingTags = doc.tags.filter(({ name }) => name === 'binding')
	const bindingDocs = bindingTags.map(({ text }) => text?.match(/^(?:\{([^}]+)\}\s*)?(\w+)/)).filter((match) => !!match)
	const bindingNames = new Set([...bindings, ...bindingDocs.map((match) => match[2]!)])
	return {
		name,
		bindings: bindingNames.size > 0
			? `{ ${[...bindingNames].map((binding) => {
				const type = bindingDocs.find((match) => match[2] === binding)?.[1]
				return type ? `${binding}: ${type}` : binding
			}).join(', ')} }`
			: undefined,
		description: doc.description,
		tags: doc.tags.filter(({ name }) => name !== 'binding'),
	}
}

/**
 * Parse the content of a `@slot` comment
 *
 * @param text - The content after `@slot`
 */
function parseSlotComment(text: string): DocComment {
	// Tags of slot comments can be written in one line: `@slot Description @binding {string} name`
	const normalized = text.replace(/\s+@(\w+)/g, '\n@$1')
	return parseDocComment(normalized)
}
