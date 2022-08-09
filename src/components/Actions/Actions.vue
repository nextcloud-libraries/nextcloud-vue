<!--
  - @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
  -
  - @author John Molakvoæ <skjnldsv@protonmail.com>
  - @author Marco Ambrosini <marcoambrosini@icloud.com>
  - @author Raimund Schlüßler <raimund.schluessler@mailbox.org>
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
<template>
	<Actions>
		<ActionButton @click="actionDelete">
			<template #icon>
				<Delete :size="20" />
			</template>
			Delete
		</ActionButton>
	</Actions>
</template>
<script>
import Delete from 'vue-material-design-icons/Delete'

export default {
	components: {
		Delete,
	},
	methods: {
		actionDelete() {
			alert('Delete')
		},
	},
}
</script>
```

### Multiple actions

```
<template>
	<Actions>
		<ActionButton @click="showMessage('Edit')">
			<template #icon>
				<Pencil :size="20" />
			</template>
			Edit
		</ActionButton>
		<ActionButton @click="showMessage('Delete')">
			<template #icon>
				<Delete :size="20" />
			</template>
			Delete
		</ActionButton>
		<ActionLink href="https://nextcloud.com">
			<template #icon>
				<OpenInNew :size="20" />
			</template>
			Link
		</ActionLink>
	</Actions>
</template>
<script>
import Delete from 'vue-material-design-icons/Delete'
import OpenInNew from 'vue-material-design-icons/OpenInNew'
import Pencil from 'vue-material-design-icons/Pencil'

export default {
	components: {
		Delete,
		OpenInNew,
		Pencil,
	},
	methods: {
		showMessage(msg) {
			alert(msg)
		},
	},
}
</script>
```

### Multiple actions with custom icon

```
<template>
	<Actions>
		<template #icon>
			<Pencil :size="20" />
		</template>
		<ActionButton @click="showMessage('Edit')">
			<template #icon>
				<Pencil :size="20" />
			</template>
			Edit
		</ActionButton>
		<ActionButton @click="showMessage('Delete')">
			<template #icon>
				<Delete :size="20" />
			</template>
			Delete
		</ActionButton>
		<ActionLink href="https://nextcloud.com">
			<template #icon>
				<OpenInNew :size="20" />
			</template>
			Link
		</ActionLink>
	</Actions>
</template>
<script>
import Delete from 'vue-material-design-icons/Delete'
import OpenInNew from 'vue-material-design-icons/OpenInNew'
import Pencil from 'vue-material-design-icons/Pencil'

export default {
	components: {
		Delete,
		OpenInNew,
		Pencil,
	},
	methods: {
		showMessage(msg) {
			alert(msg)
		},
	},
}
</script>
```

### With menu title

```
<template>
	<Actions menu-title="Object management">
		<template #icon>
			<Pencil :size="20" />
		</template>
		<ActionButton>
			<template #icon>
				<Pencil :size="20" />
			</template>
			Rename
		</ActionButton>
		<ActionButton>
			<template #icon>
				<Delete :size="20" />
			</template>
			Delete
		</ActionButton>
		<ActionButton>
			<template #icon>
				<ArrowRight :size="20" />
			</template>
			Validate
		</ActionButton>
		<ActionButton>
			<template #icon>
				<Download :size="20" />
			</template>
			Download
		</ActionButton>
	</Actions>
</template>
<script>
import ArrowRight from 'vue-material-design-icons/ArrowRight'
import Delete from 'vue-material-design-icons/Delete'
import Download from 'vue-material-design-icons/Download'
import Pencil from 'vue-material-design-icons/Pencil'

export default {
	components: {
		ArrowRight,
		Delete,
		Download,
		Pencil,
	},
}
</script>
```

### Various icons styles
```
<template>
	<Actions :primary="true">
		<ActionButton>
			<template #icon>
				<Pencil :size="20" />
			</template>
			Edit
		</ActionButton>
		<ActionButton>
			<template #icon>
				<Delete :size="20" />
			</template>
			Delete
		</ActionButton>
	</Actions>
</template>
<script>
import Delete from 'vue-material-design-icons/Delete'
import Pencil from 'vue-material-design-icons/Pencil'

export default {
	components: {
		Delete,
		Pencil,
	},
}
</script>
```

```
<template>
	<Actions :primary="true" menu-title="Object management">
		<template #icon>
			<Plus :size="20" />
		</template>
		<ActionButton>
			<template #icon>
				<Pencil :size="20" />
			</template>
			Rename
		</ActionButton>
		<ActionButton>
			<template #icon>
				<Delete :size="20" />
			</template>
			Delete
		</ActionButton>
		<ActionButton>
			<template #icon>
				<ArrowRight :size="20" />
			</template>
			Validate
		</ActionButton>
		<ActionButton>
			<template #icon>
				<Download :size="20" />
			</template>
			Download
		</ActionButton>
	</Actions>
