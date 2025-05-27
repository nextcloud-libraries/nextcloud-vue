<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### General description

This component displays rich text with optional autolink or [Markdown support](https://www.markdownguide.org/basic-syntax/).

```vue
<template>
	<div>
		<textarea v-model="text" />
		<NcCheckboxRadioSwitch v-model="autolink" type="checkbox">Autolink</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch v-model="useMarkdown" type="checkbox">Use Markdown</NcCheckboxRadioSwitch>

		<NcRichText
			:class="{'plain-text': !useMarkdown }"
			:text="text" :autolink="autolink" :arguments="args"
			:use-markdown="useMarkdown" />
	</div>
</template>
<script>
export default {
	data() {
		return {
			text: `## Hello everyone 🎉
The file {file} was added by {username}. Visit https://nextcloud.com to check it!

Some examples for markdown syntax:
1. **bold text**
2. _italic text_
3. example of \`inline code\`

> blockquote example
`,
			autolink: true,
			useMarkdown: true,
			args: {
				file: 'MyDocument.odt',
				username: {
					component: 'NcUserBubble',
					props: {
						displayName: 'Jane Doe'
					}
				}
			},
		}
	},
}
</script>
<style lang="scss">
textarea {
	width: 100%;
	height: 200px;
}

.plain-text {
	white-space: pre-line;
}
</style>
```

### Flavored Markdown

This component can support [Github Flavored Markdown](https://github.github.com/gfm/).
It adds such elements, as tables, task lists, strikethrough, and supports code syntax highlighting and autolinks by default

It is also possible to make a rendered content interactive and listen for events

```vue
<template>
	<div>
		<textarea v-model="text" />

		<NcRichText :text="text"
			:use-extended-markdown="true"
			:interactive="true"
			@interact:todo="handleInteraction"/>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				text: `## Try flavored markdown right now!

~~strikethrough~~

- [ ] task to be done
- [x] task completed

Table header | Column A | Column B
-- | -- | --
Table row | value A | value B

---

\`\`\`js
const createElementId = (length) => {
\treturn Math.random()
\t\t.toString(36)
\t\t.replace(/[^a-z]+/g, '')
\t\t.slice(0, length || 5)
}
\`\`\`
`,
			}
		},
		methods: {
			handleInteraction(id) {
				const parentId = id.split('-markdown-input-')[0]
				const index = Array.from(document.querySelectorAll(`span[id^="${parentId}-markdown-input-"]`)).findIndex((el) => el.id.includes(id))
				if (index === -1 ) {
					return
				}
				let checkBoxIndex = 0
				let lines = this.text.split('\n')
				for (let i = 0; i < lines.length; i++) {
					if (lines[i].includes('[ ]') || lines[i].includes('[x]')) {
						if (checkBoxIndex === index) {
							const isChecked = lines[i].includes('[x]')
							if (isChecked) {
								lines[i] = lines[i].replace('[x]', '[ ]')
							} else {
								lines[i] = lines[i].replace('[ ]', '[x]')
							}
							break
						}
						checkBoxIndex++
					}
				}
				this.text = lines.join('\n')
			},
		},
	}
</script>
<style lang="scss">
textarea {
	width: 100%;
	height: 200px;
}
</style>
```

### Usage with NcRichContenteditable

See [NcRichContenteditable](#/Components/NcRichContenteditable) documentation for more information

```vue
<template>
	<div>
		<NcRichContenteditable v-model="message"
			:auto-complete="autoComplete"
			:maxlength="100"
			:user-data="userData"
			placeholder="Try mentioning user @Test01 or inserting emoji :smile"
			@submit="onSubmit" />

		<NcCheckboxRadioSwitch v-model="autolink" type="checkbox">Autolink</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch v-model="useMarkdown" type="checkbox">Use Markdown</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch v-model="useExtendedMarkdown" type="checkbox">Use extended Markdown</NcCheckboxRadioSwitch>

		<NcRichText :text="text"
			:autolink="autolink"
			:arguments="userMentions"
			:use-markdown="useMarkdown"
			:use-extended-markdown="useExtendedMarkdown" />
	</div>
