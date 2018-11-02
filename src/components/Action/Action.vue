<!--
  - @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
  -
  - @author John Molakvoæ <skjnldsv@protonmail.com>
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
	<!-- if only one action, check if we need to bind to click or not -->
	<action :href="isSingleAction && firstAction.href ? firstAction.href : '#'"
		:class="[isSingleAction ? `${firstAction.icon} action-item--single` : 'action-item--multiple']"
		v-bind="mainActionElement()" class="action-item"
		v-on="isSingleAction && firstAction.action ? { click: firstAction.action } : {}">

		<!-- If more than one action, create a popovermenu -->
		<template v-if="!isSingleAction">
			<div v-click-outside="closeMenu" tabindex="1" class="action-item__menutoggle icon-more"
				@click="toggleMenu" />
			<div :class="{ 'open': opened }" class="action-item__menu popovermenu">
				<popover-menu :menu="actions" />
			</div>
		</template>

	</action>
</template>

<script>
import ClickOutside from 'vue-click-outside'
import { PopoverMenu } from 'Components/PopoverMenu'

export default {
	name: 'Action',
	components: {
		PopoverMenu
	},
	directives: {
		ClickOutside
	},
	props: {
		actions: {
			type: Array,
			required: true,
			default: () => {
				return [
					{
						href: 'https://nextcloud.com',
						icon: 'icon-links',
						text: 'Nextcloud'
					},
					{
						action: () => {
							alert('Deleted !')
						},
						icon: 'icon-delete',
						text: 'Delete'
					}
				]
			}
		}
	},
	data() {
		return {
			opened: false
		}
	},
	computed: {
		isSingleAction() {
			return this.actions.length === 1
		},
		firstAction() {
			return this.actions[0]
		}
	},
	mounted() {
		// prevent click outside event with popupItem.
		this.popupItem = this.$el
	},
	methods: {
		toggleMenu() {
			this.opened = !this.opened
		},
		closeMenu() {
			this.opened = false
		},
		mainActionElement() {
			return {
				is: this.isSingleAction ? 'a' : 'div'
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.action-item {
	display: inline-block;

	// icons
	&--single,
	&__menutoggle {
		padding: 14px;
		height: 44px;
		width: 44px;
		cursor: pointer;
	}
	// icon-more
	&__menutoggle {
		display: inline-block;
	}
	// properly position the menu
	&--multiple {
		position: relative;
	}
}
</style>
