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

<docs>

### Basic user avatar

```vue
	<avatar user="janedoe" display-name="Jane Doe" />
```

### Avatar with image

```vue
	<avatar url="https://nextcloud.com/wp-content/themes/next/assets/img/common/nextcloud-square-logo.png" />
```

</docs>
<template>
	<div v-tooltip="tooltip" v-click-outside="closeMenu"
		:class="{
			'icon-loading': !isAvatarLoaded && size > 16,
			'icon-loading-small': !isAvatarLoaded && size <= 16,
			'avatardiv--unknown': userDoesNotExist,
			'avatardiv--with-menu': hasMenu
		}"
		:style="avatarStyle"
		class="avatardiv popovermenu-wrapper" @click="toggleMenu">
		<!-- avatar -->
		<div v-if="iconClass" :class="iconClass" class="avatar-class-icon" />
		<img v-else-if="isAvatarLoaded && !userDoesNotExist" :src="avatarUrlLoaded" :srcset="avatarSrcSetLoaded">
		<div v-if="hasMenu" class="icon-more" />

		<!-- avatar status -->
		<div v-if="status" class="avatardiv__status" :class="'avatardiv__status--' + status"
			:style="{ backgroundColor: `#${statusColor}` }">
			<!-- triangle -->
			<svg v-if="status === 'neutral'" xmlns="http://www.w3.org/2000/svg"
				width="12" height="11"
				viewBox="0 0 3.175 2.91">
				<path d="M3.21 3.043H.494l.679-1.177.68-1.176.678 1.176z"
					:style="{ fill: `#${statusColor}` }" stroke="#fff"
					stroke-width=".265" stroke-linecap="square" />
			</svg>
		</div>
		<div v-if="userDoesNotExist" class="unknown">
			{{ initials }}
		</div>
		<div v-if="hasMenu" v-show="contactsMenuOpenState"
			class="popovermenu"
			:class="`menu-${menuPosition}`">
			<PopoverMenu :is-open="contactsMenuOpenState" :menu="menu" />
		</div>
	</div>
</template>

<script>

/* global OC oc_userconfig */
import { directive as ClickOutside } from 'v-click-outside'
import { PopoverMenu } from 'Components/PopoverMenu'
import axios from '@nextcloud/axios'
import Tooltip from 'Directives/Tooltip'
import uidToColor from './uidToColor'

