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
		:class="{'rich-contenteditable__input--empty': isEmptyValue}"
		:contenteditable="contenteditable"
		:placeholder="placeholder"
		class="rich-contenteditable__input"
		@input="onInput"
		@keydown.delete="onKeyDown" />
</template>

<script>
import Tribute from 'tributejs/dist/tribute.esm'
import debounce from 'debounce'

import { t } from '../../l10n.js'
import AutoCompleteResult from './AutoCompleteResult'
import richEditor from '../../mixins/richEditor/index'

export default {
	name: 'RichContenteditable',

	mixins: [richEditor],

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
		/**
		 * Is the content editable
		 */
		contenteditable: {
			type: Boolean,
			default: true,
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

	computed: {
		isEmptyValue() {
			return !this.value || this.value.trim() === ''
		},

		/**
		 * Is this Firefox? 🙄
		 * @returns {boolean}
		 */
		isFF() {
			return !!navigator.userAgent.match(/firefox/i)
		},

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
		 * Because FF have a decade old bug preventing contenteditable=false
		 * to properly be deleted on backspace, we have to hack 👀
		 * https://stackoverflow.com/a/59383394/3885878
		 *
		 * @param {Event} e the delete keydown event
		 */
		onKeyDown(e) {
			if (!this.isFF) {
				return
			}
			const selection = document.getSelection()

			// If caret is at the begining of the text node (0), remove previous element
			if (selection && selection.anchorOffset === 0) {
				// If there is no node or the node is not a mention, let's do nothing
				if (!selection.anchorNode.previousSibling
					|| !selection.anchorNode.previousSibling.classList.contains('mention-bubble')) {
					return
				}
				// Otherwise, delete the node
				selection.anchorNode.previousSibling.parentNode.removeChild(selection.anchorNode.previousSibling)
			}
		},

		/**
		 * Debounce the autocomplete function
		 */
		debouncedAutoComplete: debounce(async function(search, callback) {
			this.autoComplete(search, callback)
		}, 200),
	},
}
</script>

<style lang="scss" scoped>
// Standalone styling, independent from server
.rich-contenteditable__input {
	width: auto;
	margin: 0;
	padding: 6px;
	cursor: text;
	color: var(--color-main-text);
	border: 1px solid var(--color-border-dark);
	border-radius: var(--border-radius);
	outline: none;
	background-color: var(--color-main-background);
	font-family: var(--font-face);
	font-size: inherit;

	// Cannot use :empty because of firefox bug https://bugzilla.mozilla.org/show_bug.cgi?id=1513303
	&--empty:before {
		position: absolute;
		content: attr(placeholder);
		color: var(--color-text-maxcontrast);
	}

	&[contenteditable='false'] {
		cursor: default;
		opacity: .5;
		color: var(--color-text-lighter);
		border: 1px solid var(--color-background-darker);
		border-radius: var(--border-radius);
		background-color: var(--color-background-dark);
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
