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

```vue
<template>
	<NcActions>
		<NcActionButton @click="actionDelete">
			<template #icon>
				<Delete :size="20" />
			</template>
			Delete
		</NcActionButton>
	</NcActions>
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

```vue
<template>
	<NcActions>
		<NcActionButton @click="showMessage('Edit')">
			<template #icon>
				<Pencil :size="20" />
			</template>
			Edit
		</NcActionButton>
		<NcActionButton @click="showMessage('Delete')">
			<template #icon>
				<Delete :size="20" />
			</template>
			Delete
		</NcActionButton>
		<NcActionLink href="https://nextcloud.com">
			<template #icon>
				<OpenInNew :size="20" />
			</template>
			Link
		</NcActionLink>
	</NcActions>
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

### Multiple actions with 2 items inline

```vue
<template>
	<NcActions :inline="2">
		<NcActionButton @click="showMessage('Add')">
			<template #icon>
				<Plus :size="20" />
			</template>
			Add
		</NcActionButton>
		<NcActionButton @click="showMessage('Edit')">
			<template #icon>
				<Pencil :size="20" />
			</template>
			Edit
		</NcActionButton>
		<NcActionButton @click="showMessage('Delete')">
			<template #icon>
				<Delete :size="20" />
			</template>
			Delete
		</NcActionButton>
		<NcActionLink href="https://nextcloud.com">
			<template #icon>
				<OpenInNew :size="20" />
			</template>
			Link
		</NcActionLink>
	</NcActions>
</template>
<script>
import Plus from 'vue-material-design-icons/Plus'
import Delete from 'vue-material-design-icons/Delete'
import OpenInNew from 'vue-material-design-icons/OpenInNew'
import Pencil from 'vue-material-design-icons/Pencil'

export default {
	components: {
		Delete,
		OpenInNew,
		Pencil,
		Plus,
	},
	methods: {
		showMessage(msg) {
			alert(msg)
		},
	},
}
</script>
```

### Multiple actions with 2 items inline AND forced titles

```vue
<template>
	<NcActions :force-title="true" :inline="2">
		<NcActionButton @click="showMessage('Add')">
			<template #icon>
				<Plus :size="20" />
			</template>
			Add
		</NcActionButton>
		<NcActionButton @click="showMessage('Edit')">
			<template #icon>
				<Pencil :size="20" />
			</template>
			Edit
		</NcActionButton>
		<NcActionButton @click="showMessage('Delete')">
			<template #icon>
				<Delete :size="20" />
			</template>
			Delete
		</NcActionButton>
		<NcActionLink href="https://nextcloud.com">
			<template #icon>
				<OpenInNew :size="20" />
			</template>
			Link
		</NcActionLink>
	</NcActions>
</template>
<script>
import Plus from 'vue-material-design-icons/Plus'
import Delete from 'vue-material-design-icons/Delete'
import OpenInNew from 'vue-material-design-icons/OpenInNew'
import Pencil from 'vue-material-design-icons/Pencil'

export default {
	components: {
		Delete,
		OpenInNew,
		Pencil,
		Plus,
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

```vue
<template>
	<NcActions>
		<template #icon>
			<Pencil :size="20" />
		</template>
		<NcActionButton @click="showMessage('Edit')">
			<template #icon>
				<Pencil :size="20" />
			</template>
			Edit
		</NcActionButton>
		<NcActionButton @click="showMessage('Delete')">
			<template #icon>
				<Delete :size="20" />
			</template>
			Delete
		</NcActionButton>
		<NcActionLink href="https://nextcloud.com">
			<template #icon>
				<OpenInNew :size="20" />
			</template>
			Link
		</NcActionLink>
	</NcActions>
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

```vue
<template>
	<NcActions menu-title="Object management">
		<template #icon>
			<Pencil :size="20" />
		</template>
		<NcActionButton>
			<template #icon>
				<Pencil :size="20" />
			</template>
			Rename
		</NcActionButton>
		<NcActionButton>
			<template #icon>
				<Delete :size="20" />
			</template>
			Delete
		</NcActionButton>
		<NcActionButton>
			<template #icon>
				<ArrowRight :size="20" />
			</template>
			Validate
		</NcActionButton>
		<NcActionButton>
			<template #icon>
				<Download :size="20" />
			</template>
			Download
		</NcActionButton>
	</NcActions>
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
```vue
<template>
	<NcActions :primary="true">
		<NcActionButton>
			<template #icon>
				<Pencil :size="20" />
			</template>
			Edit
		</NcActionButton>
		<NcActionButton>
			<template #icon>
				<Delete :size="20" />
			</template>
			Delete
		</NcActionButton>
	</NcActions>
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

