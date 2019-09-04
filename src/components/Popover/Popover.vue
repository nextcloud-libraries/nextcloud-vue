<!--
  - @copyright Copyright (c) 2019 Marco Ambrosini <marcoambrosini@pm.me>
  -
  - @author Marco Ambrosini <marcoambrosini@pm.me>
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
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
-->

<template>

	<!-- more than one action -->
	<div :class="{'action-item--open': opened}"
		class="action-item"
		@keydown.esc.exact.prevent="closeMenu">
		<!-- If more than one action, create a popovermenu -->
		<a v-click-outside="closeMenu"
			class="icon action-item__menutoggle"
			href="#" aria-haspopup="true"
			:aria-controls="randomId"
			:aria-expanded="opened"
			@click.prevent="toggleMenu"
			@keydown.space.exact.prevent="toggleMenu" />
		<div v-if="opened"
			ref="menu"
			:class="[`menu-${menuAlign}`, { 'open': opened }]"
			:style="{marginRight: `${ offsetX }px`}"
			class="action-item__menu"
			tabindex="-1"
			@mousemove="onMouseFocusAction">
			<!-- arrow -->
			<div class="action-item__menu_arrow"
				:style="{ transform: `translateX(${ offsetX }px)`}" />

			<!-- menu content -->
			<ul :id="randomId" tabindex="-1">
				<slot />
			</ul>
		</div>
	</div>
</template>

<script>
import ClickOutside from 'vue-click-outside'
import Tooltip from 'Directives/Tooltip'
import GenRandomId from 'Utils/GenRandomId'
import IsOutOfViewport from 'Utils/IsOutOfViewport'

export default {
	name: 'Popover',
	directives: {
		ClickOutside,
		tooltip: Tooltip
	},

	props: {
		/**
		 * Specify the open state of the popover menu
		 */
		open: {
			type: Boolean,
			default: false
		},
		/**
		 * Specify the position of the popovermenu
		 * `left`, `center` or `right`
		 */
		menuAlign: {
			type: String,
			default: 'center',
			validator: align => {
				return ['left', 'center', 'right'].indexOf(align) > -1
			}
		}
	},

	data() {
		return {
			opened: this.open,
			randomId: 'menu-' + GenRandomId(),
			offsetX: 0
		}
	},

	watch: {
		open(newVal) {
			this.opened = newVal
			if (this.opened) {
				this.$nextTick(() => {
					this.onOpen()
				})
			}
		}
	},
	mounted() {
		// prevent click outside event with popupItem.
		this.popupItem = this.$el
	},

	methods: {
		// MENU STATE MANAGEMENT
		toggleMenu() {
			this.opened = !this.opened
			// focus first on menu open after opening the menu
			if (this.opened) {
				this.$nextTick(() => {
					this.onOpen()
					this.focusFirstAction()
				})
				/**
				 * Event emitted when the popover menu is opened
				 * @type {null}
				 */
				this.$emit('open')
			}

			/**
			 * Event emitted when the popover menu open state is changed
			 * @type {bool}
			 */
			this.$emit('update:open', this.opened)
		},
		closeMenu() {
			/**
			 * only emit events if it was opened
			 * or else any click on the page will trigger
			 * the click outside directive!
			 */
			if (this.opened) {
				/**
				 * Event emitted when the popover menu open state is changed
				 * @type {bool}
				 */
				this.$emit('update:open', false)
				/**
				 * Event emitted when the popover menu is closed
				 * @type {null}
				 */
				this.$emit('close')

			}

			// close everything
			this.opened = false
			this.offsetX = 0
		},
		onOpen() {
			this.offsetX = 0
			const isOut = IsOutOfViewport(this.$refs.menu)
			if (isOut.any) {
				this.offsetX = isOut.offsetX > 0
					? Math.round(isOut.offsetX) + 5
					: Math.round(isOut.offsetX) - 5
			}
		},
		removeCurrentActive() {
			const currentActiveElement = this.$refs.menu.querySelector('li.active')
			if (currentActiveElement) {
				currentActiveElement.classList.remove('active')
			}
		},

		/**
		 * Get a vNode prop
		 * @param {Object} vnode the vnode
		 * @param {string} prop the prop
		 * @returns {any} the prop data if any
		 */
		getVNodeProp(vnode, prop) {
			return vnode.componentOptions.propsData[prop]
		}
	}
}
</script>

<style lang="scss" scoped>
@import '~Fonts/scss/iconfont-vue';

// arrow distance to the border
$arrow-margin: ($clickable-area - 2 * $arrow-width)  / 2;

.action-item {
	position: relative;
	display: inline-block;

	// put a grey round background when menu is opened
	// or hover-focused
	&--single:hover,
	&--single:focus,
	&--single:active,
	&__menutoggle:hover,
	&__menutoggle:focus,
	&__menutoggle:active{
		border-radius: $clickable-area / 2;
		// good looking on dark AND white bg
		background-color: $icon-focus-bg !important; // override default server
		opacity: $opacity_full;
	}

	&.action-item--open .action-item__menutoggle {
		opacity: $opacity_full;
		border-radius: $clickable-area / 2;
		background-color: $action-background-hover;
	}

	// icons
	&--single,
	&__menutoggle {
		box-sizing: border-box;
		width: $clickable-area;
		height: $clickable-area;
		margin: 0;
		padding: $icon-margin;

		cursor: pointer;

		border: none;
		background-color: transparent;
	}

	// icon-more
	&__menutoggle {
		// align menu icon in center
		display: flex;
		align-items: center;
		justify-content: center;

		opacity: $opacity_normal;

		font-size: $icon-size;

		@include iconfont('more');
	}

	&--single {
		opacity: $opacity_normal;
		&:hover,
		&:focus,
		&:active {
			opacity: $opacity_full;
		}
		// hide anything the slot is displaying
		& > [hidden] {
			display: none;
		}
	}

	// properly position the menu
	&--multiple {
		position: relative;
	}

	&__menu {
		position: absolute;
		z-index: 110;
		right: 50%;

		display: none;

		// make sure to not have the menu right
		// on the edge of the window
		margin: 10px;
		margin-top: -5px;

		transform: translateX(50%);

		color: var(--color-main-text);
		border-radius: var(--border-radius);
		background-color: var(--color-main-background);

		filter: drop-shadow(0 1px 3px var(--color-box-shadow));

		// only allow li elements in the popovermenu
		ul > :not(li) {
			display: none;
		}

		&.open {
			display: block;
		}

		/* Arrow */
		.action-item__menu_arrow {
			position: absolute;
			right: 50%;
			bottom: 100%;

			width: 0;
			height: 0;
			margin-right: - $arrow-width;

			content: ' ';
			pointer-events: none;

			/* change this to adjust the arrow position */
			border: solid transparent;
			border-width: $arrow-width;
			border-bottom-color: var(--color-main-background);
		}

		/* Align the popover to the right */
		&.menu-right {
			right: 0;
			left: auto;
			transform: none;
			.action-item__menu_arrow {
				// align to menu icon padding
				right: $arrow-margin;
				margin-right: 0;
			}
		}

		/* Align the popover to the left */
		&.menu-left {
			right: auto;
			left: 0;
			transform: none;
			.action-item__menu_arrow {
				right: auto;
				// align to menu icon padding
				left: $arrow-margin;
				margin-right: 0;
			}
		}
	}
}

.ie,
.edge {
	.action-item__menu,
	.action-item__menu .action-item__menu_arrow {
		border: 1px solid var(--color-border);
	}
}
</style>
