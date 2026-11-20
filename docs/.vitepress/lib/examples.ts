/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Plugin } from 'vite'
import type { MarkdownRenderer } from 'vitepress'

import { compileTemplate, parse } from '@vue/compiler-sfc'
import { createHash } from 'node:crypto'
import { join } from 'node:path'
import { DOCS } from './components.ts'
import { SCOPE_SELECTOR } from './scopeServerStyles.ts'

/**
 * Directory of the virtual example modules.
 * The modules do not exist on disk, but a real path is needed so that imports
 * within the examples are resolved like for any other file of the docs.
 */
const EXAMPLES_DIR = join(DOCS, '.vitepress', '@examples')

/** Example source code by example id */
const examples = new Map<string, string>()

/** Page of the example by example id, for error messages */
const origins = new Map<string, string>()

/**
 * Turn the example code into a valid SFC.
 * Like vue-styleguidist, examples can either be a full SFC or just template markup.
 *
 * @param code - The example code
 */
export function toSfc(code: string): string {
	if (/^\s*<(template|script|style)(\s[^>]*)?>/.test(code) && !/^\s*<template\s+(#|v-slot)/.test(code)) {
		return code
	}
	return `<template>\n${code.trimEnd()}\n</template>\n`
}

/**
 * Check if a code fence is a live example.
 * Like vue-styleguidist: fences without language or with `vue` are live examples, unless marked as `static`.
 *
 * @param info - The info string of the code fence
 */
export function isLiveExample(info: string): boolean {
	const [lang = '', ...flags] = info.trim().split(/\s+/)
	return (lang === '' || lang === 'vue') && !flags.includes('static')
}

/**
 * Register an example and get its id.
 *
 * @param code - The SFC code of the example
 * @param origin - The page of the example, used for error messages
 */
function registerExample(code: string, origin: string): string {
	const id = 'e' + createHash('sha256').update(code).digest('hex').slice(0, 12)
	examples.set(id, code)
	origins.set(id, origin)
	return id
}

/**
 * Validate the example code to provide a helpful error message instead of a compiler crash.
 *
 * @param code - The SFC code of the example
 * @return The error message if the example is invalid
 */
export function validateExample(code: string): string | undefined {
	const { descriptor, errors } = parse(code, { filename: 'example.vue' })
	if (errors.length > 0) {
		return errors.map((error) => error.message).join('\n')
	}
	if (descriptor.template) {
		try {
			const result = compileTemplate({ id: 'example', filename: 'example.vue', source: descriptor.template.content })
			if (result.errors.length > 0) {
				return result.errors.map((error) => (typeof error === 'string' ? error : error.message)).join('\n')
			}
		} catch (error) {
			return String(error)
		}
	}
}

/**
 * Scope global styles of an example to the examples.
 * Examples use global styles to style the components, so they cannot be scoped like `<style scoped>`.
 * Instead they are nested within the example scope, which is supported by Sass for any CSS.
 *
 * @param code - The SFC code of the example
 */
export function scopeExampleStyles(code: string): string {
	return code.replace(/<style(\s[^>]*)?>([\s\S]*?)<\/style>/g, (match, attrs = '', content) => {
		if (/\sscoped\b/.test(attrs) || /\smodule\b/.test(attrs)) {
			return match
		}
		return `<style lang="scss">\n${SCOPE_SELECTOR} {\n${content}\n}\n</style>`
	})
}

/**
 * Markdown-it plugin to render live examples.
 *
 * Every live example is compiled as its own SFC by Vite, it is rendered by the `NcExample` component
 * together with the highlighted source code, which can be edited in the REPL.
 *
 * @param md - The markdown renderer
 */
export function examplesMarkdownPlugin(md: MarkdownRenderer) {
	const fence = md.renderer.rules.fence!
	md.renderer.rules.fence = (tokens, idx, options, env, self) => {
		const token = tokens[idx]!
		if (!isLiveExample(token.info)) {
			// remove the `static` flag of vue-styleguidist
			token.info = token.info.replace(/\s+static\b/, '')
			return fence(tokens, idx, options, env, self)
		}

		const code = toSfc(token.content)
		const id = registerExample(code, env.relativePath ?? 'unknown page')
		;(env.ncExamples ??= new Set<string>()).add(id)

		token.info = 'vue'
		const highlighted = fence(tokens, idx, options, env, self)
		return `<NcExample :code="__ncExampleCode.${id}" :component="__ncExamples.${id}">${highlighted}</NcExample>\n`
	}

	// Inject the imports of the examples into the page component
	const render = md.render.bind(md)
	md.render = (src, env = {}) => {
		const html = render(src, env)
		const ids = [...(env.ncExamples ?? [])] as string[]
		if (ids.length === 0 || !env.sfcBlocks) {
			return html
		}

		// The examples are only rendered in the browser, so they are not bundled for the server (SSR)
		const imports = ids.map((id) => `${id}: __ncDefineAsyncComponent(() => import.meta.env.SSR ? Promise.resolve({ render: () => null }) : import(${JSON.stringify(join(EXAMPLES_DIR, `${id}.vue`))}))`)
		const sources = JSON.stringify(Object.fromEntries(ids.map((id) => [id, examples.get(id)])))
			// The code is placed within a script tag
			.replaceAll('</script', '<\\/script')
		const code = `
import { defineAsyncComponent as __ncDefineAsyncComponent } from 'vue'
const __ncExamples = { ${imports.join(',\n')} }
const __ncExampleCode = ${sources}
`

		const scriptSetup = env.sfcBlocks.scriptSetup
		if (scriptSetup) {
			scriptSetup.contentStripped = code + scriptSetup.contentStripped
			scriptSetup.content = scriptSetup.tagOpen + scriptSetup.contentStripped + scriptSetup.tagClose
		} else {
			const block = {
				type: 'script',
				tagOpen: '<script setup>',
				tagClose: '</script>',
				contentStripped: code,
				content: `<script setup>${code}</script>`,
			}
			env.sfcBlocks.scripts.push(block)
			env.sfcBlocks.scriptSetup = block
		}
		return html
	}
}

/**
 * Vite plugin to serve the virtual example modules
 */
export function examplesVitePlugin(): Plugin {
	const idRegExp = /\/@examples\/(e[0-9a-f]+)\.vue(\?.*)?$/

	return {
		name: 'nextcloud-vue-docs:examples',
		enforce: 'pre',

		resolveId(source) {
			const match = source.match(idRegExp)
			if (match) {
				return join(EXAMPLES_DIR, `${match[1]}.vue`) + (match[2] ?? '')
			}
		},

		load(id) {
			const match = id.match(idRegExp)
			if (match && !match[2]) {
				const code = examples.get(match[1]!)
				if (code === undefined) {
					this.error(`Unknown documentation example ${match[1]}`)
				}
				const error = validateExample(code)
				if (error) {
					this.error(`Invalid example on page "${origins.get(match[1]!)}":\n${error}\n\n${code}`)
				}
				return scopeExampleStyles(code)
			}
		},
	}
}