</template>
<script>
import ArrowRight from 'vue-material-design-icons/ArrowRight'
import Delete from 'vue-material-design-icons/Delete'
import Download from 'vue-material-design-icons/Download'
import Pencil from 'vue-material-design-icons/Pencil'
import Plus from 'vue-material-design-icons/Plus'

export default {
	components: {
		ArrowRight,
		Delete,
		Download,
		Pencil,
		Plus,
	},
}
</script>
```

### Custom icon slot
To be used with `vue-material-design-icons` only. For icon classes use the `default-icon` slot.
It can be used with one or multiple actions.
```
<template>
	<div style="display: flex;align-items: center;">
		<button @click="toggled = !toggled">Toggle multiple action</button>
		<Actions>
			<template #icon>
				<DotsHorizontalCircleOutline :size="20" />
			</template>
			<ActionButton>
				<template #icon>
					<MicrophoneOff :size="20" />
				</template>
				Mute
			</ActionButton>
			<ActionButton v-if="toggled">
				<template #icon>
					<Delete :size="20" />
				</template>
				Delete
			</ActionButton>
		</Actions>
		<Actions>
		</Actions>
	</div>
</template>
<script>
import Delete from 'vue-material-design-icons/Delete'
import DotsHorizontalCircleOutline from 'vue-material-design-icons/DotsHorizontalCircleOutline'
import MicrophoneOff from 'vue-material-design-icons/MicrophoneOff'

export default {
	components: {
		Delete,
		DotsHorizontalCircleOutline,
		MicrophoneOff,
	},
	data() {
		return {
			toggled: false
		}
	}
}
</script>
```

### Custom icon slot in child elements
```
<template>
	<Actions :primary="true">
		<ActionButton>
			<template #icon>
				<Magnify :size="20" />
			</template>
			Search
		</ActionButton>
		<ActionButton>
			<template #icon>
				<Delete :size="20" />
			</template>
			Delete
		</ActionButton>
	</Actions>
</template>
<script>
import Delete from 'vue-material-design-icons/Delete'
import Magnify from 'vue-material-design-icons/Magnify'

