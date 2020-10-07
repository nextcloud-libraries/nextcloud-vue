/**
 * @copyright Copyright (c) 2020 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license GNU AGPL version 3 or any later version
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

import Vue from 'vue'
import stripTags from 'striptags'
import escapeHtml from 'escape-html'

import MentionBubble from '../../components/RichContenteditable/MentionBubble.vue'

const MENTION_START = '[\\n\\t ]'
// Anything that is not text
const MENTION_END = '[^a-z]'
export const USERID_REGEX = new RegExp(`${MENTION_START}(@[a-zA-Z0-9_.@\\-']+)(${MENTION_END})`, 'g')
export const USERID_REGEX_WITH_SPACE = new RegExp(`${MENTION_START}(@"[a-zA-Z0-9 _.@\\-']+")(${MENTION_END})`, 'g')

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
		 * Convert the innerHtml content to a string with mentions as text
		 *
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
		 *
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
			// Prepends with the space we removed during the split
			return ' ' + this.renderComponentHtml(data, MentionBubble).replace(/[\n\t]/g, '')
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