export default {
	name: 'Avatar',
	directives: {
		tooltip: Tooltip,
		ClickOutside
	},
	components: {
		PopoverMenu
	},
	props: {
		/**
		 * Set a custom url to the avatar image
		 * either the url, user or displayName property must be defined
		 */
		url: {
			type: String,
			default: undefined
		},
		/**
		 * Set a css icon-class for an icon to be used instead of the avatar.
		 */
		iconClass: {
			type: String,
			default: undefined
		},
		/**
		 * Set the user id to fetch the avatar
		 * either the url, user or displayName property must be defined
		 */
		user: {
			type: String,
			default: undefined
		},
		/**
		 * Is the user a guest user (then we have to user a different endpoint)
		 */
		isGuest: {
			type: Boolean,
			default: false
		},
		/**
		 * Set a display name that will be rendered as a tooltip
		 * either the url, user or displayName property must be defined
		 * specify just the displayname to generate a placeholder avatar without
		 * trying to fetch the avatar based on the user id
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
		},
		/**
		 * Disable the tooltip
		 */
		disableTooltip: {
			type: Boolean,
			default: false
		},
		/**
		 * Disable the menu
		 */
		disableMenu: {
			type: Boolean,
			default: false
		},
		/**
		 * Declares a custom tooltip when not null
		 * Fallback will be the displayName
		 *
		 * requires disableTooltip not to be set to true
		 */
		tooltipMessage: {
			type: String,
			default: null
		},
		/**
		 * Declares username is not a user's name, when true.
		 * Prevents loading user's avatar from server and forces generating colored initials,
		 * i.e. if the user is a group
		 */
		isNoUser: {
			type: Boolean,
			default: false
		},

		/**
		 * Declares a status indicator on the avatar
		 * Available options are `positive`, `negative`, `neutral`
		 */
		status: {
			type: String,
			default: null,
			validator: (value) => {
				switch (value) {
				case 'positive':
				case 'negative':
				case 'neutral':
					return true
				}
				return false
			}
		},
		/**
		 * Declares a different color to be used with the status indicator
		 */
		statusColor: {
			type: [Number, String],
			default: null,
			validator: value => {
				return /^([a-f0-9]{3}){1,2}$/i.test(value)
			}
		},
		/**
		 * Choose the avatar menu alignment.
		 * Possible values are `left`, `center`, `right`.
		 */
		menuPosition: {
			type: String,
			default: 'center'
		}
	},
	data() {
		return {
			avatarUrlLoaded: null,
			avatarSrcSetLoaded: null,
			userDoesNotExist: false,
			isAvatarLoaded: false,
			isMenuLoaded: false,
			contactsMenuActions: [],
			contactsMenuOpenState: false
		}
	},
	computed: {
		getUserIdentifier() {
			if (this.isDisplayNameDefined) {
				return this.displayName
			}
			if (this.isUserDefined) {
				return this.user
			}
			return ''
		},
		isUserDefined() {
			return typeof this.user !== 'undefined'
		},
		isDisplayNameDefined() {
			return typeof this.displayName !== 'undefined'
		},
		isUrlDefined() {
			return typeof this.url !== 'undefined'
		},
		hasMenu() {
			if (this.disableMenu) {
				return false
			}
			if (this.isMenuLoaded) {
				return this.menu.length > 0
			}
			return !(this.user === OC.getCurrentUser().uid || this.userDoesNotExist || this.url)
		},
		shouldShowPlaceholder() {
			return this.allowPlaceholder && (
				this.userDoesNotExist)
		},
		avatarStyle() {
			let style = {
				width: this.size + 'px',
				height: this.size + 'px',
				lineHeight: this.size + 'px',
				fontSize: Math.round(this.size * 0.55) + 'px'
			}

			if (!this.iconClass && !this.avatarSrcSetLoaded) {
				const rgb = uidToColor(this.getUserIdentifier)
				style.backgroundColor = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')'
			}
			return style
		},
		tooltip() {
			if (this.disableTooltip) {
				return false
			}
			if (this.tooltipMessage) {
				return this.tooltipMessage
			}

			return this.displayName
		},
		initials() {
			if (this.shouldShowPlaceholder) {
				return this.getUserIdentifier.charAt(0).toUpperCase()
			}
			return '?'
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
	watch: {
		url() {
			this.userDoesNotExist = false
			this.loadAvatarUrl()
		},
		user() {
			this.userDoesNotExist = false
			this.isMenuLoaded = false
			this.loadAvatarUrl()
		}
	},
	mounted() {
		this.loadAvatarUrl()
	},
	methods: {
		async toggleMenu() {
			if (!this.hasMenu) {
				return
			}
			if (!this.contactsMenuOpenState) {
				await this.fetchContactsMenu()
			}
			this.contactsMenuOpenState = !this.contactsMenuOpenState
		},
		closeMenu() {
			this.contactsMenuOpenState = false
		},
		async fetchContactsMenu() {
			try {
				const user = encodeURIComponent(this.user)
				const { data } = await axios.post(OC.generateUrl('contactsmenu/findOne'), `shareType=0&shareWith=${user}`)
				this.contactsMenuActions = data.topAction ? [data.topAction].concat(data.actions) : data.actions
			} catch (e) {
				this.contactsMenuOpenState = false
			}
			this.isMenuLoaded = true
		},
		loadAvatarUrl() {
			this.isAvatarLoaded = false

			/** Only run avatar image loading if either user or url property is defined */
			if (!this.isUrlDefined && (!this.isUserDefined || this.isNoUser)) {
				this.isAvatarLoaded = true
				this.userDoesNotExist = true
				return
			}

			const urlGenerator = (user, size) => {
				let url = '/avatar/{user}/{size}'
				if (this.isGuest) {
					url = '/avatar/guest/{user}/{size}'
				}

				let avatarUrl = OC.generateUrl(
					url,
					{
						user: user,
						size: size
					})

				// eslint-disable-next-line camelcase
				if (user === OC.getCurrentUser().uid && typeof oc_userconfig !== 'undefined') {
					avatarUrl += '?v=' + oc_userconfig.avatar.version
				}

				return avatarUrl
			}

			let avatarUrl = urlGenerator(this.user, this.size)
			if (this.isUrlDefined) {
				avatarUrl = this.url
			}

			const srcset = [
				avatarUrl + ' 1x',
				urlGenerator(this.user, this.size * 2) + ' 2x',
				urlGenerator(this.user, this.size * 4) + ' 4x'
			].join(', ')

			let img = new Image()
			img.onload = () => {
				this.avatarUrlLoaded = avatarUrl
				if (!this.isUrlDefined) {
					this.avatarSrcSetLoaded = srcset
				}
				this.isAvatarLoaded = true
			}
			img.onerror = () => {
				this.userDoesNotExist = true
				this.isAvatarLoaded = true
			}

			if (!this.isUrlDefined) {
				img.srcset = srcset
			}
			img.src = avatarUrl
		}
	}
}
</script>

<style scoped lang="scss">
@import '~Fonts/scss/iconfont-vue';

.avatardiv {
	position: relative;
	display: inline-block;

	&--unknown {
		position: relative;
		background-color: var(--color-text-maxcontrast);
	}

	&--with-menu {
		cursor: pointer;
		.icon-more {
			position: absolute;
			top: 0;
			left: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: inherit;
			height: inherit;
			cursor: pointer;
			opacity: 0;
			background: none;
			font-size: 18px;

			@include iconfont('more');
			&::before {
				display: block;
			}
		}
		&:focus,
		&:hover {
			.icon-more {
				opacity: 1;
			}
			img {
				opacity: 0;
			}
		}
		.icon-more,
		img {
			transition: opacity var(--animation-quick);
		}
	}

	> .unknown {
		position: absolute;
		top: 0;
		left: 0;
		display: block;
		width: 100%;
		text-align: center;
		color: var(--color-main-background);
	}

	img {
		width: 100%;
		height: 100%;
	}

	.avatardiv__status {
		position: absolute;
		top: 22px;
		left: 22px;
		width: 10px;
		height: 10px;
		border: 1px solid rgba(255, 255, 255, .5);
		background-clip: content-box;
		&--positive {
			border-radius: 50%;
			background-color: var(--color-success);
		}
		&--negative {
			background-color: var(--color-error);
		}
		&--neutral {
			border: none;
			background-color: transparent !important;
			svg {
				position: absolute;
				top: -3px;
				left: -2px;
				path {
					fill: #aaa;
				}
			}
		}
	}

	.popovermenu-wrapper {
		position: relative;
		display: inline-block;
	}

	.popovermenu {
		display: block;
		margin: 0;
		font-size: 14px;
	}
}

.avatar-class-icon {
	border-radius: 50%;
	background-color: var(--color-background-darker);
}

</style>
