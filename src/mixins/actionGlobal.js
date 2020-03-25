
/**
 * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
import Vue from 'vue'

export default {
	before() {
		// all actions requires a valid text content
		// if none, forbid the component mount and throw error
		if (!this.$slots.default || this.text.trim() === '') {
			Vue.util.warn(`${this.$options.name} cannot be empty and requires a meaningful text content`, this)
			this.$destroy()
			this.$el.remove()
		}
	},

	beforeUpdate() {
		this.text = this.getText()
	},

	data() {
		return {
			// $slots are not reactive.
			// We need to update  the content manually
			text: this.getText(),
		}
	},

	computed: {
		isLongText() {
			return this.text && this.text.trim().length > 20
		},
	},

	methods: {
		getText() {
			return this.$slots.default ? this.$slots.default[0].text.trim() : ''
		},
	},
}
