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
			:maxlength="100"
			:user-data="userData"
			placeholder="Try mentioning the user Test01"
			@submit="onSubmit" />
		<br>

		<RichContenteditable
			v-model="message"
			:auto-complete="autoComplete"
			:maxlength="400"
			:multiline="true"
			:user-data="userData"
			placeholder="Try mentioning the user Test01"
			@submit="onSubmit" />
		<br>
		<br>
		{{ JSON.stringify(message) }}
	</div>
</template>
<script>
export default {
	data() {
		return {
			message: 'Lorem ipsum dolor sit amet.',

			// You need to provide this for the inline
			// mention to understand what to display or not.
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
				}
			}
		}
	},
	methods: {
		/**
		* Do your own query to the autocompletion api.
		* The returned data bellow is a fake data example.
		* The callback expects the same format returned by the core/autocomplete/get ocs api endpoint!
		* @see userData example above
		*
		* @param {string} search the query
		* @param {Function} callback the callback to process the results with
		*/
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

<template>
	<div ref="contenteditable"
		v-tooltip="tooltip"
		:class="{
			'rich-contenteditable__input--empty': isEmptyValue,
			'rich-contenteditable__input--multiline': multiline,
			'rich-contenteditable__input--overflow': isOverMaxlength,
		}"
		:contenteditable="contenteditable"
		:placeholder="placeholder"
		aria-multiline="true"
		class="rich-contenteditable__input"
		role="textbox"
		@input="onInput"
		v-on="$listeners"
		@keydown.delete="onDelete"
		@keydown.enter.exact="onEnter"
		@keydown.ctrl.enter.exact.stop.prevent="onCtrlEnter"
		@paste="onPaste" />
</template>

<script>
import Tribute from 'tributejs/dist/tribute.esm'
import debounce from 'debounce'
import stringLength from 'string-length'

import { t } from '../../l10n.js'
import AutoCompleteResult from './AutoCompleteResult'
import richEditor from '../../mixins/richEditor/index'

