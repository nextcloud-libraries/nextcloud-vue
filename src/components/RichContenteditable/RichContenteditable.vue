<!--
  - @copyright Copyright (c) 2020 John Molakvoæ <skjnldsv@protonmail.com>
  -
  - @author John Molakvoæ <skjnldsv@protonmail.com>
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
-->

<docs>

### General description

This component displays contenteditable div with automated @ autocompletion [at].

### Examples

```vue
<template>
	<div>
		<RichContenteditable
			v-model="message"
			:auto-complete="autoComplete"
			:user-data="userData"
			placeholder="Try mentioning the user Test01"
			style="width: 350px;height: 100px;" />
		{{ message }}
	</div>
</template>
<script>
export default {
	data() {
		return {
			message: '',
			// You need to provide this for the inline
			// mention to understand what to display or not.
			userData: {
				Test01: {
					icon: 'icon-user',
					id: 'Test01',
					label: 'Test01',
					source: 'users',
					primary: true
				},
				Test02: {
					icon: 'icon-user',
					id: 'Test02',
					label: 'Test02',
					source: 'users'
				}
			}
		}
	},
	methods: {
		/**
		* Do your own query to the autocompletion api.
		* The returned data bellow is a fake data example.
		* The callback expects the same format returned by the core/autocomplete/get ocs api endpoint!
		* @param {string} search the query
		* @param {Function} callback the callback to process the results with
		*/
		autoComplete(search, callback) {
			return callback(Object.values(this.userData))
		}
	}
}
</script>
```

</docs>

<template>
	<div ref="contenteditable"
		:contenteditable="true"
		:placeholder="placeholder"
		class="rich-contenteditable__input"
		@input="onInput" />
</template>

<script>
import Vue from 'vue'
import Tribute from 'tributejs/dist/tribute.esm'
import debounce from 'debounce'
import stripTags from 'striptags'
import escapeHtml from 'escape-html'

import { t } from '../../l10n.js'
import AutoCompleteResult from './AutoCompleteResult'
import MentionBubble from './MentionBubble.vue'

const MENTION_START = '[\\n\\t ]'
// Anything that is not text
const MENTION_END = '[^a-z]'
const USERID_REGEX = new RegExp(`${MENTION_START}(@[a-zA-Z0-9_.@\\-']+)(${MENTION_END})`, 'g')
const USERID_REGEX_WITH_SPACE = new RegExp(`${MENTION_START}(@"[a-zA-Z0-9 _.@\\-']+")(${MENTION_END})`, 'g')