```vue
<template>
	<NcActions :primary="true" menu-title="Object management">
		<template #icon>
			<Plus :size="20" />
		</template>
		<NcActionButton>
			<template #icon>
				<Pencil :size="20" />
			</template>
			Rename
		</NcActionButton>
		<NcActionButton>
			<template #icon>
				<Delete :size="20" />
			</template>
			Delete
		</NcActionButton>
		<NcActionButton>
			<template #icon>
				<ArrowRight :size="20" />
			</template>
			Validate
		</NcActionButton>
		<NcActionButton>
			<template #icon>
				<Download :size="20" />
			</template>
			Download
		</NcActionButton>
	</NcActions>
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
```vue
<template>
	<div style="display: flex;align-items: center;">
		<NcButton @click="toggled = !toggled">Toggle multiple action</NcButton>
		<NcActions>
			<template #icon>
				<DotsHorizontalCircleOutline :size="20" />
			</template>
			<NcActionButton>
				<template #icon>
					<MicrophoneOff :size="20" />
				</template>
				Mute
			</NcActionButton>
			<NcActionButton v-if="toggled">
				<template #icon>
					<Delete :size="20" />
				</template>
				Delete
			</NcActionButton>
		</NcActions>
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
```vue
<template>
	<NcActions :primary="true">
		<NcActionButton>
			<template #icon>
				<Magnify :size="20" />
			</template>
			Search
		</NcActionButton>
		<NcActionButton>
			<template #icon>
				<Delete :size="20" />
			</template>
			Delete
		</NcActionButton>
	</NcActions>
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

### Type variants

```vue
<template>
	<div>
		<NcActions :type="current">
			<template #icon>
				<SelectColor :size="20" />
			</template>

			<NcActionButton v-if="current" close-after-click @click="define()">
				<template #icon>
					<Delete :size="20" />
				</template>
				Remove
			</NcActionButton>

			<NcActionButton v-for="row in types" close-after-click @click="define(row)" :key="`type-icon--${row}`">
				<template #icon>
					<CheckboxMarkedCircleOutline v-if="row === current" :size="20" />
					<SelectColor v-else :size="20" />
				</template>
				{{ row }}
			</NcActionButton>
		</NcActions>

		<NcActions :type="current" menu-title="Choose a type">
			<NcActionButton v-if="current" close-after-click @click="define()">
				<template #icon>
					<Delete :size="20" />
				</template>
				Remove
			</NcActionButton>

			<NcActionButton v-for="row in types" close-after-click @click="define(row)" :key="`type-text--${row}`">
				<template #icon>
					<CheckboxMarkedCircleOutline v-if="row === current" :size="20" />
					<SelectColor v-else :size="20" />
				</template>
				{{ row }}
			</NcActionButton>
		</NcActions>

		<NcActions :type="current"  menu-title="Choose a type">
			<template #icon>
				<SelectColor :size="20" />
			</template>

			<NcActionButton v-if="current" close-after-click @click="define()">
				<template #icon>
					<Delete :size="20" />
				</template>
				Remove
			</NcActionButton>

			<NcActionButton v-for="row in types" close-after-click @click="define(row)" :key="`type-icon-text--${row}`">
				<template #icon>
					<CheckboxMarkedCircleOutline v-if="row === current" :size="20" />
					<SelectColor v-else :size="20" />
				</template>
				{{ row }}
			</NcActionButton>
		</NcActions>
	</div>
</template>

<script>
import Delete from 'vue-material-design-icons/Delete'
import Palette from 'vue-material-design-icons/Palette'
import SelectColor from 'vue-material-design-icons/SelectColor'
import CheckboxMarkedCircleOutline from 'vue-material-design-icons/CheckboxMarkedCircleOutline'

