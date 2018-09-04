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
		:class="{ 'icon-loading': loading, 'unknown': unknown }"
		:style="{width: size + 'px', height: size + 'px'}"
		class="avatardiv popovermenu-wrapper" @click="toggleMenu">
		<img v-if="!loading && !unknown" :src="avatarUrlLoaded">
		<div v-if="unknown" class="unknown">?</div>
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
		url: {
			type: String,
			default: undefined
		},
		user: {
			type: String,
			default: undefined
		},
		displayName: {
			type: String,
			default: undefined
		},
		size: {
			type: Number,
			default: 32
		}
	},
	data() {
		return {
			actions: [],
			avatarUrlLoaded: null,
			unknown: false,
			loading: true,
			openedMenu: false
		}
	},
	computed: {
		menu() {
			return this.actions.map((item) => {
				return {
					href: item.hyperlink,
					icon: item.icon,
					text: item.title
				}
			})
		}
	},
	mounted() {
		let avatarUrl = OC.generateUrl(
			'/avatar/{user}/{size}',
			{
				user: this.user,
				size: Math.ceil(this.size * window.devicePixelRatio)
			})
		if (this.user === OC.getCurrentUser().uid) {
			avatarUrl += '?v=' + oc_userconfig.avatar.version
		}
		if (typeof this.url !== 'undefined') {
			avatarUrl = this.url
		}

		let img = new Image()
		img.onload = () => {
			this.avatarUrlLoaded = avatarUrl
			this.loading = false
		}
		img.onerror = () => {
			this.unknown = true
			this.loading = false
		}
		img.src = avatarUrl
	},
	methods: {
		toggleMenu() {
			if (this.user === OC.getCurrentUser().uid || this.unknown || this.url) {
				return
			}
			this.openedMenu = !this.openedMenu
			if (this.openedMenu) {
				this.fetchContactsMenu()
			}
		},
		closeMenu() {
			this.openedMenu = false
		},
		fetchContactsMenu() {
			axios.post(OC.generateUrl('contactsmenu/findOne'), 'shareType=0&shareWith=' + this.user).then((response) => {
				this.actions = [response.data.topAction].concat(response.data.actions)
			}).catch(() => {
				this.openedMenu = false
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
		font-size: 14pt;
		display: block;
		top: 18%;
		left: 0;
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
	}
</style>
