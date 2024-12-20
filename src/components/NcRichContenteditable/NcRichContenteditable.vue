<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>

### General description

This component displays contenteditable div with automated `@` [at] autocompletion and `:` [colon] emoji autocompletion.

### Examples

Try mentioning user @Test01 or inserting emoji :smile

```vue
<template>
	<div>
		<NcRichContenteditable
			label="Write a comment"
			v-model="message"
			:auto-complete="autoComplete"
			:maxlength="100"
			:user-data="userData"
			@submit="onSubmit" />
		<br>

		<NcRichContenteditable
			v-model="message"
			:auto-complete="autoComplete"
			:maxlength="400"
			:multiline="true"
			:user-data="userData"
			@submit="onSubmit" />

		<h5>Output - raw</h5>
		{{ JSON.stringify(message) }}

		<h5>Output - preformatted</h5>
		<p class="pre-line">{{ message }}</p>

		<h5>Output - in NcRichText with markdown support</h5>
		<NcRichText :text="text" :arguments="userMentions" autolink use-markdown />
	</div>
</template>
<script>
export default {
	data() {
		return {
			message: '**Lorem ipsum** dolor sit amet.',
			// You need to provide this for the inline mention to understand what to display or not.
			// Key should be a string with leading '@', like @Test02 or @"Test Offline"
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
			// To display user bubbles in NcRichText, special format of data should be provided:
			// Key should be in curly brackets without '@' and ' ' symbols, like {user-2}
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
			}
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
<style lang="scss" scoped>
	h5 {
		font-weight: bold;
		margin: 40px 0 20px 0;
	}

	.pre-line {
		white-space: pre-line;
	}
</style>
```

### Using public methods

```vue
<template>
	<div>
		<div class="buttons-wrapper">
			<NcButton class="show-slash-button" @click="showSlashCommands">Slash commands</NcButton>
			<NcButton class="focus-button" @click="focus">Focus on input</NcButton>
		</div>
		<NcRichContenteditable
			ref="contenteditable"
			label="Write a comment"
			v-model="message"
			:maxlength="100"/>
	</div>
</template>
<script>
export default {
	data() {
		return {
			message: '**Lorem ipsum** dolor sit amet. ',
		}
	},
	methods: {
		showSlashCommands() {
			this.$refs.contenteditable.showTribute('/')
		},
		focus() {
			this.$refs.contenteditable.focus()
		},
	},
}
</script>
<style lang="scss" scoped>
	.buttons-wrapper {
		display: flex;
		gap: 10px;
		margin-bottom: 20px;
	}
</style>
```

</docs>

<template>
	<div class="rich-contenteditable">
		<div :id="id"
			ref="contenteditable"
			v-tooltip="tooltipString"
			:class="{
				'rich-contenteditable__input--empty': isEmptyValue,
				'rich-contenteditable__input--multiline': multiline,
				'rich-contenteditable__input--has-label': label,
				'rich-contenteditable__input--overflow': isOverMaxlength,
				'rich-contenteditable__input--disabled': disabled,
			}"
			:contenteditable="canEdit"
			:aria-labelledby="label ? labelId : undefined"
			:aria-placeholder="placeholder"
			aria-multiline="true"
			class="rich-contenteditable__input"
			role="textbox"
			aria-haspopup="listbox"
			aria-autocomplete="inline"
			:aria-controls="tributeId"
			:aria-expanded="isAutocompleteOpen ? 'true' : 'false'"
			:aria-activedescendant="autocompleteActiveId"
			v-bind="$attrs"
			v-on="listeners"
			@focus="moveCursorToEnd"
			@input="onInput"
			@compositionstart="isComposing = true"
			@compositionend="isComposing = false"
			@keydown.esc.capture="onKeyEsc"
			@keydown.enter.exact="onEnter"
			@keydown.ctrl.enter.exact.stop.prevent="onCtrlEnter"
			@paste="onPaste"
			@keyup.stop.prevent.capture="onKeyUp"
			@keydown.up.exact.stop="onTributeArrowKeyDown"
			@keydown.down.exact.stop="onTributeArrowKeyDown"
			@tribute-active-true="onTributeActive(true)"
			@tribute-active-false="onTributeActive(false)" />
		<div v-if="label"
			:id="labelId"
			class="rich-contenteditable__label">
			{{ label }}
		</div>
	</div>
