
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
import actionGlobal from './actionGlobal.js'
import GetParent from '../utils/GetParent.js'

export default {
	mixins: [actionGlobal],
	props: {
		/**
		 * Icon to show with the action, can be either a CSS class or an URL
		 */
		icon: {
			type: String,
			default: '',
		},
		/**
		 * Title to show next to the icon
		 */
		title: {
			type: String,
			default: '',
		},
		/**
		 * Whether we close the Actions menu after the click
		 */
		closeAfterClick: {
			type: Boolean,
			default: false,
		},
		/**
		 * Aria label for the button. Not needed if the button has text.
		 */
		ariaLabel: {
			type: String,
			default: '',
		},
	},

	emits: [
		'click',
	],

	computed: {
		isIconUrl() {
			try {
				return new URL(this.icon)
			} catch (error) {
				return false
			}
		},
	},

	methods: {
		onClick(event) {
			/**
			 * Emitted when the action is clicked
			 *
			 * @type {Event}
			 */
			this.$emit('click', event)

			if (this.closeAfterClick) {
				const parent = GetParent(this, 'NcActions')
				if (parent && parent.closeMenu) {
					parent.closeMenu(false)
				}
			}
		},
	},
}
