<!--
  - @copyright Copyright (c) 2018 Julius Härtl <jus@bitgrid.net>
  -
  - @author Julius Härtl <jus@bitgrid.net>
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
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
  -
  -->

<template>
	<div v-tooltip="displayName" v-click-outside="closeMenu"
		:class="{ 'icon-loading': loading, 'unknown': userDoesNotExist }"
		:style="avatarStyle"
		class="avatardiv popovermenu-wrapper" @click="toggleMenu">
		<img v-if="!loading && !userDoesNotExist" :src="avatarUrlLoaded">
		<div v-if="userDoesNotExist" class="unknown">{{ initials }}</div>
		<div v-show="openedMenu" class="popovermenu">
			<popover-menu :is-open="openedMenu" :menu="menu" />
		</div>
	</div>
</template>

<script>

/* global OC oc_userconfig */

import { VTooltip } from 'v-tooltip'
import { PopoverMenu } from '../PopoverMenu'
import ClickOutside from 'vue-click-outside'
import axios from 'nextcloud-axios'
import uidToColor from './uidToColor'

export default {
	name: 'Avatar',
	directives: {
		tooltip: VTooltip,
		ClickOutside: ClickOutside
	},
	components: {
		PopoverMenu
	},
	props: {
		/**
		 * Set a custom url to the avatar image
		 * either the url or user property must be defined
		 */
		url: {
			type: String,
			default: undefined
		},
		/**
		 * Set the user id to fetch the avatar
		 * either the url or user property must be defined
		 */
		user: {
			type: String,
			default: undefined
		},
		/**
		 * Set a display name that will be rendered as a tooltip
		 */
		displayName: {
			type: String,
			default: undefined
		},
		/**
		 * Set a size in px for the rendered avatar
		 */
		size: {
			type: Number,
			default: 32
		},
		/**
		 * Placeholder avatars will be automatically generated when this is set to true
		 */
		allowPlaceholder: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			avatarUrlLoaded: null,
			userDoesNotExist: false,
			loadingState: true,
			contactsMenuActions: [],
			contactsMenuOpenState: false
		}
	},
	computed: {
		isUserDefined() {
			return typeof this.user !== 'undefined'
		},
		isUrlDefined() {
			return typeof this.url !== 'undefined'
		},
		isValid() {
			return this.isUrlDefined || this.isUserDefined
		},
		avatarStyle() {
			let style = {
				width: this.size + 'px',
				height: this.size + 'px',
				lineHeight: this.size + 'px',
				fontSize: Math.round(this.size * 0.55) + 'px'
			}

			if (this.loadingState || !this.userDoesNotExist || !this.isUserDefined || !this.allowPlaceholder) {
				return style
			}

			const rgb = uidToColor(this.user)
			style.backgroundColor = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')'
			return style
		},
		initials() {
			if (!this.isUserDefined || !this.allowPlaceholder) {
				return '?'
			}
			return this.user.charAt(0).toUpperCase()
		},
		menu() {
			return this.contactsMenuActions.map((item) => {
				return {
					href: item.hyperlink,
					icon: item.icon,
					text: item.title
				}
			})
		}
	},
	mounted() {
		if (!this.isValid) {
			this.loadingState = false
			this.userDoesNotExist = true
			return
		}
		let avatarUrl = OC.generateUrl(
			'/avatar/{user}/{size}',
			{
				user: this.user,
				size: Math.ceil(this.size * window.devicePixelRatio)
			})
		// eslint-disable-next-line camelcase
		if (this.user === OC.getCurrentUser().uid && typeof oc_userconfig !== 'undefined') {
			avatarUrl += '?v=' + oc_userconfig.avatar.version
		}
		if (this.isUrlDefined) {
			avatarUrl = this.url
		}

		let img = new Image()
		img.onload = () => {
			this.avatarUrlLoaded = avatarUrl
			this.loadingState = false
		}
		img.onerror = () => {
			this.userDoesNotExist = true
			this.loadingState = false
		}
		img.src = avatarUrl
	},
	methods: {
		toggleMenu() {
			if (this.user === OC.getCurrentUser().uid || this.userDoesNotExist || this.url) {
				return
			}
			this.contactsMenuOpenState = !this.contactsMenuOpenState
			if (this.contactsMenuOpenState) {
				this.fetchContactsMenu()
			}
		},
		closeMenu() {
			this.contactsMenuOpenState = false
		},
		fetchContactsMenu() {
			axios.post(OC.generateUrl('contactsmenu/findOne'), 'shareType=0&shareWith=' + encodeURIComponent(this.user)).then((response) => {
				this.contactsMenuActions = [response.data.topAction].concat(response.data.actions)
			}).catch(() => {
				this.contactsMenuOpenState = false
			})
		}
	}
}
</script>

<style scoped>
	.avatardiv {
		display: inline-block;
	}

	.avatardiv.unknown {
		background-color: var(--color-text-maxcontrast);
		position: relative;
	}

	.avatardiv > .unknown {
		position: absolute;
		color: var(--color-main-background);
		width: 100%;
		text-align: center;
		display: block;
		left: 0;
		top: 0;
	}

	.avatardiv img {
		width: 100%;
		height: 100%;
	}

	.popovermenu-wrapper {
		position: relative;
		display: inline-block;
	}

	.popovermenu {
		display: block;
		margin: 0;
		font-size: initial;
	}
</style>