</template>
<script>
	export default {
		data() {
			return {
				message: '',
				autolink: true,
				useMarkdown: true,
				useExtendedMarkdown: true,
				userData: {
					Test01: {
						icon: 'icon-user',
						id: 'Test01',
						label: 'Test01',
						source: 'users',
						primary: true,
					},
					Test02: {
						icon: 'icon-user',
						id: 'Test02',
						label: 'Test02',
						source: 'users',
						status: {
							clearAt: null,
							icon: '🎡',
							message: 'Visiting London',
							status: 'away',
						},
						subline: 'Visiting London',
					},
					'Test@User': {
						icon: 'icon-user',
						id: 'Test@User',
						label: 'Test 03',
						source: 'users',
						status: {
							clearAt: null,
							icon: '🎡',
							message: 'Having space in my name',
							status: 'online',
						},
						subline: 'Visiting London',
					},
					'Test Offline': {
						icon: 'icon-user',
						id: 'Test Offline',
						label: 'Test Offline',
						source: 'users',
						status: {
							clearAt: null,
							icon: null,
							message: null,
							status: 'offline',
						},
						subline: null,
					},
					'Test DND': {
						icon: 'icon-user',
						id: 'Test DND',
						label: 'Test DND',
						source: 'users',
						status: {
							clearAt: null,
							icon: null,
							message: 'Out sick',
							status: 'dnd',
						},
						subline: 'Out sick',
					},
				},
				userMentions: {
					'user-1': {
						component: 'NcUserBubble',
						props: {
							displayName: 'Test01',
							user: 'Test01',
							primary: true,
						},
					},
					'user-2': {
						component: 'NcUserBubble',
						props: {
							displayName: 'Test02',
							user: 'Test02',
						},
					},
					'user-3': {
						component: 'NcUserBubble',
						props: {
							displayName: 'Test 03',
							user: 'Test@User',
						},
					},
					'user-4': {
						component: 'NcUserBubble',
						props: {
							displayName: 'Test Offline',
							user: 'Test Offline',
						},
					},
					'user-5': {
						component: 'NcUserBubble',
						props: {
							displayName: 'Test DND',
							user: 'Test DND',
						},
					},
				},
			}
		},
		computed: {
			text() {
				return this.message
						.replace('@Test01', '{user-1}')
						.replace('@Test02', '{user-2}')
						.replace('@Test@User', '{user-3}')
						.replace('@"Test Offline"', '{user-4}')
						.replace('@"Test DND"', '{user-5}')
			},
		},
		methods: {
			autoComplete(search, callback) {
				callback(Object.values(this.userData))
			},
			onSubmit() {
				alert(this.message)
			}
		}
	}