</template>

<script>
import { t } from '../../l10n.js'
import NcAutoCompleteResult from './NcAutoCompleteResult.vue'
import richEditor from '../../mixins/richEditor/index.js'
import Tooltip from '../../directives/Tooltip/index.js'
import { emojiSearch, emojiAddRecent } from '../../functions/emoji/index.ts'
import { searchProvider, getLinkWithPicker } from '../NcRichText/index.js'

import Tribute from 'tributejs/dist/tribute.esm.js'
import debounce from 'debounce'
import stringLength from 'string-length'
import GenRandomId from '../../utils/GenRandomId.js'
import { useModelMigration } from '../../composables/useModelMigration.ts'

/**
 * Populate the list of text smiles we want to offer via Tribute.
 * We add the colon `:)` and colon-dash `:-)` version for each of them.
 */
const smilesCharacters = ['d', 'D', 'p', 'P', 's', 'S', 'x', 'X', ')', '(', '|', '/']
const textSmiles = []
smilesCharacters.forEach((char) => {
	textSmiles.push(':' + char)
	textSmiles.push(':-' + char)
})

export default {
	name: 'NcRichContenteditable',

	directives: {
		tooltip: Tooltip,
	},

	mixins: [richEditor],

	inheritAttrs: false,

	model: {
		prop: 'modelValue',
		event: 'update:modelValue',
	},

	props: {
		/**
		 * The ID attribute of the content editable
		 */
		id: {
			type: String,
			default: () => GenRandomId(7),
		},

		/**
		 * Visual label of the contenteditable
		 */
		label: {
			type: String,
			default: '',
		},

		/**
		 * Removed in v9 - use `modelValue` (`v-model`) instead
		 * @deprecated
		 */
		value: {
			type: String,
			default: undefined,
		},

		modelValue: {
			type: String,
			default: '',
		},

		placeholder: {
			type: String,
			default: t('Write a message …'),
		},

		autoComplete: {
			type: Function,
			default: () => [],
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
		 * Disable the editing and show specific disabled design
		 */
		disabled: {
			type: Boolean,
			default: false,
		},

		/**
		 * Max allowed length
		 */
		maxlength: {
			type: Number,
			default: null,
		},

		/**
		 * Enable or disable emoji autocompletion
		 */
		emojiAutocomplete: {
			type: Boolean,
			default: true,
		},

		/**
		 * Enable or disable link autocompletion
		 */
		linkAutocomplete: {
			type: Boolean,
			default: true,
		},
	},

	emits: [
		'submit',
		'paste',
		/**
		 * Removed in v9 - use `update:modelValue` (`v-model`) instead
		 * @deprecated
		 */
		'update:value',
		'update:modelValue',
		/** Same as update:modelValue for Vue 2 compatibility */
		'update:model-value',
		'smart-picker-submit',
	],

	setup() {
		const uid = GenRandomId(5)
		const model = useModelMigration('value', 'update:value', true)
		return {
			model,
			// Constants
			labelId: `nc-rich-contenteditable-${uid}-label`,
			tributeId: `nc-rich-contenteditable-${uid}-tribute`,
			/**
			 * Non-reactive property to store Tribute instance
			 *
			 * @type {import('tributejs').default | null}
			 */
			tribute: null,
			tributeStyleMutationObserver: null,
		}
	},

	data() {
		return {
			// Represent the raw untrimmed text of the contenteditable
			// serves no other purpose than to check whether the
			// content is empty or not
			localValue: this.model,

			// Is in text composition session in IME
			isComposing: false,

			// Tribute autocomplete
			isAutocompleteOpen: false,
			autocompleteActiveId: undefined,
			isTributeIntegrationDone: false,
		}
	},

	computed: {
		/**
		 * Is the current trimmed value empty?
		 *
		 * @return {boolean}
		 */
		isEmptyValue() {
			return !this.localValue || this.localValue.trim() === ''
		},

		/**
		 * Is the current value over maxlength?
		 *
		 * @return {boolean}
		 */
		isOverMaxlength() {
			if (this.isEmptyValue || !this.maxlength) {
				return false
			}
			return stringLength(this.localValue) > this.maxlength
		},

		/**
		 * Tooltip to show if characters count is over limit
		 *
		 * @return {string}
		 */
		tooltipString() {
			if (!this.isOverMaxlength) {
				return null
			}
			return {
				content: t('Message limit of {count} characters reached', { count: this.maxlength }),
				shown: true,
				trigger: 'manual',
			}
		},

		/**
		 * Edit is only allowed when contenteditableis true and disabled is false
		 *
		 * @return {boolean}
		 */
		canEdit() {
			return this.contenteditable && !this.disabled
		},

		/**
		 * Proxied native event handlers without custom event handlers
		 *
		 * @return {Record<string, Function>}
		 */
		listeners() {
			/**
			 * All component's event handlers are set as native event handlers with by v-on directive.
			 * The component also raised custom events manually by $emit for corresponding events.
			 * As a result, it triggers handlers twice.
			 * The v-on="listeners" directive should only set proxied native events handler without custom events
			 */
			const listeners = { ...this.$listeners }
			delete listeners.paste
			return listeners
		},

		/**
		 * Compute debounce function for the autocomplete function
		 */
		 debouncedAutoComplete() {
			return debounce(async (search, callback) => {
				this.autoComplete(search, callback)
			}, 100)
		},
	},

	watch: {
		/**
		 * If the parent value change, we compare the plain text rendering
		 * If it's different, we render everything and update the main content
		 */
		model() {
			const html = this.$refs.contenteditable.innerHTML
			// Compare trimmed versions to be safe
			if (this.model.trim() !== this.parseContent(html).trim()) {
				this.updateContent(this.model)
			}
		},
	},

	mounted() {
		this.initializeTribute()

		// Update default value
		this.updateContent(this.model)

		// Removes the contenteditable attribute at first load if the prop is
		// set to false.
		this.$refs.contenteditable.contentEditable = this.canEdit
	},

	beforeDestroy() {
		if (this.tribute) {
			this.tribute.detach(this.$refs.contenteditable)
		}

		if (this.tributeStyleMutationObserver) {
			this.tributeStyleMutationObserver.disconnect()
		}
	},

	methods: {
		/**
		 * Focus the richContenteditable
		 *
		 * @public
		 */
		focus() {
			this.$refs.contenteditable.focus()
		},

		initializeTribute() {
			const renderMenuItem = (content) => `<div id="nc-rich-contenteditable-tribute-item-${GenRandomId(5)}" class="${this.$style['tribute-item']}" role="option">${content}</div>`

			const tributesCollection = []
			tributesCollection.push({
				fillAttr: 'id',
				// Search against id and label (display name) (fallback to title for v8.0.0..8.6.1 compatibility)
				lookup: result => `${result.id} ${result.label ?? result.title}`,
				requireLeadingSpace: true,
				// Popup mention autocompletion templates
				menuItemTemplate: item => renderMenuItem(this.renderComponentHtml(item.original, NcAutoCompleteResult)),
				// Hide if no results
				noMatchTemplate: () => '<span class="hidden"></span>',
				// Inner display of mentions
				selectTemplate: item => this.genSelectTemplate(item?.original?.id),
				// Autocompletion results
				values: this.debouncedAutoComplete,
				// Class added to the menu container
				containerClass: `${this.$style['tribute-container']} ${this.$style['tribute-container-autocomplete']}`,
				// Class added to each list item
				itemClass: this.$style['tribute-container__item'],

			})

			if (this.emojiAutocomplete) {
				tributesCollection.push({
					trigger: ':',
					// Don't use the tribute search function at all
					// We pass search results as values (see below)
					lookup: (result, query) => query,
					requireLeadingSpace: true,
					// Popup mention autocompletion templates
					menuItemTemplate: item => {
						if (textSmiles.includes(item.original)) {
							// Display the raw text string for :), :-D, … for non emoji results,
							// instead of trying to show an image and their name.
							return item.original
						}
						return renderMenuItem(`<span class="${this.$style['tribute-item__emoji']}">${item.original.native}</span> :${item.original.short_name}`)
					},
					// Hide if no results
					noMatchTemplate: () => t('No emoji found'),
					// Display raw emoji along with its name
					selectTemplate: (item) => {
						if (textSmiles.includes(item.original)) {
							// Replace the selection with the raw text string for :), :-D, … for non emoji results
							return item.original
						}

						emojiAddRecent(item.original)
						return item.original.native
					},
					// Pass the search results as values
					values: (text, cb) => {
						const emojiResults = emojiSearch(text)
						if (textSmiles.includes(':' + text)) {
							/**
							 * Prepend text smiles to the search results so that Tribute
							 * is not interfering with normal writing, aka. "Cocos Island Meme".
							 * E.g. `:)` and `:-)` got replaced by the flag of Cocos Island,
							 * when submitting the input with Enter after writing them
							 */
							emojiResults.unshift(':' + text)
						}
						cb(emojiResults)
					},
					// Class added to the menu container
					containerClass: `${this.$style['tribute-container']} ${this.$style['tribute-container-emoji']}`,
					// Class added to each list item
					itemClass: this.$style['tribute-container__item'],
				})
			}

			if (this.linkAutocomplete) {
				tributesCollection.push({
					trigger: '/',
					// Don't use the tribute search function at all
					// We pass search results as values (see below)
					lookup: (result, query) => query,
					requireLeadingSpace: true,
					// Popup mention autocompletion templates
					menuItemTemplate: item => renderMenuItem(`<img class="${this.$style['tribute-item__icon']}" src="${item.original.icon_url}"> <span class="${this.$style['tribute-item__title']}">${item.original.title}</span>`),
					// Hide if no results
					noMatchTemplate: () => t('No link provider found'),
					selectTemplate: this.getLink,
					// Pass the search results as values
					values: (text, cb) => cb(searchProvider(text)),
					// Class added to the menu container
					containerClass: `${this.$style['tribute-container']} ${this.$style['tribute-container-link']}`,
					// Class added to each list item
					itemClass: this.$style['tribute-container__item'],
				})
			}

			this.tribute = new Tribute({
				collection: tributesCollection,
				// FIXME: tributejs doesn't support allowSpaces as a collection option, only as a global one
				// Requires to fork a library to allow spaces only in the middle of mentions ('@' trigger)
				allowSpaces: false,
				// Where to inject the menu popup
				menuContainer: this.menuContainer,
			})
			this.tribute.attach(this.$refs.contenteditable)
		},

		getLink(item) {
			// there is no way to get a tribute result asynchronously
			// so we immediately insert a node and replace it when the result comes
			getLinkWithPicker(item.original.id)
				.then(result => {
					// replace dummy temp element by a text node which contains the picker result
					const tmpElem = document.getElementById('tmp-smart-picker-result-node')
					const eventData = {
						result,
						insertText: true,
					}
					this.$emit('smart-picker-submit', eventData)
					if (eventData.insertText) {
						const newElem = document.createTextNode(result)
						tmpElem.replaceWith(newElem)
						this.setCursorAfter(newElem)
						this.updateValue(this.$refs.contenteditable.innerHTML)
					} else {
						tmpElem.remove()
					}
				})
				.catch((error) => {
					console.debug('Smart picker promise rejected:', error)
					const tmpElem = document.getElementById('tmp-smart-picker-result-node')
					this.setCursorAfter(tmpElem)
					tmpElem.remove()
				})
			return '<span id="tmp-smart-picker-result-node"></span>'
		},
		setCursorAfter(element) {
			const range = document.createRange()
			range.setEndAfter(element)
			range.collapse()
			const selection = window.getSelection()
			selection.removeAllRanges()
			selection.addRange(range)
		},
		moveCursorToEnd() {
			if (!document.createRange) {
				return
			}
			const range = document.createRange()
			range.selectNodeContents(this.$refs.contenteditable)
			range.collapse(false)
			const selection = window.getSelection()
			selection.removeAllRanges()
			selection.addRange(range)
		},
		/**
		 * Re-emit the input event to the parent
		 *
		 * @param {Event} event the input event
		 */
		onInput(event) {
			this.updateValue(event.target.innerHTML)
		},

		/**
		 * When pasting, sanitize the content, extract text
		 * and render it again
		 *
		 * @param {Event} event the paste event
		 * @fires Event paste the original paste event
		 */
		onPaste(event) {
			// Either disabled or edit deactivated
			if (!this.canEdit) {
				return
			}

			event.preventDefault()
			const clipboardData = event.clipboardData

			/** The original paste event */
			this.$emit('paste', event)

			// If we have a file or if we don't have any text, ignore
			if (clipboardData.files.length !== 0
				|| !Object.values(clipboardData.items).find(item => item?.type.startsWith('text'))) {
				return
			}

			const text = clipboardData.getData('text')
			const selection = window.getSelection()

			// Generate text and insert
			const range = selection.getRangeAt(0)
			range.deleteContents()
			range.insertNode(document.createTextNode(text))

			// Collapse the range to the end position
			range.collapse(false)

			// Propagate data
			this.updateValue(this.$refs.contenteditable.innerHTML)
		},

		/**
		 * Update the value text from the provided html
		 *
		 * @param {string} htmlOrText the html content (or raw text with @mentions)
		 */
		updateValue(htmlOrText) {
			// Browsers keep <br> after erasing contenteditable
			const text = this.parseContent(htmlOrText).replace(/^\n$/, '')
			this.localValue = text
			this.model = text
		},

		/**
		 * Update content and local value
		 *
		 * @param {string} value the message value
		 */
		updateContent(value) {
			const renderedContent = this.renderContent(value)
			this.$refs.contenteditable.innerHTML = renderedContent
			this.localValue = value
		},

		/**
		 * Enter key pressed. Submits if not multiline
		 *
		 * @param {Event} event the keydown event
		 */
		onEnter(event) {
			// Prevent submitting if multiline
			// or length is over maxlength
			// or autocompletion menu is opened
			// or in a text composition session with IME
			if (this.multiline
				|| this.isOverMaxlength
				|| this.tribute.isActive
				|| this.isComposing) {
				return
			}

			event.preventDefault()
			event.stopPropagation()
			this.$emit('submit', event)
		},

		/**
		 * Ctrl + Enter key pressed is used to submit
		 *
		 * @param {Event} event the keydown event
		 */
		onCtrlEnter(event) {
			if (this.isOverMaxlength) {
				return
			}
			this.$emit('submit', event)
		},

		onKeyUp(event) {
			// prevent tribute from opening on keyup
			event.stopImmediatePropagation()
		},

		onKeyEsc(event) {
			// prevent event from bubbling when tribute is open
			if (this.tribute && this.isAutocompleteOpen) {
				event.stopImmediatePropagation()
				this.tribute.hideMenu()
			}
		},

		/**
		 * Get HTML element with Tribute.js container
		 * @return {HTMLElement}
		 */
		getTributeContainer() {
			return this.tribute.menu
		},

		/**
		 * Get the currently selected item element id in Tribute.js container
		 * @return {HTMLElement}
		 */
		getTributeSelectedItem() {
			// Tribute does not provide a way to get the active item, only the data index
			// So we have to find it manually by select class
			return this.getTributeContainer().querySelector('.highlight [id^="nc-rich-contenteditable-tribute-item-"]')
		},

		/**
		 * Handle Tribute activation
		 * @param {boolean} isActive - is active
		 */
		onTributeActive(isActive) {
			this.isAutocompleteOpen = isActive

			if (isActive) {
				// Tribute.js doesn't support containerClass update when new collection is open
				// The first opened collection's containerClass stays forever
				// https://github.com/zurb/tribute/issues/595
				// https://github.com/zurb/tribute/issues/627
				// So we have to manually update the class
				// The default class is "tribute-container"
				this.getTributeContainer().setAttribute('class', this.tribute.current.collection.containerClass || this.$style['tribute-container'])

				this.setupTributeIntegration()
				// Remove the event handler if any
				document.removeEventListener('click', this.hideTribute, true)
			} else {
				// Cancel loading data for autocomplete
				// Otherwise it could be received when another autocomplete is already opened
				this.debouncedAutoComplete.clear()

				// Reset active item
				this.autocompleteActiveId = undefined

				this.setTributeFocusVisible(false)
			}
		},

		onTributeArrowKeyDown() {
			if (!this.isAutocompleteOpen) {
				return
			}
			this.setTributeFocusVisible(true)
			this.onTributeSelectedItemWillChange()
		},

		onTributeSelectedItemWillChange() {
			// Wait until tribute has updated the selected item
			requestAnimationFrame(() => {
				this.autocompleteActiveId = this.getTributeSelectedItem()?.id
			})
		},

		setupTributeIntegration() {
			// Setup integration only once on the first open
			if (this.isTributeIntegrationDone) {
				return
			}
			this.isTributeIntegrationDone = true

			const tributeContainer = this.getTributeContainer()

			// For aria-controls
			tributeContainer.id = this.tributeId

			// Container with options must be a listbox
			tributeContainer.setAttribute('role', 'listbox')
			// Reset list+listitem role from ul+li
			const ul = tributeContainer.children[0]
			ul.setAttribute('role', 'presentation')

			// Tribute.js does not provide a way to react on show/hide
			// tribute-active-true/false events are fired on initial activation, which is too early with async autoComplete function
			this.tributeStyleMutationObserver = new MutationObserver(([{ target }]) => {
				if (target.style.display !== 'none') {
					// Tribute is visible - there will be selected item
					this.onTributeSelectedItemWillChange()
				}
			}).observe(tributeContainer, {
				attributes: true,
				attributeFilter: ['style'],
			})

			// Handle selecting new item on mouse selection
			tributeContainer.addEventListener('mousemove', () => {
				this.setTributeFocusVisible(false)
				this.onTributeSelectedItemWillChange()
			}, { passive: true })
		},

		/**
		 * Set tribute-container--focus-visible class on the Tribute container when the user navigates the listbox via keyboard.
		 *
		 * Because the real focus is kept on the textbox, we cannot use the :focus-visible pseudo-class
		 * to style selected options in the autocomplete listbox.
		 *
		 * @param {boolean} withFocusVisible - should the focus-visible class be added
		 */
		setTributeFocusVisible(withFocusVisible) {
			if (withFocusVisible) {
				this.getTributeContainer().classList.add(this.$style['tribute-container--focus-visible'])
			} else {
				this.getTributeContainer().classList.remove(this.$style['tribute-container--focus-visible'])
			}
		},

		/**
		 * Show tribute menu programmatically.
		 * @param {string} trigger - trigger character, can be '/', '@', or ':'
		 *
		 * @public
		 */
		showTribute(trigger) {
			this.focus()
			const index = this.tribute.collection.findIndex(collection => collection.trigger === trigger)
			this.tribute.showMenuForCollection(this.$refs.contenteditable, index)
			this.updateValue(this.$refs.contenteditable.innerHTML)
			document.addEventListener('click', this.hideTribute, true)
		},

		/**
		 * Hide tribute menu programmatically
		 *
		 */
		hideTribute() {
			this.tribute.hideMenu()
			document.removeEventListener('click', this.hideTribute, true)
		},
	},
}
</script>

<style lang="scss" scoped>
// Standalone styling, independent from server
.rich-contenteditable {
	--contenteditable-block-offset: calc(2 * var(--default-grid-baseline));
	--contenteditable-inline-start-offset: calc(2 * var(--default-grid-baseline));
	--contenteditable-inline-end-offset: calc(2 * var(--default-grid-baseline));
	position: relative;
	width: auto;

	&__label {
		position: absolute;
		margin-inline: 14px;
		max-width: fit-content;
		inset-block-start: 11px;
		inset-inline: 0;
		// Fix color so that users do not think the input already has content
		color: var(--color-text-maxcontrast);
		// only one line labels are allowed
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		// forward events to input
		pointer-events: none;
		// Position transition
		transition: height var(--animation-quick), inset-block-start var(--animation-quick), font-size var(--animation-quick), color var(--animation-quick), background-color var(--animation-quick) var(--animation-slow);
	}

	&__input:focus + &__label,
	&__input:not(&__input--empty) + &__label {
		inset-block-start: -10px;
		line-height: 1.5; // minimum allowed line height for accessibility
		font-size: 13px; // minimum allowed font size for accessibility
		font-weight: 500;
		border-radius: var(--default-grid-baseline) var(--default-grid-baseline) 0 0;
		background-color: var(--color-main-background);
		padding-inline: 5px;
		margin-inline: 9px;

		transition: height var(--animation-quick), inset-block-start var(--animation-quick), font-size var(--animation-quick), color var(--animation-quick);
	}

	&__input {
		overflow-y: auto;
		width: auto;
		margin: 0;
		padding-block: var(--contenteditable-block-offset);
		padding-inline: var(--contenteditable-inline-start-offset) var(--contenteditable-inline-end-offset);
		cursor: text;
		white-space: pre-wrap;
		word-break: break-word;
		color: var(--color-main-text);
		border: 2px solid var(--color-border-maxcontrast);
		border-radius: var(--border-radius-large);
		outline: none;
		background-color: var(--color-main-background);
		font-family: var(--font-face);
		font-size: inherit;
		min-height: var(--default-clickable-area);
		max-height: calc(var(--default-clickable-area) * 5.5);

		&--has-label {
			margin-top: 10px;
		}

		// Cannot use :empty because of firefox bug https://bugzilla.mozilla.org/show_bug.cgi?id=1513303
		&--empty:focus:before,
		&--empty:not(&--has-label):before {
			content: attr(aria-placeholder);
			color: var(--color-text-maxcontrast);
			position: absolute;
			width: calc(100% - var(--contenteditable-inline-start-offset) - var(--contenteditable-inline-end-offset));
			height: calc(100% - 2 * var(--contenteditable-block-offset));
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}

		&[contenteditable='false']:not(&--disabled) {
			cursor: default;
			background-color: transparent;
			color: var(--color-main-text);
			border-color: transparent;
			opacity: 1;
			border-radius: 0;
		}

		&--multiline {
			min-height: calc(var(--default-clickable-area) * 3);
			// No max for mutiline
			max-height: none;
		}

		&--disabled {
			opacity: $opacity_disabled;
			color: var(--color-text-maxcontrast);
			border: 2px solid var(--color-background-darker);
			border-radius: var(--border-radius);
			background-color: var(--color-background-dark);
		}
	}
}

</style>

<style lang="scss" module>
.tribute-container {
	z-index: 9000;
	overflow: auto;
	// Hide container root element while initializing
	position: absolute;
	left: -10000px;
	// Space it out a bit from the text
	margin: var(--default-grid-baseline) 0;
	padding: var(--default-grid-baseline);
	color: var(--color-text-maxcontrast);
	border-radius: var(--border-radius-element, var(--border-radius));
	background: var(--color-main-background);
	box-shadow: 0 1px 5px var(--color-box-shadow);

	&,
	& * {
		box-sizing: border-box;
	}

	ul {
		display: flex;
		flex-direction: column;
		gap: var(--default-grid-baseline);
	}

	.tribute-container__item {
		color: var(--color-text-maxcontrast);
		border-radius: var(--border-radius-small, var(--border-radius));
		padding: var(--default-grid-baseline);
		cursor: pointer;
		min-height: var(--clickable-area-small, auto);

		&:global(.highlight) {
			color: var(--color-main-text);
			background: var(--color-background-hover);

			&, * {
				cursor: pointer;
			}
		}
	}

	&.tribute-container--focus-visible {
		:global(.highlight).tribute-container__item {
			outline: 2px solid var(--color-main-text) !important;
		}
	}
}

.tribute-container-autocomplete {
	min-width: 250px;
	max-width: 300px;
	// Show maximum 4 entries and a half to show scroll
	// Autocomplete height
	// + 2 paddings inside autocomplete
	// + 1 padding gap
	// And 1.5 paddings - container's padding without the last gap
	max-height: calc((var(--default-clickable-area) + 3 * var(--default-grid-baseline)) * 4.5 - 1.5 * var(--default-grid-baseline));
}

.tribute-container-emoji,
.tribute-container-link {
	min-width: 200px;
	max-width: 200px;
	// Show maximum 5 entries and a half to show scroll
	// Item height
	// + 2 paddings around tribute item
	// + 1 padding gap
	// And 1.5 paddings - container's padding without the last gap
	max-height: calc((24px + 3 * var(--default-grid-baseline)) * 5.5 - 1.5 * var(--default-grid-baseline));

	.tribute-item {
		// Take care of long names
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
}

.tribute-container-link {
	min-width: 200px;
	max-width: 300px;
	.tribute-item {
		display: flex;
		align-items: center;
		&__title {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		&__icon {
			margin: auto 0;
			width: 20px;
			height: 20px;
			object-fit: contain;
			padding-right: var(--default-grid-baseline);
			filter: var(--background-invert-if-dark);
		}
	}
}

</style>
