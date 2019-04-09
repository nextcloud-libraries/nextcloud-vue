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
	<a v-if="isSingleAction" href="#" :class="firstAction.icon"
		class="action-item action-item--single" @click="firstAction.action ? firstAction.action : null" />
	<!-- more than one action -->
	<div v-else
		:class="{'action-item--open': opened}"
		class="action-item"
		@keydown.up.exact.prevent="focusPreviousAction"
		@keydown.down.exact.prevent="focusNextAction"
		@keydown.shift.tab.prevent="focusPreviousAction"
		@keydown.tab.exact.prevent="focusNextAction"
		@keydown.page-up.exact.prevent="focusFirstAction"
		@keydown.page-down.exact.prevent="focusLastAction"
		@keydown.esc.exact.prevent="closeMenu">
		<!-- If more than one action, create a popovermenu -->
		<a v-click-outside="closeMenu"
			class="icon action-item__menutoggle"
			href="#" aria-haspopup="true"
			:aria-controls="randomId"
			:aria-expanded="opened"
			@click.prevent="toggleMenu"
			@keydown.space.exact.prevent="toggleMenu" />
		<div :class="{ 'open': opened }" class="action-item__menu popovermenu" tabindex="-1">
			<popover-menu :id="randomId" :menu="actions" tabindex="-1" />
		</div>
	</div>
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
		},
		open: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			opened: this.open,
			focusIndex: 0,
			randomId: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
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
	watch: {
		open(newVal) {
			this.opened = newVal
		}
	},
	mounted() {
		// prevent click outside event with popupItem.
		this.popupItem = this.$el
	},
	methods: {
		toggleMenu() {
			this.opened = !this.opened
			// focus first on menu open after opening the menu
			if (this.opened) {
				this.$nextTick(function() {
					this.focusFirstAction()
				})
			}
			this.$emit('update:open', this.opened)
		},
		closeMenu() {
			this.opened = false
			this.$emit('update:open', this.opened)
		},
		focusAction() {
			// eslint-disable-next-line
			console.info(this.$el.querySelectorAll('.focusable')[this.focusIndex])
			this.$el.querySelectorAll('.focusable')[this.focusIndex].focus()
		},
		focusPreviousAction() {
			this.focusIndex = Math.max(this.focusIndex - 1, 0)
			this.focusAction()
		},
		focusNextAction() {
			this.focusIndex = Math.min(this.focusIndex + 1, this.$el.querySelectorAll('.focusable').length - 1)
			this.focusAction()
		},
		focusFirstAction() {
			this.focusIndex = 0
			this.focusAction()
		},
		focusLastAction() {
			this.focusIndex = this.$el.querySelectorAll('.focusable').length - 1
			this.focusAction()
		}
	}
}
</script>

<style lang="scss" scoped>
@import '~Fonts/scss/iconfont-vue';

.action-item {
	display: inline-block;
	&:hover,
	&:focus,
	&__menutoggle:focus,
	&__menutoggle:active {
		&,
		.action-item__menutoggle {
			opacity: 1;
		}
	}

	// icons
	&--single,
	&__menutoggle {
		box-sizing: border-box;
		padding: 14px;
		height: 44px;
		width: 44px;
		cursor: pointer;
	}
	// icon-more
	&__menutoggle {
		display: inline-block;
		opacity: .7;
		@include iconfont('more');
	}
	&--single {
		opacity: .7;
		&:hover,
		&:focus,
		a:active {
			opacity: 1;
		}
	}
	// properly position the menu
	&--multiple {
		position: relative;
	}
}
</style>