</script>
```
</docs>

<script>
import { unified } from 'unified'
import { Fragment, h, ref, resolveComponent } from 'vue'
import { RouterLink } from 'vue-router'

import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import breaks from 'remark-breaks'
import remarkUnlinkProtocols from 'remark-unlink-protocols'
import remark2rehype from 'remark-rehype'
import rehype2react from 'rehype-react'
import rehypeExternalLinks from 'rehype-external-links'

import NcCheckboxRadioSwitch from '../NcCheckboxRadioSwitch/NcCheckboxRadioSwitch.vue'
import NcReferenceList from './NcReferenceList.vue'
import { getRoute, remarkAutolink } from './autolink.ts'
import { remarkPlaceholder, prepareTextNode } from './placeholder.js'
import { remarkUnescape } from './remarkUnescape.js'
import { createElementId } from '../../utils/createElementId.ts'

/**
 * Protocols allowed in links.
 */
const LINK_PROTOCOLS = ['http', 'https', 'mailto', 'tel']

/**
 * Heavy libraries should be loaded on demand to reduce component size
 */
const rehypeHighlight = ref(null)
/**
 * Load 'rehype-highlight' library when code block is rendered with `useExtendedMarkdown`
 */
async function importRehypeHighlightLibrary() {
	const module = await import('rehype-highlight')
	rehypeHighlight.value = module.default
}

export default {
	name: 'NcRichText',
	components: {
		NcReferenceList,
	},
	props: {
		text: {
			type: String,
			default: '',
		},
		arguments: {
			type: Object,
			default: () => {
				return {}
			},
		},
		referenceLimit: {
			type: Number,
			default: 0,
		},
		referenceInteractive: {
			type: Boolean,
			default: true,
		},
		referenceInteractiveOptIn: {
			type: Boolean,
			default: false,
		},
		/** Provide data upfront to avoid extra http request */
		references: {
			type: Array,
			default: null,
		},
		/** Provide basic Markdown syntax */
		useMarkdown: {
			type: Boolean,
			default: false,
		},
		/** Provide GitHub Flavored Markdown syntax */
		useExtendedMarkdown: {
			type: Boolean,
			default: false,
		},
		/** Provide event from rendered markdown inputs */
		interactive: {
			type: Boolean,
			default: false,
		},
		autolink: {
			type: Boolean,
			default: true,
		},
	},
	emits: ['interact:todo'],

	data() {
		return {
			parentId: createElementId(),
		}
	},

	methods: {
		renderPlaintext() {
			const placeholders = this.text.split(/(\{[a-z\-_.0-9]+\})/ig).map((entry) => {
				const matches = entry.match(/^\{([a-z\-_.0-9]+)\}$/i)
				// just return plain string nodes as text
				if (!matches) {
					return prepareTextNode({ h, context: this }, entry)
				}
				// return component instance if argument is an object
				const argumentId = matches[1]
				const argument = this.arguments[argumentId]
				if (typeof argument === 'object') {
					const { component, props } = argument
					return h((typeof component === 'string') ? resolveComponent(component) : component, {
						...props,
						class: 'rich-text--component',
					})
				}
				if (argument) {
					return h('span', { class: 'rich-text--fallback' }, argument)
				}
				return entry
			})
			return h('div', { class: 'rich-text--wrapper' }, [
				h('div', {}, placeholders.flat()),
				this.referenceLimit > 0
					? h('div', { class: 'rich-text--reference-widget' }, [
						h(NcReferenceList, {
							text: this.text,
							referenceData: this.references,
							interactive: this.referenceInteractive,
							interactiveOptIn: this.referenceInteractiveOptIn,
						}),
					])
					: null,
			])
		},
		renderMarkdown() {
			const renderedMarkdown = unified()
				.use(remarkParse)
				.use(remarkAutolink, {
					autolink: this.autolink,
					useMarkdown: this.useMarkdown,
					useExtendedMarkdown: this.useExtendedMarkdown,
				})
				.use(remarkUnescape)
				.use(this.useExtendedMarkdown ? remarkGfm : undefined)
				.use(breaks)
				.use(remarkUnlinkProtocols, { except: LINK_PROTOCOLS })
				.use(remark2rehype, {
					handlers: {
						component(toHast, node) {
							return toHast(node, node.component, { value: node.value })
						},
					},
				})
				.use(this.useExtendedMarkdown ? rehypeHighlight.value : undefined)
				.use(remarkPlaceholder)
				.use(rehypeExternalLinks, {
					target: '_blank',
					rel: ['noopener noreferrer'],
				})
				.use(rehype2react, {
					Fragment,
					jsx: this.createElement,
					jsxs: this.createElement,
					elementAttributeNameCase: 'html',
					prefix: false,
				})
				.processSync(this.text
					// escape special symbol "<" to not treat text as HTML
					.replace(/<[^>]+>/g, (match) => match.replace(/</g, '&lt;'))
					// unescape special symbol ">" to parse blockquotes
					.replace(/&gt;/gmi, '>'),
				)
				.result

			return h('div', { class: 'rich-text--wrapper rich-text--wrapper-markdown' }, [
				renderedMarkdown,
				this.referenceLimit > 0
					? h('div', { class: 'rich-text--reference-widget' }, [
						h(NcReferenceList, {
							text: this.text,
							referenceData: this.references,
							interactive: this.referenceInteractive,
							interactiveOptIn: this.referenceInteractiveOptIn,
						}),
					])
					: null,
			])
		},
		createElement(type, props, key) {
			// Modified code from vue/jsx-runtime
			if (key) {
				props.key = key
			}
			// Children should be always an array
			const children = props.children ?? []
			delete props.children

			if (!String(type).startsWith('#')) {
				let nestedNode = null
				if (this.useExtendedMarkdown) {
					if (String(type) === 'code' && !rehypeHighlight.value
						&& props?.class?.includes('language')) {
						importRehypeHighlightLibrary()
					}
					if (String(type) === 'li' && Array.isArray(children)
						&& children[0].type === 'input'
						&& children[0].props.type === 'checkbox') {
						const [inputNode, , ...labelParts] = children

						const nestedNodeIndex = labelParts.findIndex((child) => ['ul', 'ol', 'li', 'blockquote', 'pre'].includes(child.type))
						if (nestedNodeIndex !== -1) {
							nestedNode = labelParts[nestedNodeIndex]
							labelParts.splice(nestedNodeIndex)
						}

						const id = this.parentId + '-markdown-input-' + createElementId()
						const propsToForward = { ...inputNode.props }
						// The checked prop is name modelValue for NcCheckboxRadioSwitch
						delete propsToForward.checked
						const inputComponent = h(NcCheckboxRadioSwitch, {
							...propsToForward,
							modelValue: inputNode.props.checked,
							id,
							disabled: !this.interactive,
							'onUpdate:modelValue': () => {
								this.$emit('interact:todo', id)
							},
						}, { default: () => labelParts })

						return h(type, props, [inputComponent, nestedNode])
					}
				}

				if (String(type) === 'a') {
					const route = getRoute(this.$router, props.href)
					if (route) {
						delete props.href
						delete props.target

						return h(RouterLink, {
							...props,
							to: route,
						}, { default: () => children })
					}
				}
				return h(type, props, children)
			}

			const placeholder = this.arguments[type.slice(1)]
			if (!placeholder) {
				return h('span', { ...props, class: 'rich-text--fallback' }, [`{${type.slice(1)}}`])
			}

			if (!placeholder.component) {
				return h('span', { ...props }, [placeholder])
			}

			return h(
				(typeof placeholder.component === 'string') ? resolveComponent(placeholder.component) : placeholder.component,
				{
					...props,
					...placeholder.props,
					class: 'rich-text--component',
				},
				{ default: () => children },
			)
		},
	},
	render() {
		return this.useMarkdown || this.useExtendedMarkdown
			? this.renderMarkdown()
			: this.renderPlaintext()
	},
}
</script>
<style lang="scss" scoped>
@use './highlight.scss';

// Plain text styles
.rich-text--wrapper {
	overflow-wrap: break-word;
	line-height: 1.5;

	.rich-text--fallback, .rich-text-component {
		display: inline;
	}

	.rich-text--external-link {
		text-decoration: underline;
		&:after {
			content: ' ↗';
		}
	}
}

/* Markdown styles */

.rich-text--wrapper-markdown {
	tab-size: 4;

	div > *:first-child,
	blockquote > *:first-child {
		margin-top: 0 !important;
	}
	div > *:last-child,
	blockquote > *:last-child {
		margin-block-end: 0 !important;
	}

	blockquote {
		padding-inline-start: 13px;
		border-inline-start: 2px solid var(--color-border-dark);
		color: var(--color-text-lighter);
	}

	h1, h2, h3, h4, h5, h6, p, ul, ol, blockquote, pre {
		margin-top: 0;
		margin-block-end: 1em;
	}

	h1, h2, h3, h4, h5, h6 {
		font-weight: bold;
	}

	h1 {
		font-size: 30px;
	}

	ul, ol {
		padding-inline-start: 4ch;
	}

	ul {
		list-style-type: disc;
	}

	/* Flavored Markdown styles */

	ul.contains-task-list {
		list-style-type: none;
		padding: 0;
	}

	li.task-list-item > ul,
	li.task-list-item > ol,
	li.task-list-item > li,
	li.task-list-item > blockquote,
	li.task-list-item > pre {
		margin-inline-start: 15px;
		margin-block-end: 0;
	}

	table {
		border-collapse: collapse;
		border: 2px solid var(--color-border-maxcontrast);

		th,
		td {
			padding: var(--default-grid-baseline);
			border: 1px solid var(--color-border-maxcontrast);
			&:first-child {
				border-inline-start: 0;
			}
			&:last-child {
				border-inline-end: 0;
			}
		}

		tr {
			&:first-child th {
				border-top: 0;
			}
			&:last-child td {
				border-block-end: 0;
			}
		}
	}
}

/* Highlight code syntax in code blocks */

/* stylelint-disable-next-line no-duplicate-selectors */
.rich-text--wrapper-markdown {
	@include highlight.highlight-rules;
}

a:not(.rich-text--component) {
	text-decoration: underline;
}

@media (prefers-color-scheme: light) {
	.rich-text--wrapper-markdown {
		@include highlight.highlight-light-colors;
	}
	[data-theme-dark] .rich-text--wrapper-markdown {
		@include highlight.highlight-dark-colors;
	}
}

@media (prefers-color-scheme: dark) {
	.rich-text--wrapper-markdown {
		@include highlight.highlight-dark-colors;
	}
	[data-theme-light] .rich-text--wrapper-markdown {
		@include highlight.highlight-light-colors;
	}
}
</style>