export default {
	components: {
		Delete,
		Palette,
		SelectColor,
		CheckboxMarkedCircleOutline,
	},
	data() {
		return {
			current: 'primary',
			types: [
				'primary',
				'secondary',
				'tertiary',
				'error',
				'warning',
				'success'
			]
		}
	},
	methods: {
		define(row = undefined) {
			this.current = row
		}
	}
}
</script>
```

</docs>

<script>
import NcButton from '../NcButton/index.js'
import NcPopover from '../NcPopover/index.js'
import Tooltip from '../../directives/Tooltip/index.js'
import GenRandomId from '../../utils/GenRandomId.js'
import { t } from '../../l10n.js'

import Vue from 'vue'
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
	name: 'NcActions',

	directives: {
		tooltip: Tooltip,
	},

	components: {
		NcButton,
		DotsHorizontal,
		NcPopover,
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
		 * Specifies the button type used for trigger and single actions buttons
		 * Accepted values: primary, secondary, tertiary, tertiary-no-background, tertiary-on-primary, error, warning, success. If left empty,
		 * the default button style will be applied.
		 */
		type: {
			type: String,
			validator(value) {
				return ['primary', 'secondary', 'tertiary', 'tertiary-no-background', 'tertiary-on-primary', 'error', 'warning', 'success'].indexOf(value) !== -1
			},
			default: null,
		},

		/**
		 * Icon to show for the toggle menu button
		 * when more than one action is inside the actions component.
		 * Only replace the default three-dot icon if really necessary.
		 */
		defaultIcon: {
			type: String,
			default: '',
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
			type: [String, Object, Element, Boolean],
			default: 'body',
		},

		/**
		 * Disabled state of the main button (single action or menu toggle)
		 */
		disabled: {
			type: Boolean,
			default: false,
		},

		/**
		 * Display x items inline out of the dropdown menu
		 * Will be ignored if `forceMenu` is set
		 */
		inline: {
			type: Number,
			default: 0,
		},
	},

	emits: [
		'update:open',
		'open',
		'update:open',
		'close',
		'focus',
		'blur',
	],

	data() {
		return {
			opened: this.open,
			focusIndex: 0,
			randomId: `menu-${GenRandomId()}`,
		}
	},

	computed: {
		triggerBtnType() {
			// If requested, we use a primary button
			return this.type || (this.primary
				? 'primary'
				// If it has a title, we use a secondary button
				: this.menuTitle ? 'secondary' : 'tertiary')
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

	methods: {
		/**
		 * Do we have exactly one Action and
		 * is it allowed as a standalone element?
		 *
		 * @param {Array} action The action to check
		 * @return {boolean}
		 */
		isValidSingleAction(action) {
			const componentName = action?.componentOptions?.Ctor?.extendOptions?.name ?? action?.componentOptions?.tag
			return ['NcActionButton', 'NcActionLink', 'NcActionRouter'].includes(componentName)
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
		closeMenu(returnFocus = true) {
			if (!this.opened) {
				return
			}

			this.opened = false

			this.$refs.popover.clearFocusTrap({ returnFocus })

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
				this.closeMenu()
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
	 * @return {object|undefined} The created VNode
	 */
	render(h) {
		/**
		 * Filter the Actions, so that we only get allowed components.
		 * This also ensure that we don't get 'text' elements, which would
		 * become problematic later on.
		 */
		const actions = (this.$slots.default || []).filter(
			action => action?.componentOptions?.tag || action?.componentOptions?.Ctor?.extendOptions?.name
		)

		/**
		 * Filter and list actions that are allowed to be displayed inline
		 */
		let inlineActions = actions.filter(this.isValidSingleAction)
		if (this.forceMenu && inlineActions.length > 0 && this.inline > 0) {
			Vue.util.warn('Specifying forceMenu will ignore any inline actions rendering.')
			inlineActions = []
		}

		// Check that we have at least one action
		if (actions.length === 0) {
			return
		}

		/**
		 * Render the provided action
		 *
		 * @param {object} action the action to render
		 * @return {Function} the vue render function
		 */
		const renderInlineAction = (action) => {
			const icon = action?.data?.scopedSlots?.icon()?.[0] || h('span', { class: ['icon', action?.componentOptions?.propsData?.icon] })
			const text = this.forceTitle ? action.componentOptions?.children?.[0]?.text : ''
			const clickListener = action?.componentOptions?.listeners?.click

			return h('NcButton',
				{
					class: [
						'action-item action-item--single',
						action?.data?.staticClass,
						action?.data?.class,
					],
					attrs: {
						'aria-label': action?.componentOptions?.propsData?.ariaLabel || text,
						title: action?.componentOptions?.propsData?.title,
					},
					ref: action?.data?.ref,
					props: {
						// If it has a title, we use a secondary button
						type: this.type || (text.trim() ? 'secondary' : 'tertiary'),
						disabled: this.disabled || action?.componentOptions?.propsData?.disabled,
						...action?.componentOptions?.propsData,
					},
					directives: [{
						name: 'tooltip',
						value: action?.componentOptions?.children?.[0]?.text,
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
					text.trim(),
				],
			)
		}

		/**
		 * Render the actions popover
		 *
		 * @param {Array} actions the actions to render within
		 * @return {Function} the vue render function
		 */
		const renderActionsPopover = (actions) => {
			const triggerIcon = this.$slots.icon?.[0] || (
				this.defaultIcon
					? h('span', { class: ['icon', this.defaultIcon] })
					: h('DotsHorizontal', {
						props: {
							size: 20,
						},
					})
			)
			return h('NcPopover',
				{
					ref: 'popover',
					props: {
						delay: 0,
						handleResize: true,
						shown: this.opened,
						placement: this.placement,
						boundary: this.boundariesElement,
						container: this.container,
						popoverBaseClass: 'action-item__popper',
						setReturnFocus: this.$refs.menuButton?.$el,
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
					h('NcButton', {
						class: 'action-item__menutoggle',
						props: {
							type: this.triggerBtnType,
							disabled: this.disabled,
						},
						slot: 'trigger',
						ref: 'menuButton',
						attrs: {
							'aria-haspopup': 'menu',
							'aria-label': this.ariaLabel,
							'aria-controls': this.opened ? this.randomId : null,
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
			)
		}

		/**
		 * If we have a single action only and didn't force a menu,
		 * we render the action as a standalone button
		 */
		if (actions.length === 1 && inlineActions.length === 1 && !this.forceMenu) {
			return renderInlineAction(inlineActions[0])
		}

		/**
		 * If we some inline actions to render, render them, then the menu
		 */
		if (inlineActions.length > 0 && this.inline > 0) {
			const renderedInlineActions = inlineActions.slice(0, this.inline)
			// Filter already rendered actions
			const menuActions = actions.filter(action => !renderedInlineActions.includes(action))
			return h('div',
				{
					class: [
						'action-items',
						`action-item--${this.triggerBtnType}`,
					],
				},
				[
					// Render inline actions
					...renderedInlineActions.map(renderInlineAction),
					// render the rest within the popover menu
					menuActions.length > 0
						? h('div',
							{
								class: [
									'action-item',
									{
										'action-item--open': this.opened,
									},
								],
							},
							[
								renderActionsPopover(menuActions),
							])
						: null,
				])
		}

		/**
		 * Otherwise, we render the actions in a popover
		 */
		return h('div',
			{
				class: [
					'action-item action-item--default-popover',
					`action-item--${this.triggerBtnType}`,
					{
						'action-item--open': this.opened,
					},
				],
			},
			[
				renderActionsPopover(actions),
			]
		)
	},
}
</script>

<style lang="scss" scoped>
// Inline buttons
.action-items {
	display: flex;
	align-items: center;

	// Spacing between buttons
	& > button {
		margin-right: math.div($icon-margin, 2);
	}
}

.action-item {
	--open-background-color: var(--color-background-hover, $action-background-hover);
	position: relative;
	display: inline-block;

	&.action-item--primary {
		--open-background-color: var(--color-primary-element-hover);
	}

	&.action-item--secondary {
		--open-background-color: var(--color-primary-light-hover);
	}

	&.action-item--error {
		--open-background-color: var(--color-error-hover);
	}

	&.action-item--warning {
		--open-background-color: var(--color-warning-hover);
	}

	&.action-item--success {
		--open-background-color: var(--color-success-hover);
	}

	&.action-item--tertiary-no-background {
		--open-background-color: transparent;
	}

	&.action-item--open .action-item__menutoggle {
		opacity: $opacity_full;
		background-color: var(--open-background-color);
	}
}
</style>

<style lang="scss">
// We overwrote the popover base class, so we can style
// the popover__inner for actions only.
.v-popper--theme-dropdown.v-popper__popper.action-item__popper .v-popper__wrapper {
	border-radius: var(--border-radius-large);
	overflow:hidden;

	.v-popper__inner {
		border-radius: var(--border-radius-large);
		padding: 4px;
		max-height: calc(50vh - 16px);
		overflow: auto;
	}
}
</style>
