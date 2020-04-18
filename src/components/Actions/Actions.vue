<!--
  - @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
  -
  - @author John Molakvoæ <skjnldsv@protonmail.com>
  - @author Marco Ambrosini <marcoambrosini@pm.me
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
<Actions>
	<ActionButton icon="icon-delete" @click="alert('Delete')">Delete</ActionButton>
</Actions>
```

### Multiple actions

```
<Actions>
	<ActionButton icon="icon-edit" @click="alert('Edit')">Edit</ActionButton>
	<ActionButton icon="icon-delete" @click="alert('Delete')">Delete</ActionButton>
	<ActionLink icon="icon-external" title="Link" href="https://nextcloud.com" />
</Actions>
```

### Multiple actions with custom icon

```
<Actions default-icon="icon-edit">
	<ActionButton icon="icon-edit" @click="alert('Edit')">Edit</ActionButton>
	<ActionButton icon="icon-delete" @click="alert('Delete')">Delete</ActionButton>
	<ActionLink icon="icon-external" title="Link" href="https://nextcloud.com" />
</Actions>
```

</docs>
<template>
	<!-- if only one action, check if we need to bind to click or not -->
	<element v-if="isValidSingleAction && !forceMenu"
		v-tooltip.auto="firstAction.text"
		v-bind="firstActionBinding"
		:class="[firstAction.icon, firstActionClass]"
		class="action-item action-item--single"
		rel="noreferrer noopener"
		@[firstActionEventBinding]="execFirstAction">
		<!-- fake slot to gather main action -->
		<span :aria-hidden="true" hidden>
			<!-- @slot All action elements passed into the default slot will be used -->
			<slot />
		</span>
	</element>

	<!-- more than one action -->
	<div v-else
		v-show="hasMultipleActions || forceMenu"
		v-click-outside="closeMenu"
		:class="{'action-item--open': opened}"
		class="action-item"
		@keydown.up.exact.prevent="focusPreviousAction"
		@keydown.down.exact.prevent="focusNextAction"
		@keydown.shift.tab.prevent="focusPreviousAction"
		@keydown.page-up.exact.prevent="focusFirstAction"
		@keydown.page-down.exact.prevent="focusLastAction"
		@keydown.esc.exact.prevent="closeMenu">
		<!-- If more than one action, create a popovermenu -->
		<a class="icon action-item__menutoggle"
			:class="defaultIcon"
			href="#"
			:aria-label="ariaLabel"
			aria-haspopup="true"
			:aria-controls="randomId"
			:aria-expanded="opened"
			@click.prevent.stop="toggleMenu"
			@keydown.space.exact.prevent.stop="toggleMenu" />
		<div v-show="opened"
			ref="menu"
			:class="[`menu-${menuAlign}`, { 'open': opened }]"
			:style="{marginRight: `${ offsetX }px`, marginTop: `${ offsetY }px`}"
			class="action-item__menu"
			tabindex="-1"
			@mousemove="onMouseFocusAction">
			<!-- arrow -->
			<div class="action-item__menu_arrow"
				:style="{ transform: `translateX(${ offsetX }px) translateY(${ offsetYArrow }px) ${ rotateArrow ? ' rotate(180deg)' : ''}` }" />

			<!-- menu content -->
			<ul :id="randomId" tabindex="-1">
				<template v-if="opened">
					<slot />
				</template>
			</ul>
		</div>
	</div>
</template>
<script>
import { directive as ClickOutside } from 'v-click-outside'
import Tooltip from '../../directives/Tooltip'
import GenRandomId from '../../utils/GenRandomId'
import IsOutOfViewport from '../../utils/IsOutOfViewport'
import ValidateSlot from '../../utils/ValidateSlot'
import { t } from '../../l10n'

// This is the list of ALL the ALLOWED components
// in the default SLOT
const allowedChildren = [
	'ActionButton',
	'ActionCheckbox',
	'ActionInput',
	'ActionLink',
	'ActionRadio',
	'ActionRouter',
	'ActionSeparator',
	'ActionText',
	'ActionTextEditable',
]

const focusableSelector = '.focusable'

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
		tooltip: Tooltip,
	},

	props: {
		/**
		 * Specify the open state of the popover menu
		 */
		open: {
			type: Boolean,
			default: false,
		},

		/**
		 * Force the actions to display in a three dot menu
		 */
		forceMenu: {
			type: Boolean,
			default: false,
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
			},
		},
		/**
		 * Icon to show for the toggle menu button
		 * when more than one action is inside the actions component.
		 * Only replace the default three-dot icon if really necessary.
		 */
		defaultIcon: {
			type: String,
			default: 'action-item__menutoggle--default-icon',
		},
		/**
		 * Aria label for the actions menu
		 */
		ariaLabel: {
			type: String,
			default: t('Actions'),
		},
	},

	data() {
		return {
			actions: [],
			opened: this.open,
			focusIndex: 0,
			randomId: 'menu-' + GenRandomId(),
			offsetX: 0,
			offsetY: 0,
			offsetYArrow: 0,
			rotateArrow: false,
			// Making children reactive!
			// By binding this here, vuejs will track the object content
			// Needed for firstAction reactivity !!!
			children: this.$children,
		}
	},

	computed: {
		/**
		 * Is there more than one action?
		 * @returns {boolean}
		 */
		hasMultipleActions() {
			return this.actions.length > 1
		},
		/**
		 * Is there any first action ?
		 * And is it allowed as a standalone element ?
		 * @returns {boolean}
		 */
		isValidSingleAction() {
			return this.actions.length === 1
				&& this.firstActionElement !== null
		},
		/**
		 * First action vnode
		 * @returns {Object} return the first action vue vnode
		 */
		firstActionVNode() {
			return this.actions[0]
		},
		/**
		 * Reactive binding to the first children
		 * Since we're here, it means we already passed all the proper checks
		 * we can assume the first action is the first children too
		 * @returns {Object} first action vue children object
		 */
		firstAction() {
			return this.children[0]
				? this.children[0]
				: {}
		},

		/**
		 * Binding of the first action to the template
		 * @returns {Object} vue template v-bind shortcut
		 */
		firstActionBinding() {
			if (this.firstActionVNode && this.firstActionVNode.componentOptions) {
				const tag = this.firstActionVNode.componentOptions.tag
				if (tag === 'ActionLink') {
					return {
						is: 'a',
						href: this.firstAction.href,
						target: this.firstAction.target,
						'aria-label': this.firstAction.ariaLabel,
					}
				}
				if (tag === 'ActionRouter') {
					return {
						is: 'router-link',
						to: this.firstAction.to,
						exact: this.firstAction.exact,
						'aria-label': this.firstAction.ariaLabel,
					}
				}
				if (tag === 'ActionButton') {
					return {
						is: 'button',
						'aria-label': this.firstAction.ariaLabel,
					}
				}
			}
			// other action types are not allowed as standalone buttons
			return null
		},

		// return the event to bind if the firstActionVNode have an action
		firstActionEvent() {
			return this.firstActionVNode
				&& this.firstActionVNode.componentOptions
				&& this.firstActionVNode.componentOptions.listeners
				&& this.firstActionVNode.componentOptions.listeners.click
		},
		firstActionEventBinding() {
			return this.firstActionEvent ? 'click' : null
		},
		firstActionClass() {
			const staticClass = this.firstActionVNode && this.firstActionVNode.data.staticClass
			const dynClass = this.firstActionVNode && this.firstActionVNode.data.class
			return `${staticClass} ${dynClass}`
		},
	},

	watch: {
		open(newVal) {
			this.opened = newVal
			if (this.opened) {
				this.$nextTick(() => {
					this.onOpen()
				})
			}
		},
	},
	beforeMount() {
		// init actions
		this.initActions()

		// filter invalid menu items
		ValidateSlot(this.$slots.default, allowedChildren, this)
	},
	beforeUpdate() {
		// ! since we're using $slots to manage our actions
		// ! we NEED to update the actions if anything change

		// update children & actions
		// no need to init actions again since we bound it to $children
		// and the array is now reactive
		// init actions
		this.initActions()
		ValidateSlot(this.$slots.default, allowedChildren, this)
	},

	methods: {
		// MENU STATE MANAGEMENT
		toggleMenu(state) {
			if (typeof state === 'boolean') {
				this.opened = state
			} else {
				this.opened = !this.opened
			}

			// focus first on menu open after opening the menu
			if (this.opened) {
				this.$nextTick(() => {
					this.onOpen()
					this.focusFirstAction()
				})

				/**
				 * Event emitted when the popover menu is opened
				 */
				this.$emit('open')
			} else {
				this.offsetX = 0
				this.offsetY = 0
				this.offsetYArrow = 0
				this.rotateArrow = false

				/**
				 * Event emitted when the popover menu is closed
				 */
				this.$emit('close')
			}

			/**
			 * Event emitted when the popover menu open state is changed
			 * @type {boolean}
			 */
			this.$emit('update:open', this.opened)
		},
		closeMenu(e) {
			/**
			 * only emit events if it was opened
			 * or else any click on the page will trigger
			 * the click outside directive!
			 */
			if (this.opened) {
				/**
				 * Event emitted when the popover menu open state is changed
				 * @type {boolean}
				 */
				this.$emit('update:open', false)

				/**
				 * Event emitted when the popover menu is closed
				 */
				this.$emit('close')

				// close everything
				this.opened = false
				this.offsetX = 0
				this.offsetY = 0
				this.offsetYArrow = 0
				this.rotateArrow = false
			}
		},

		/**
		 * Run when the user open the menu
		 * if align=center, we automatically
		 * shift the popup if it's out of bound
		 */
		onOpen() {
			this.offsetX = 0
			this.offsetY = 0
			this.offsetYArrow = 0
			this.rotateArrow = false
			if (this.menuAlign === 'center') {
				const isOut = IsOutOfViewport(this.$refs.menu)
				if (isOut.left || isOut.right) {
					this.offsetX = isOut.offsetX > 0
						? Math.round(isOut.offsetX) + 5
						: Math.round(isOut.offsetX) - 5
				}
				if (isOut.bottom) {
					this.offsetY = 0 - Math.round(this.$refs.menu.clientHeight) - 42
					this.offsetYArrow = Math.round(this.$refs.menu.clientHeight) + 18
					this.rotateArrow = true
				}
			}
		},

		// MENU KEYS & FOCUS MANAGEMENT
		// focus nearest focusable item on mouse move
		// DO NOT change the focus if the target is already focused
		// this will prevent issues with input being unfocused
		// on mouse move
		onMouseFocusAction(event) {
			if (document.activeElement === event.target) {
				return
			}

			const menuItem = event.target.closest('li')
			if (menuItem) {
				const focusableItem = menuItem.querySelector(focusableSelector)
				if (focusableItem) {
					const focusList = this.$refs.menu.querySelectorAll(focusableSelector)
					const focusIndex = Array.prototype.indexOf.call(focusList, focusableItem)
					if (focusIndex > -1) {
						this.focusIndex = focusIndex
						this.focusAction()
					}
				}
			}
		},
		removeCurrentActive() {
			const currentActiveElement = this.$refs.menu.querySelector('li.active')
			if (currentActiveElement) {
				currentActiveElement.classList.remove('active')
			}
		},
		focusAction() {
			// TODO: have a global disabled state for non input elements
			const focusElement = this.$refs.menu.querySelectorAll(focusableSelector)[this.focusIndex]
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
			this.focusIndex = Math.min(this.focusIndex + 1, this.$refs.menu.querySelectorAll(focusableSelector).length - 1)
			this.focusAction()
		},
		focusFirstAction() {
			this.focusIndex = 0
			this.focusAction()
		},
		focusLastAction() {
			this.focusIndex = this.$el.querySelectorAll(focusableSelector).length - 1
			this.focusAction()
		},

		// ACTIONS MANAGEMENT
		// exec the first action
		execFirstAction(event) {
			if (this.firstActionEvent) {
				this.firstActionEvent(event)
			}
		},
		initActions() {
			// filter out invalid slots
			this.actions = (this.$slots.default || []).filter(node => !!node && !!node.componentOptions)
		},
	},
}
</script>

<style lang="scss" scoped>
@import '../../fonts/scss/iconfont-vue';

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

		&:before {
			content: '';
		}

		&--default-icon {
			font-size: $icon-size;
			@include iconfont('more');
		}
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
		margin-bottom: 10px;
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
