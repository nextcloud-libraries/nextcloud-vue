/**
 * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
export default {
	beforeCreate() {
		// Cached text content from the default slot during the rendering
		// It is non-reactive (not data) property to avoid changing component's state during the rendering
		this.cachedText = null
	},

	beforeUpdate() {
		// Reset the cached text before new rendering
		this.cachedText = null
	},

	methods: {
		/**
		 * Get text content from the default slot.
		 * This function must be used ONLY during the rendering - in the render function or in the template.
		 * Its value is memoized during the rendering.
		 *
		 * @return {string}
		 */
		getText() {
			if (this.cachedText === null) {
				this.cachedText = this.$scopedSlots.default ? this.$scopedSlots.default()?.[0]?.text.trim() : ''
			}
			return this.cachedText
		},

		/**
		 * Is the text from the default slot considered long?
		 * This function must be used ONLY during the rendering - in the render function or in the template.
		 *
		 * @return {boolean} true if the text is considered long
		 */
		isLongText() {
			const text = this.getText()
			return text && text.trim().length > 20
		},
	},
}
