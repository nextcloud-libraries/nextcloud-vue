/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { warn } from 'vue'
import { NC_ACTIONS_CLOSE_MENU } from '../components/NcActions/useNcActions.ts'
import actionGlobal from './actionGlobal.js'

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
		 * The main text content of the entry.
		 */
		name: {
			type: String,
			default: '',
		},
		/**
		 * The title attribute of the element.
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
			default: null,
		},
	},

	inject: {
		closeMenu: {
			from: NC_ACTIONS_CLOSE_MENU,
		},
	},

	emits: [
		'click',
	],

	created() {
		if ('ariaHidden' in this.$attrs) {
			warn('[NcAction*]: Do not set the ariaHidden attribute as the root element will inherit the incorrect aria-hidden.')
		}
	},

	computed: {
		/**
		 * Check if icon prop is an URL
		 *
		 * @return {boolean} Whether the icon prop is an URL
		 */
		isIconUrl() {
			try {
				return !!(new URL(this.icon, this.icon.startsWith('/') ? window.location.origin : undefined))
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
				this.closeMenu(false)
			}
		},
	},
}