export default {
	name: 'RichContenteditable',

	mixins: [richEditor],

	props: {
		value: {
			type: String,
			default: '',
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
		 * Make the contenteditable looks like a textarea or not.
		 * Default looks like a single-line input.
		 * This also handle the default enter/shift+enter behaviour.
		 * if multiline, enter = newline; otherwise enter = submit
		 * shift+enter always add a new line. ctrl+enter always submits
		 */
		multiline: {
			type: Boolean,
			default: false,
		},

		/**
		 * Is the content editable ?
		 */
		contenteditable: {
			type: Boolean,
			default: true,
		},

		/**
		 * Max allowed length
		 */
		maxlength: {
			type: Number,
			default: null,
		},
	},

	data() {
		return {
			tribute: null,
			options: {
				fillAttr: 'id',
				// Search against id and label (display name)
				lookup: result => `${result.id} ${result.label}`,
				// Where to inject the menu popup
				menuContainer: this.menuContainer,
				// Popup mention autocompletion templates
				menuItemTemplate: item => this.renderComponentHtml(item.original, AutoCompleteResult),
				// Hide if no results
				noMatchTemplate: () => '<span class="hidden"></span>',
				// Inner display of mentions
				selectTemplate: item => this.genSelectTemplate(item?.original?.id),
				// Autocompletion results
				values: this.debouncedAutoComplete,
			},

			// Represent the raw untrimmed text of the contenteditable
			// serves no other purpose than to check whether the
			// content is empty or not
			localValue: this.value,
		}
	},

	computed: {
		/**
		 * Is the current trimmed value empty?
		 * @returns {boolean}
		 */
		isEmptyValue() {
			return !this.localValue
				|| (this.localValue && this.localValue.trim() === '')
		},

		/**
		 * Is this Firefox? 🙄
		 * @returns {boolean}
		 */
		isFF() {
			return !!navigator.userAgent.match(/firefox/i)
		},

		/**
		 * Is the current value over maxlength?
		 * @returns {boolean}
		 */
		isOverMaxlength() {
			if (this.isEmptyValue || !this.maxlength) {
				return false
			}
			return stringLength(this.localValue) > this.maxlength
		},

		/**
		 * Tooltip to show if characters count is over limit
		 * @returns {string}
		 */
		tooltip() {
			if (!this.isOverMaxlength) {
				return null
			}
			return {
				content: t('Message limit of {count} characters reached', { count: this.maxlength }),
				show: true,
				trigger: 'manual',
			}
		},
	},

	watch: {
		/**
		 * If the parent value change, we compare the plain text rendering
		 * If it's different, we render everything and update the main content
		 */
		value() {
			const html = this.$refs.contenteditable.innerHTML
			// Compare trimmed versions to be safe
			if (this.value.trim() !== this.parseContent(html).trim()) {
				this.updateContent(this.value)
			}
		},
	},

	mounted() {
		this.tribute = new Tribute(this.options)
		this.tribute.attach(this.$el)

		// Update default value
		this.updateContent(this.value)

		// Removes the contenteditable attribute at first load if the prop is
		// set to false.
		this.$refs.contenteditable.contentEditable = this.contenteditable
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
			this.updateValue(event.target.innerHTML)
		},

		/**
		 * When pasting, sanitize the content, extract text
		 * and render it again
		 * @param {Event} event the paste event
		 * @emits {Event} paste the original paste event
		 */
		onPaste(event) {
			event.preventDefault()
			const clipboardData = event.clipboardData

			/** The original paste event */
			this.$emit('paste', event)

			// If we have a file or if we don't have any text, ignore
			if (clipboardData.files.length !== 0
				|| !Object.values(clipboardData.items).find(item => item?.type.startsWith('text'))) {
				return
			}

			const html = clipboardData.getData('text')
			const selection = window.getSelection()

			// If no selection, replace the whole data
			if (!selection.rangeCount) {
				this.updateValue(html)
			}

			// Generate text and insert
			const text = this.parseContent(html)
			const range = selection.getRangeAt(0)
			selection.deleteFromDocument()
			range.insertNode(document.createTextNode(text))

			// Put cursor at the end of the selection
			const newRange = document.createRange()
			newRange.setStart(event.target, range.endOffset)
			newRange.collapse(true)
			selection.removeAllRanges()
			selection.addRange(newRange)

			// Propagate data
			this.updateValue(event.target.innerHTML)
		},

		/**
		 * Update the value text from the provided html
		 * @param {string} htmlOrText the html content (or raw text with @mentions)
		 */
		updateValue(htmlOrText) {
			const text = this.parseContent(htmlOrText)
			this.localValue = text
			this.$emit('input', text)
			this.$emit('update:value', text)
		},

		/**
		 * Update content and local value
		 * @param {string} value the message value
		 */
		updateContent(value) {
			const renderedContent = this.renderContent(value)
			this.$refs.contenteditable.innerHTML = renderedContent
			this.localValue = value
		},

		/**
		 * Because FF have a decade old bug preventing contenteditable=false
		 * to properly be deleted on backspace, we have to hack 👀
		 * https://stackoverflow.com/a/59383394/3885878
		 * https://stackoverflow.com/a/30574622
		 *
		 * @param {Event} event the delete keydown event
		 */
		onDelete(event) {
			if (!this.isFF || !window.getSelection) {
				return
			}

			// fix backspace bug in FF
			// https://bugzilla.mozilla.org/show_bug.cgi?id=685445
			const selection = window.getSelection()
			const node = event.target
			if (!selection.isCollapsed || !selection.rangeCount) {
				return
			}

			const curRange = selection.getRangeAt(selection.rangeCount - 1)
			if (curRange.commonAncestorContainer.nodeType === 3 && curRange.startOffset > 0) {
				// we are in child selection. The characters of the text node is being deleted
				return
			}

			const range = document.createRange()
			if (selection.anchorNode !== node) {
				// selection is in character mode. expand it to the whole editable field
				range.selectNodeContents(node)
				range.setEndBefore(selection.anchorNode)
			} else if (selection.anchorOffset > 0) {
				range.setEnd(node, selection.anchorOffset)
			} else {
				// reached the beginning of editable field
				return
			}
			range.setStart(node, range.endOffset - 1)

			const previousNode = range.cloneContents().lastChild
			if (previousNode && previousNode.contentEditable === 'false') {
				// this is some rich content, e.g. smile. We should help the user to delete it
				range.deleteContents()
				event.preventDefault()
			}
		},

		/**
		 * Enter key pressed. Submits if not multiline
		 * @param {Event} event the keydown event
		 */
		onEnter(event) {
			// Prevent submitting if autocompletion menu
			// is opened or length is over maxlength
			if (this.multiline || this.isOverMaxlength || this.tribute.isActive) {
				return
			}

			event.preventDefault()
			event.stopPropagation()
			this.$emit('submit', event)
		},
		/**
		 * Ctrl + Enter key pressed
		 * @param {Event} event the keydown event
		 */
		onCtrlEnter(event) {
			if (this.isOverMaxlength) {
				return
			}
			this.$emit('submit', event)
		},

		/**
		 * Debounce the autocomplete function
		 */
		debouncedAutoComplete: debounce(async function(search, callback) {
			this.autoComplete(search, callback)
		}, 100),
	},
}
</script>

<style lang="scss" scoped>
// Standalone styling, independent from server
.rich-contenteditable__input {
	overflow-y: auto;
	width: auto;
	margin: 0;
	padding: 6px;
	cursor: text;
	white-space: pre-wrap;
	word-break: break-word;
	color: var(--color-main-text);
	border: 1px solid var(--color-border-dark);
	border-radius: var(--border-radius);
	outline: none;
	background-color: var(--color-main-background);
	font-family: var(--font-face);
	font-size: inherit;
	min-height: $clickable-area;
	max-height: $clickable-area * 5.5;

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

	&--multiline {
		min-height: $clickable-area * 3;
		// No max for mutiline
		max-height: none;
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
	// 44px + 10px padding
	max-height: ($clickable-area + 20px) * 4.5;
	// Space it out a bit from the text
	margin: 5px 0;
	color: var(--color-main-text);
	border-radius: var(--border-radius);
	background: var(--color-main-background);
	box-shadow: 0 1px 5px var(--color-box-shadow);
}

</style>