export default {
	name: 'RichContenteditable',

	props: {
		value: {
			type: String,
			required: true,
		},
		placeholder: {
			type: String,
			default: t('Write message, @ to mention someone …'),
		},
		autoComplete: {
			type: Function,
			required: true,
		},
		menuContainer: {
			type: Element,
			default: () => document.body,
		},
		userData: {
			type: Object,
			default: () => ({}),
		},
	},

	data() {
		return {
			tribute: null,
			options: {
				fillAttr: 'id',
				// Search against id and label (display name)
				lookup: result => `${result.id} ${result.label}`,
				menuContainer: this.menuContainer,
				menuItemTemplate: item => this.renderComponentHtml(item.original, AutoCompleteResult),
				noMatchTemplate: () => '<span class="hidden"></span>',
				selectTemplate: item => this.genSelectTemplate(item.original?.id),
				values: this.debouncedAutoComplete,
			},
		}
	},

	watch: {
		/**
		 * If the parent value change, we compare the plain text rendering
		 * If it's different, we render everything and update the main content
		 */
		value() {
			const html = this.$refs.contenteditable.innerHTML
			if (this.value !== this.parseContent(html)) {
				const renderedContent = this.renderContent(this.value)
				this.$refs.contenteditable.innerHTML = renderedContent
			}
		},
	},

	mounted() {
		this.tribute = new Tribute(this.options)
		this.tribute.attach(this.$el)

		// Update default value
		const renderedContent = this.renderContent(this.value)
		this.$refs.contenteditable.innerHTML = renderedContent

	},
	beforeDestroy() {
		if (this.tribute) {
			this.tribute.detach(this.$el)
		}
	},

	methods: {
		/**
		 * Re-emit the input event to the parent
		 * @param {Event} event the input event
		 */
		onInput(event) {
			const html = event.target.innerHTML
			const text = this.parseContent(html)
			this.$emit('input', text)
			this.$emit('update:value', text)
		},

		/**
		 * Debounce the autocomplete function
		 */
		debouncedAutoComplete: debounce(async function(search, callback) {
			this.autoComplete(search, callback)
		}, 200),

		/**
		 * Convert the value string to html for the inner content
		 * @param {string} value the content without html
		 * @returns {string}
		 */
		renderContent(value) {
			// Sanitize the value prop
			// Wrapping in two a space because mentions needs to be
			// separated by spaces. Wwe trim afterwards
			const sanitizedValue = ' ' + escapeHtml(value) + ' '

			// Extract all the userIds
			const splitValue = sanitizedValue.split(USERID_REGEX)
				.map(part => part.split(USERID_REGEX_WITH_SPACE)).flat()

			// Replace userIds by html
			return splitValue
				.map(part => {
					// When splitting, the string is always putting the userIds
					// on the the uneven indexes. We only want to generate the mentions html
					if (!part.startsWith('@')) {
						return part
					}

					// Extracting the id, nuking the " and @
					const id = part.replace(/[@"]/gi, '')

					// Compiling template and append missing space at the end
					return this.genSelectTemplate(id) + ' '
				})
				.join('')
				.trim()
		},

		/**
		 * Convert the value string to html for the inner content
		 * @param {string} content the content without html
		 * @returns {string}
		 */
		parseContent(content) {
			let text = content.replace(/<br>/g, '\n')
			text = text.replace(/&nbsp;/g, ' ')

			// Convert the mentions to text only
			text = stripTags(text)

			return text.trim()
		},

		/**
		 * Generate an autocompletion popup entry template
		 * @param {string} value the valeu to match against the userData
		 * @returns {string}
		 */
		genSelectTemplate(value) {
			let data = this.userData[value]

			// Default fallback value in case nothing is found
			if (!data) {
				data = {
					id: value,
					label: value,
					icon: 'icon-user',
					source: 'users',
				}
			}

			// Return template and make sure we strip of new lines and tabs
			return this.renderComponentHtml(data, MentionBubble).replace(/[\n\t]/g, '')
		},

		/**
		 * Render a component and return its html content
		 *
		 * @param {Object} propsData the props to pass to the component
		 * @param {Object} component the component to render
		 * @returns {string} the rendered html
		 */
		renderComponentHtml(propsData, component) {
			const View = Vue.extend(component)
			const Item = new View({
				propsData,
			})

			// Prepare mountpoint
			const wrapper = document.createElement('div')
			const mount = document.createElement('div')
			wrapper.style.display = 'none'
			wrapper.appendChild(mount)
			document.body.appendChild(wrapper)

			// Mount and get raw html
			Item.$mount(mount)
			const renderedHtml = wrapper.innerHTML

			// Destroy
			Item.$destroy()
			wrapper.remove()

			return renderedHtml
		},
	},
}
</script>

<style lang="scss" scoped>
.rich-contenteditable__input {
	width: auto;
	cursor: text;

	&:empty:before {
		content: attr(placeholder);
		color: var(--color-text-maxcontrast);
	}
}

</style>

<style lang="scss">
@import '../../fonts/scss/iconfont-vue';

.tribute-container {
	z-index: 9000;
	overflow: auto;
	min-width: 250px;
	max-width: 300px;
	// Show maximum 4 entries and a half to show scroll
	max-height: $clickable-area * 4.5;
	// Space it out a bit from the text
	margin: 5px 0;
	color: var(--color-main-text);
	border-radius: var(--border-radius);
	background: var(--color-main-background);
	box-shadow: 0 0 5px var(--color-box-shadow);
}

</style>
