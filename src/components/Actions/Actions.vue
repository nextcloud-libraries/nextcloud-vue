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

### With menu title

```
<Actions default-icon="icon-edit" menu-title="Object management">
	<ActionButton icon="icon-edit">Rename</ActionButton>
	<ActionButton icon="icon-delete">Delete</ActionButton>
	<ActionButton icon="icon-confirm">Validate</ActionButton>
	<ActionButton icon="icon-download">Download</ActionButton>
</Actions>
```

### Various icons styles
```
<Actions :primary="true">
	<ActionButton icon="icon-edit">Edit</ActionButton>
	<ActionButton icon="icon-delete">Delete</ActionButton>
</Actions>
```

```
<Actions default-icon="icon-add-white" :primary="true" menu-title="Object management">
	<ActionButton icon="icon-edit">Rename</ActionButton>
	<ActionButton icon="icon-delete">Delete</ActionButton>
	<ActionButton icon="icon-confirm">Validate</ActionButton>
	<ActionButton icon="icon-download">Download</ActionButton>
</Actions>
```

### Custom icon slot
```
<Actions :primary="true">
	<ActionButton><template #icon><MagnifyIcon /></template>Search</ActionButton>
	<ActionButton icon="icon-delete">Delete</ActionButton>
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
		:class="{'action-item--open': opened}"
		class="action-item">
		<!-- If more than one action, create a popovermenu -->
		<Popover
			:delay="0"
			:handle-resize="true"
			:open.sync="opened"
			:placement="placement"
			:boundaries-element="boundariesElement"
			:container="container"
			@show="openMenu"
			@apply-show="onOpen"
			@hide="closeMenu">
			<!-- Menu open/close trigger button -->
			<button slot="trigger"
				ref="menuButton"
				class="icon action-item__menutoggle"
				:class="{
					[defaultIcon]: true,
					'action-item__menutoggle--with-title': menuTitle,
					'action-item__menutoggle--primary': primary
				}"
				:aria-label="ariaLabel"
				aria-haspopup="true"
				:aria-controls="randomId"
				:aria-expanded="opened">
				{{ menuTitle }}
			</button>

			<!-- Menu content -->
			<div v-show="opened"
				ref="menu"
				:class="{ open: opened }"
				tabindex="-1"
				@keydown.up.exact="focusPreviousAction"
				@keydown.down.exact="focusNextAction"
				@keydown.tab.exact="focusNextAction"
				@keydown.shift.tab.exact="focusPreviousAction"
				@keydown.page-up.exact="focusFirstAction"
				@keydown.page-down.exact="focusLastAction"
				@keydown.esc.exact.prevent="closeMenu"
				@mousemove="onMouseFocusAction">
				<!-- menu content -->
				<ul :id="randomId" tabindex="-1">
					<template v-if="opened">
						<slot />
					</template>
				</ul>
			</div>
		</Popover>
	</div>
</template>
<script>
import Tooltip from '../../directives/Tooltip'
import GenRandomId from '../../utils/GenRandomId'
import ValidateSlot from '../../utils/ValidateSlot'
import { t } from '../../l10n'
import Popover from '../Popover'

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
		tooltip: Tooltip,
	},

	components: {
		Popover,
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
		 * Specify the menu title
		 */
		menuTitle: {
			type: String,
			default: null,
		},

		/**
		 * Apply primary styling for this menu
		 */
		primary: {
			type: Boolean,
			default: false,
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

		/**
		 * Wanted direction of the menu
		 */
		placement: {
			type: String,
			default: 'bottom',
		},

		/**
		 * DOM element for the actions' popover boundaries
		 */
		boundariesElement: {
			type: Element,
			default: () => document.querySelector('body'),
		},

		/**
		 * Selector for the actions' popover container
		 */
		container: {
			type: String,
			default: 'body',
		},
	},

	data() {
		return {
			actions: [],
			opened: this.open,
			focusIndex: 0,
			randomId: 'menu-' + GenRandomId(),
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
		// Watch parent prop
		open(state) {
			if (state === this.opened) {
				return
			}

			this.opened = state
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
		openMenu(e) {
			if (this.opened) {
				return
			}

			this.opened = true

			/**
			 * Event emitted when the popover menu open state is changed
			 * @type {boolean}
			 */
			this.$emit('update:open', true)

			/**
			 * Event emitted when the popover menu is closed
			 */
			this.$emit('open')

			this.onOpen(e)
		},
		closeMenu(e) {
			if (!this.opened) {
				return
			}

			this.opened = false

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
			this.focusIndex = 0

			// focus back the menu button
			this.$refs.menuButton.focus()
		},

		onOpen(event) {
			this.$nextTick(() => {
				this.focusFirstAction(event)
			})
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
					const focusIndex = [...focusList].indexOf(focusableItem)
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
				this.removeCurrentActive()
				const liMenuParent = focusElement.closest('li.action')
				focusElement.focus()
				if (liMenuParent) {
					liMenuParent.classList.add('active')
				}
			}
		},
		focusPreviousAction(event) {
			if (this.opened) {
				if (this.focusIndex === 0) {
					// First element overflows to body-navigation (no preventDefault!) and closes Actions-menu
					this.closeMenu()
				} else {
					this.preventIfEvent(event)
					this.focusIndex = this.focusIndex - 1
				}
				this.focusAction()
			}
		},
		focusNextAction(event) {
			if (this.opened) {
				const indexLength = this.$refs.menu.querySelectorAll(focusableSelector).length - 1
				if (this.focusIndex === indexLength) {
					// Last element overflows to body-navigation (no preventDefault!) and closes Actions-menu
					this.closeMenu()
				} else {
					this.preventIfEvent(event)
					this.focusIndex = this.focusIndex + 1
				}
				this.focusAction()
			}
		},
		focusFirstAction(event) {
			if (this.opened) {
				this.preventIfEvent(event)
				this.focusIndex = 0
				this.focusAction()
			}
		},
		focusLastAction(event) {
			if (this.opened) {
				this.preventIfEvent(event)
				this.focusIndex = this.$el.querySelectorAll(focusableSelector).length - 1
				this.focusAction()
			}
		},

		preventIfEvent(event) {
			if (event) {
				event.preventDefault()
				event.stopPropagation()
			}
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
	&__menutoggle:active {
		opacity: $opacity_full;
		// good looking on dark AND white bg
		background-color: $icon-focus-bg;
	}

	&.action-item--open .action-item__menutoggle {
		opacity: $opacity_full;
		background-color: $action-background-hover;
	}

	// icons
	&--single,
	&__menutoggle {
		box-sizing: border-box;
		width: auto;
		min-width: $clickable-area;
		height: $clickable-area;
		margin: 0;
		padding: $icon-margin;
		cursor: pointer;
		border: none;
		border-radius: $clickable-area / 2;
		background-color: transparent;
	}

	// icon-more
	&__menutoggle {
		// align menu icon in center
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: $opacity_normal;
		font-weight: bold;
		line-height: $icon-size;

		&:before {
			content: '';
		}

		&--default-icon {
			@include iconfont('more');
			&::before {
				font-size: $icon-size;
			}
		}

		&--with-title {
			position: relative;
			padding-left: $clickable-area;
			white-space: nowrap;
			opacity: $opacity_full;
			border: 1px solid var(--color-border-dark);
			// with a title, we need to display this as a real button
			background-color: var(--color-background-dark);
			background-position: $icon-margin center;
			font-size: inherit;
			// non-background icon class
			&:before {
				position: absolute;
				top: $icon-margin;
				left: $icon-margin;
			}
		}

		&--primary {
			opacity: $opacity_full;
			color: var(--color-primary-text);
			border: none;
			background-color: var(--color-primary-element);
			.action-item--open &,
			&:hover,
			&:focus,
			&:active {
				color: var(--color-primary-text) !important;
				background-color: var(--color-primary-element-light) !important;
			}
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
}

.ie,
.edge {
	.action-item__menu,
	.action-item__menu .action-item__menu_arrow {
		border: 1px solid var(--color-border);
	}
}

</style>