export default {
	components: {
		Delete,
		Magnify,
	},
}
</script>
```

</docs>

<script>
import ButtonVue from '../ButtonVue/index.js'
import Popover from '../Popover/index.js'
import Tooltip from '../../directives/Tooltip/index.js'
import GenRandomId from '../../utils/GenRandomId.js'
import { t } from '../../l10n.js'

import DotsHorizontal from 'vue-material-design-icons/DotsHorizontal.vue'

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
		ButtonVue,
		DotsHorizontal,
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
		 * Force the title to show for single actions
		 */
		forceTitle: {
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

		/**
		 * Disabled state of the main button (single action or menu toggle)
		 */
		disabled: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			opened: this.open,
			focusIndex: 0,
			randomId: `menu-${GenRandomId()}`,
		}
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

	methods: {
		/**
		 * Do we have exactly one Action and
		 * is it allowed as a standalone element?
		 *
		 * @param {Array} actions The acttions to check
		 * @return {boolean}
		 */
		isValidSingleAction(actions) {
			return actions.length === 1
				&& ['ActionButton', 'ActionLink', 'ActionRouter'].includes(actions[0]?.componentOptions?.tag)
		},
		// MENU STATE MANAGEMENT
		openMenu(e) {
			if (this.opened) {
				return
			}

			this.opened = true

			/**
			 * Event emitted when the popover menu open state is changed
			 *
			 * @type {boolean}
			 */
			this.$emit('update:open', true)

			/**
			 * Event emitted when the popover menu is opened
			 */
			this.$emit('open')
		},
		closeMenu(e) {
			if (!this.opened) {
				return
			}

			this.opened = false

			/**
			 * Event emitted when the popover menu open state is changed
			 *
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
			this.$refs.menuButton.$el.focus()
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
		/**
		 * Dispatches the keydown listener to different handlers
		 *
		 * @param {object} event The keydown event
		 */
		onKeydown(event) {
			// Up or Shift+Tab
			if (event.keyCode === 38 || (event.keyCode === 9 && event.shiftKey)) {
				this.focusPreviousAction(event)
			}
			// Down or Tab
			if (event.keyCode === 40 || (event.keyCode === 9 && !event.shiftKey)) {
				this.focusNextAction(event)
			}
			// Page-Up
			if (event.keyCode === 33) {
				this.focusFirstAction(event)
			}
			// Page-Down
			if (event.keyCode === 34) {
				this.focusLastAction(event)
			}
			// Esc
			if (event.keyCode === 27) {
				this.closeMenu(event)
				event.preventDefault()
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
				this.focusIndex = this.$refs.menu.querySelectorAll(focusableSelector).length - 1
				this.focusAction()
			}
		},
		preventIfEvent(event) {
			if (event) {
				event.preventDefault()
				event.stopPropagation()
			}
		},
		onFocus(event) {
			this.$emit('focus', event)
		},
		onBlur(event) {
			this.$emit('blur', event)
		},
	},
	/**
	 * The render function to display the component
	 *
	 * @param {Function} h The function to create VNodes
	 * @return {VNodes} The created VNodes
	 */
	render(h) {
		/**
		 * Filter the Actions, so that we only get allowed components.
		 * This also ensure that we don't get 'text' elements, which would
		 * become problematic later on.
		 */
		const actions = (this.$slots.default || []).filter(
			action => action?.componentOptions?.tag
		)

		// Check that we have at least one action
		if (actions.length === 0) {
			return
		}

		/**
		 * If we have a single action only and didn't force a menu,
		 * we render the action as a standalone button
		 */
		if (this.isValidSingleAction(actions) && !this.forceMenu) {
			const firstAction = actions[0]
			const icon = firstAction?.data?.scopedSlots?.icon()?.[0]
			const title = this.forceTitle ? this.menuTitle : ''
			const clickListener = firstAction?.componentOptions?.listeners?.click
			return h('ButtonVue',
				{
					class: [
						'action-item action-item--single',
						firstAction?.data?.staticClass,
						firstAction?.data?.class,
					],
					attrs: {
						'aria-label': firstAction?.componentOptions?.propsData?.ariaLabel || firstAction?.componentOptions?.children?.[0]?.text,
					},
					props: {
						 // If it has a title, we use a secondary button
						type: title ? 'secondary' : 'tertiary',
						disabled: this.disabled || firstAction?.componentOptions?.propsData?.disabled,
						...firstAction?.componentOptions?.propsData,
					},
					directives: [{
						name: 'tooltip',
						value: firstAction?.componentOptions?.children?.[0]?.text,
						modifiers: {
							auto: true,
						},

					}],
					on: {
						focus: this.onFocus,
						blur: this.onBlur,
						// If we have a click listener,
						// we bind it to execute on click and forward the click event
						...(!!clickListener && {
							click: (event) => {
								if (clickListener) {
									clickListener(event)
								}
							},
						}),
					},
				},
				[
					h('template', { slot: 'icon' }, [icon]),
					title,
				],
			)
		/**
		 * Otherwise, we render the actions in a popover
		 */
		} else {
			const triggerIcon = this.$slots.icon?.[0] || h('DotsHorizontal', {
				props: {
					size: 20,
				},
			})
			return h('div',
				{
					class: [
						'action-item',
						{
							'action-item--open': this.opened,
						},
					],
				},
				[
					h('Popover',
						{
							props: {
								delay: 0,
								handleResize: true,
								shown: this.opened,
								placement: this.placement,
								boundary: this.boundariesElement,
								container: this.container,
								popoverBaseClass: 'action-item__popper',
							},
							// For some reason the popover component
							// does not react to props given under the 'props' key,
							// so we use both 'attrs' and 'props'
							attrs: {
								delay: 0,
								handleResize: true,
								shown: this.opened,
								placement: this.placement,
								boundary: this.boundariesElement,
								container: this.container,
								popoverBaseClass: 'action-item__popper',
							},
							on: {
								show: this.openMenu,
								'after-show': this.onOpen,
								hide: this.closeMenu,
							},
						},
						[
							h('ButtonVue', {
								class: 'action-item__menutoggle',
								props: {
									// If requested, we use a primary button
									type: this.primary
										? 'primary'
										// If it has a title, we use a secondary button
										: this.menuTitle ? 'secondary' : 'tertiary',
									disabled: this.disabled,
								},
								slot: 'trigger',
								ref: 'menuButton',
								attrs: {
									'aria-haspopup': 'menu',
									'aria-label': this.ariaLabel,
									'aria-controls': this.randomId,
									'aria-expanded': this.opened.toString(),
								},
								on: {
									focus: this.onFocus,
									blur: this.onBlur,
								},
							}, [
								h('template', { slot: 'icon' }, [triggerIcon]),
								this.menuTitle,
							]),
							h('div', {
								class: {
									open: this.opened,
								},
								attrs: {
									tabindex: '-1',
								},
								on: {
									keydown: this.onKeydown,
									mousemove: this.onMouseFocusAction,
								},
								ref: 'menu',
							}, [
								h('ul', {
									attrs: {
										id: this.randomId,
										tabindex: '-1',
										role: 'menu',
									},
								}, [
									actions,
								]),
							]),
						],
					),
				])
		}
	},
}
</script>

<style lang="scss" scoped>
.action-item {
	position: relative;
	display: inline-block;

	&.action-item--open .action-item__menutoggle {
		opacity: $opacity_full;
		background-color: $action-background-hover;
	}
}
</style>

<style lang="scss">
// We overwrote the popover base class, so we can style
// the popover__inner for actions only.
.v-popper__popper.action-item__popper .v-popper__inner {
	border-radius: var(--border-radius-large);
	padding: 4px;
}
</style>
