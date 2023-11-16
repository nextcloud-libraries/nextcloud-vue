<!--
  - @copyright Copyright (c) 2020 Julius Härtl <jus@bitgrid.net>
  -
  - @author Julius Härtl <jus@bitgrid.net>
  - @author Guido Krömer <mail@cacodaemon.de>
  -
  - @license GNU AGPL version 3 or any later version
  -
  - This program is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as
  - published by the Free Software Foundation, either version 3 of the
  - License, or (at your option) any later version.
  -
  - This program is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
  -
  -->
<docs>
### General description

This component displays rich text with optional autolink or [Markdown support](https://www.markdownguide.org/basic-syntax/).

```vue
<template>
	<div>
		<textarea v-model="text" />
		<NcCheckboxRadioSwitch v-model:checked="autolink" type="checkbox">Autolink</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch v-model:checked="useMarkdown" type="checkbox">Use Markdown</NcCheckboxRadioSwitch>

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

		<NcCheckboxRadioSwitch v-model:checked="autolink" type="checkbox">Autolink</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch v-model:checked="useMarkdown" type="checkbox">Use Markdown</NcCheckboxRadioSwitch>

		<NcRichText :text="text"
			:autolink="autolink"
			:arguments="userMentions"
			:use-markdown="useMarkdown" />
	</div>
</template>
<script>
	export default {
		data() {
			return {
				message: '',
				autolink: true,
				useMarkdown: true,
				userData: {
					Test01: {
						icon: 'icon-user',
						id: 'Test01',
						title: 'Test01',
						source: 'users',
						primary: true,
					},
					Test02: {
						icon: 'icon-user',
						id: 'Test02',
						title: 'Test02',
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
						title: 'Test 03',
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
						title: 'Test Offline',
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
						title: 'Test DND',
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
import NcReferenceList from './NcReferenceList.vue'
import { remarkAutolink } from './autolink.js'
import { remarkPlaceholder, prepareTextNode } from './placeholder.js'

import { unified } from 'unified'
import markdown from 'remark-parse'
import breaks from 'remark-breaks'
import remark2rehype from 'remark-rehype'
import rehype2react from 'rehype-react'
import rehypeExternalLinks from 'rehype-external-links'
import { h, resolveComponent } from 'vue'

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
		/** Provide data upfront to avoid extra http request */
		references: {
			type: Object,
			default: null,
		},
		markdownCssClasses: {
			type: Object,
			default: () => {
				return {
					a: 'rich-text--external-link',
					ol: 'rich-text--ordered-list',
					ul: 'rich-text--un-ordered-list',
					li: 'rich-text--list-item',
					strong: 'rich-text--strong',
					em: 'rich-text--italic',
					h1: 'rich-text--heading rich-text--heading-1',
					h2: 'rich-text--heading rich-text--heading-2',
					h3: 'rich-text--heading rich-text--heading-3',
					h4: 'rich-text--heading rich-text--heading-4',
					h5: 'rich-text--heading rich-text--heading-5',
					h6: 'rich-text--heading rich-text--heading-6',
					hr: 'rich-text--hr',
					table: 'rich-text--table',
					pre: 'rich-text--pre',
					code: 'rich-text--code',
					blockquote: 'rich-text--blockquote',
				}
			},
		},
		useMarkdown: {
			type: Boolean,
			default: false,
		},
		autolink: {
			type: Boolean,
			default: true,
		},
	},
	methods: {
		renderPlaintext() {
			const context = this
			const placeholders = this.text.split(/(\{[a-z\-_.0-9]+\})/ig).map(function(entry, index, list) {
				const matches = entry.match(/^\{([a-z\-_.0-9]+)\}$/i)
				// just return plain string nodes as text
				if (!matches) {
					return prepareTextNode({ h, context }, entry)
				}
				// return component instance if argument is an object
				const argumentId = matches[1]
				const argument = context.arguments[argumentId]
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
						h(NcReferenceList, { text: this.text, referenceData: this.references }),
					])
					: null,
			])
		},
		renderMarkdown() {
			const renderedMarkdown = unified()
				.use(markdown)
				.use(remarkAutolink, {
					autolink: this.autolink,
					useMarkdown: this.useMarkdown,
				})
				.use(breaks)
				.use(remark2rehype, {
					handlers: {
						component(toHast, node) {
							return toHast(node, node.component, { value: node.value })
						},
					},
				})
				// .use(rehypeAddClasses, this.markdownCssClasses)
				.use(remarkPlaceholder)
				.use(rehypeExternalLinks, {
					target: '_blank',
					rel: ['noopener noreferrer'],
				})
				.use(rehype2react, {
					createElement: (tag, attrs, children) => {
						// unescape special symbol "<" for simple text nodes
						children = children?.map(child => typeof child === 'string'
							? child.replace(/&lt;/gmi, '<')
							: child,
						)

						if (!tag.startsWith('#')) {
							return h(tag, { ...attrs }, children)
						}

						const placeholder = this.arguments[tag.slice(1)]
						if (!placeholder) {
							return h('span', { ...attrs, class: 'rich-text--fallback' }, [`{${tag.slice(1)}}`])
						}

						if (!placeholder.component) {
							return h('span', { ...attrs }, [placeholder])
						}

						return h(
							(typeof placeholder.component === 'string') ? resolveComponent(placeholder.component) : placeholder.component,
							{
								...attrs,
								...placeholder.props,
								class: 'rich-text--component',
							},
							children,
						)
					},
					prefix: false,
				})
				.processSync(this.text
					// escape special symbol "<" to not treat text as HTML
					.replace(/</gmi, '&lt;')
					// unescape special symbol ">" to parse blockquotes
					.replace(/&gt;/gmi, '>'),
				)
				.result

			return h('div', { class: 'rich-text--wrapper rich-text--wrapper-markdown' }, [
				renderedMarkdown,
				this.referenceLimit > 0
					? h('div', { class: 'rich-text--reference-widget' }, [
						h(NcReferenceList, { text: this.text, referenceData: this.references }),
					])
					: null,
			])
		},
	},
	render() {
		return this.useMarkdown
			? this.renderMarkdown()
			: this.renderPlaintext()
	},
}
</script>
<style lang="scss" scoped>
/* stylelint-disable-next-line scss/at-import-partial-extension */
@import './richtext.scss';

a:not(.rich-text--component) {
	text-decoration: underline;
}
</style>
