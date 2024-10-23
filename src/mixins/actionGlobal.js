/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

// An empty comment below is needed to prevent styleguidist from using SPDX header as a mixin=component description in docs
/** */
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
