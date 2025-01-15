/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import NcMentionBubble from '../../components/NcRichContenteditable/NcMentionBubble.vue'

import escapeHtml from 'escape-html'
import stripTags from 'striptags'
import Vue from 'vue'

// Referenced from public function getMentions(): https://github.com/nextcloud/server/blob/master/lib/private/Comments/Comment.php
// Beginning or whitespace. Uses positive lookahead (to work on MobileSafari <16.4)
const MENTION_START = /(?=[a-z0-9_\-@.'])\B/.source
// Capturing groups like: @user-id, @"guest/abc16def", @"federated_user/user-id", @"user-id with space"
const MENTION_SIMPLE = /(@[a-z0-9_\-@.']+)/.source
const MENTION_GUEST = /@&quot;(?:guest|email){1}\/[a-f0-9]+&quot;/.source
const MENTION_PREFIXED = /@&quot;(?:federated_)?(?:group|team|user){1}\/[a-z0-9_\-@.' /:]+&quot;/.source
const MENTION_WITH_SPACE = /@&quot;[a-z0-9_\-@.' ]+&quot;/.source
const MENTION_COMPLEX = `(${MENTION_GUEST}|${MENTION_PREFIXED}|${MENTION_WITH_SPACE})`
// Concatenated regular expressions
export const USERID_REGEX = new RegExp(`${MENTION_START}${MENTION_SIMPLE}`, 'gi')
export const USERID_REGEX_WITH_SPACE = new RegExp(`${MENTION_START}${MENTION_COMPLEX}`, 'gi')

export default {
	props: {
		userData: {
			type: Object,
			default: () => ({}),
		},
	},
	methods: {
		/**
		 * Convert the value string to html for the inner content
		 *
		 * @param {string} value the content without html
		 * @return {string} rendered html
		 */
		renderContent(value) {
			// Sanitize the value prop
			const sanitizedValue = escapeHtml(value)

			// Extract all the userIds
			const splitValue = sanitizedValue.split(USERID_REGEX)
				.map(part => part.split(USERID_REGEX_WITH_SPACE)).flat()

			// Replace userIds by html
			return splitValue
				.map(part => {
					// When splitting, the string is always putting the userIds
					// on the uneven indexes. We only want to generate the mentions html
					if (!part.startsWith('@')) {
						return part
					}

					// Extracting the id, nuking the leading @ and all "
					const id = part.slice(1).replace(/&quot;/gi, '')
					// Compiling template and prepend with the space we removed during the split
					return this.genSelectTemplate(id)
				})
				.join('')
				.replace(/\n/gmi, '<br>')
				.replace(/&amp;/gmi, '&')
		},

		/**
		 * Convert the innerHtml content to a string with mentions as text
		 *
		 * @param {string} content the content without html
		 * @return {string}
		 */
		parseContent(content) {
			let text = content
			// Replace break lines with new lines
			text = text.replace(/<br>/gmi, '\n')
			// Replace some html special characters
			text = text.replace(/&nbsp;/gmi, ' ')
			text = text.replace(/&amp;/gmi, '&')

			// Convert the mentions to text only
			// first we replace divs with new lines
			text = text.replace(/<\/div>/gmi, '\n')
			// then we remove all leftover html
			text = stripTags(text, '<div>')
			text = stripTags(text)

			return text
		},

		/**
		 * Generate an autocompletion popup entry template
		 *
		 * @param {string} value the value to match against the userData
		 * @return {string}
		 */
		genSelectTemplate(value) {
			// The value returned by this function will replace the trigger '@'
			// and the search text, so when there is no match we simply return
			// '@' and the text.
			if (typeof value === 'undefined') {
				return `${this.autocompleteTribute.current.collection.trigger}${this.autocompleteTribute.current.mentionText}`
			}

			const data = this.userData[value]

			// Fallback to @mention in case no data matches
			if (!data) {
				// return @value if matches MENTION_SIMPLE, @"value" otherwise
				return [' ', '/', ':'].every(char => !value.includes(char))
					? `@${value}`
					: `@"${value}"`
			}

			// Return template and make sure we strip off new lines, tabs and consecutive whitespaces
			return this.renderComponentHtml(data, NcMentionBubble)
				.replace(/[\n\t]/gmi, '')
				.replace(/>\s+</g, '><')
		},

		/**
		 * Render a component and return its html content
		 *
		 * @param {object} propsData the props to pass to the component
		 * @param {object} component the component to render
		 * @return {string} the rendered html
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
