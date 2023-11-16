/**
 * @copyright Copyright (c) 2020 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import NcMentionBubble from '../../components/NcRichContenteditable/NcMentionBubble.vue'
import Linkify from '../../utils/Linkify.js'

import escapeHtml from 'escape-html'
import stripTags from 'striptags'
import { createApp } from 'vue'

// Beginning or whitespace. Non-capturing group
const MENTION_START = '(?:^|\\s)'
// Anything that is not text or end-of-line. Non-capturing group
const MENTION_END = '(?:[^a-z]|$)'
export const USERID_REGEX = new RegExp(`${MENTION_START}(@[a-zA-Z0-9_.@\\-']+)(${MENTION_END})`, 'gi')
export const USERID_REGEX_WITH_SPACE = new RegExp(`${MENTION_START}(@&quot;[a-zA-Z0-9 _.@\\-']+&quot;)(${MENTION_END})`, 'gi')

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
					// on the the uneven indexes. We only want to generate the mentions html
					if (!part.startsWith('@')) {
						// This part doesn't contain a mention, let's make sure links are parsed
						return Linkify(part)
					}

					// Extracting the id, nuking the leading @ and all "
					const id = part.slice(1).replace(/&quot;/gi, '')
					// Compiling template and prepend with the space we removed during the split
					return ' ' + this.genSelectTemplate(id)
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
			let text = content.replace(/<br>/gmi, '\n')
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
				// return `@${value}`
				return !value.includes(' ') && !value.includes('/')
					? `@${value}`
					: `@"${value}"`
			}

			// Return template and make sure we strip of new lines and tabs
			return this.renderComponentHtml(data, NcMentionBubble).replace(/[\n\t]/gmi, '')
		},

		/**
		 * Render a component and return its html content
		 *
		 * @param {object} props the props to pass to the component
		 * @param {object} component the component to render
		 * @return {string} the rendered html
		 */
		renderComponentHtml(props, component) {
			const Item = createApp(component, {
				...props,
			})

			// Prepare mountpoint
			const wrapper = document.createElement('div')
			const mount = document.createElement('div')
			wrapper.style.display = 'none'
			wrapper.appendChild(mount)
			document.body.appendChild(wrapper)

			// Mount and get raw html
			Item.mount(mount)
			const renderedHtml = wrapper.innerHTML

			// Destroy
			Item.unmount()
			wrapper.remove()

			return renderedHtml
		},
	},
}
