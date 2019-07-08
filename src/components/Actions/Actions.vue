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

<!-- Accessibility guidelines:
https://www.w3.org/TR/wai-aria-practices/examples/menu-button/menu-button-actions.html -->

<docs>
### Single action

```
<actions>
	<action-button icon="icon-delete" title="Delete" @click="alert('Delete')" />
</actions>
```

### Multiple actions

```
<actions>
	<action-button icon="icon-edit" title="Edit" @click="alert('Edit')" />
	<action-button icon="icon-delete" title="Delete" @click="alert('Delete')" />
	<action-link icon="icon-external" title="Link" href="https://nextcloud.com" />
</actions>
```
</docs>
<template>
	<!-- if only one action, check if we need to bind to click or not -->
	<element v-if="isValidSingleAction"
		v-tooltip.auto="firstAction.text"
		v-bind="firstActionElement"
		:class="firstAction.icon" class="action-item action-item--single"
		rel="noreferrer noopener"
		@[firstActionEvent]="execFirstAction">
		<!-- fake slot to gather main action -->
		<span :aria-hidden="true" hidden>
			<!-- @slot All action elements passed into the default slot will be used -->
			<slot />
		</span>
	</element>

	<!-- more than one action -->
	<div v-else v-show="actions.length > 0"
		:class="{'action-item--open': opened}"
		class="action-item"
		@keydown.up.exact.prevent="focusPreviousAction"
		@keydown.down.exact.prevent="focusNextAction"
		@keydown.shift.tab.prevent="focusPreviousAction"
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
		<div ref="menu"
			:class="[`menu-${menuAlign}`, { 'open': opened }]"
			:style="{marginRight: `${ offsetX }px`}"
			class="action-item__menu"
			tabindex="-1"
			@mousemove="unFocus">
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
import ValidateChildren from 'Utils/ValidateChildren'

// This is the list of ALL the ALLOWED components
// in the default SLOT
const allowedChildren = [
	'ActionButton',
	'ActionCheckbox',
	'ActionInput',
	'ActionLink',
	'ActionRouter',
	'ActionText'
]

/**
 * The Actions component can be used to display one ore more actions.
 * If only a single action is provided, it will be rendered as an inline icon.
 * For more, a menu indicator will be shown and a popovermenu containing the
 * actions will be opened on click.
 *
 * @since 0.10.0
 */
export default {
	name: 'Actions',

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
			actions: [],
			opened: this.open,
			focusIndex: 0,
			randomId: 'menu-' + GenRandomId(),
			offsetX: 0
		}
	},
	computed: {
		isValidSingleAction() {
			return this.actions.length === 1
		},
		firstAction() {
			return this.actions[0]
		},
		firstActionElement() {
			switch (this.firstAction.$options.name) {
			case 'ActionLink':
				return {
					is: 'a',
					href: this.firstAction.href,
					target: this.firstAction.target
				}

			case 'ActionRouter':
				return {
					is: 'router-link',
					to: this.firstAction.to,
					exact: this.firstAction.exact
				}

			default:
				return {
					is: 'button'
				}
			}
		},

		// return the event to bind if the firstAction have an action
		firstActionEvent() {
			return this.firstAction
				&& this.firstAction.$listeners
				&& this.firstAction.$listeners.click
				? 'click'
				: null
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
	beforeMount() {
		// init actions
		this.initActions()

		// filter invalid menu items
		ValidateChildren(this, allowedChildren)
	},
	mounted() {
		// prevent click outside event with popupItem.
		this.popupItem = this.$el
	},
	beforeUpdate() {
		// update children & actions
		// no need to init actions again since we bound it to $children
		// and the array is now reactive
		ValidateChildren(this, allowedChildren)
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
			}
			/**
			 * Event emitted when the popover menu open state is changed
			 * @type {bool}
			 */
			this.$emit('update:open', this.opened)
		},
		closeMenu() {
			this.offsetX = 0
			this.opened = false
			/**
			 * Event emitted when the popover menu open state is changed
			 * @type {bool}
			 */
			this.$emit('update:open', this.opened)
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

		// MENU KEYS & FOCUS MANAGEMENT
		// remove the focus on any element if the mouse
		// is used to select an action
		unFocus() {
			this.$refs.menu.focus()
			this.removeCurrentActive()
		},
		removeCurrentActive() {
			const currentActiveElement = this.$refs.menu.querySelector('li.active')
			if (currentActiveElement) {
				currentActiveElement.classList.remove('active')
			}
		},
		focusAction() {
			// TODO: have a global disabled state for non input elements
			const focusElement = this.$refs.menu.querySelectorAll('.focusable:not(:disabled)')[this.focusIndex]
			if (focusElement) {
				const liMenuParent = focusElement.closest('li')
				focusElement.focus()
				if (liMenuParent) {
					this.removeCurrentActive()
					liMenuParent.classList.add('active')
				}
			}
		},
		focusPreviousAction() {
			this.focusIndex = Math.max(this.focusIndex - 1, 0)
			this.focusAction()
		},
		focusNextAction() {
			this.focusIndex = Math.min(this.focusIndex + 1, this.$el.querySelectorAll('.focusable:not(:disabled)').length - 1)
			this.focusAction()
		},
		focusFirstAction() {
			this.focusIndex = 0
			this.focusAction()
		},
		focusLastAction() {
			this.focusIndex = this.$el.querySelectorAll('.focusable:not(:disabled)').length - 1
			this.focusAction()
		},

		// ACTIONS MANAGEMENT
		// exec the first action and prevent default
		execFirstAction(event) {
			if (this.firstAction.$listeners && this.firstAction.$listeners.click) {
				this.firstAction.$listeners.click(event)
				event.preventDefault()
			}
		},
		initActions() {
			// filter out invalid slots
			this.actions = this.$children || []
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
	&:hover,
	&:focus,
	&:active,
	&__menutoggle:focus,
	&__menutoggle:active,
	&.action-item--open {
		border-radius: $clickable-area / 2;
		// good looking on dark AND white bg
		background-color: $icon-focus-bg !important; // override default server
		&,
		.action-item__menutoggle {
			opacity: $opacity_full;
			border-radius: $clickable-area / 2;
			background-color: $action-background-hover;
		}
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

		margin: 0;
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
