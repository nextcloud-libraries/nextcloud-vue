<!--
 - @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
 -
 - @author John Molakvoæ <skjnldsv@protonmail.com>
 - @author Marco Ambrosini <marcoambrosini@pm.me>
 - @author Jonas Sulzer <jonas@violoncello.ch>
 - @author Jonathan Treffler <mail@jonathan-treffler.de>
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
 -
 -->

<docs>

# Usage

### Simple element

* With an icon:

```
<AppNavigationItem title="My title" icon="icon-category-enabled" />

```
* With a spinning loader instead of the icon:

```
<AppNavigationItem title="Loading Item" :loading="true" />
```

### Element with actions
Wrap the children in a template. If you have more than 2 actions, a popover menu and a menu
button will be automatically created.

```
<AppNavigationItem title="Item with actions" icon="icon-category-enabled">
	<template #actions>
		<ActionButton icon="icon-edit" @click="alert('Edit')">
			Edit
		</ActionButton>
		<ActionButton icon="icon-delete" @click="alert('Delete')">
			Delete
		</ActionButton>
		<ActionLink icon="icon-external" title="Link" href="https://nextcloud.com" />
	</template>
</AppNavigationItem>
```

### Element with counter
Just nest the counter in a template within `<AppNavigationItem>` and add `#counter` to it.

```
<AppNavigationItem title="Item with counter" icon="icon-folder">
	<template #counter>
		<CounterBubble>
			99+
		</CounterBubble>
	</template>
</AppNavigationItem>
```

### Element with children

Wrap the children in a template with the `slot` property and use the prop `allowCollapse` to choose wether to allow or
prevent the user from collapsing the items.

```
<AppNavigationItem title="Item with children" :allowCollapse="true" :open="true">
	<template>
		<AppNavigationItem title="AppNavigationItemChild1" />
		<AppNavigationItem title="AppNavigationItemChild2" />
		<AppNavigationItem title="AppNavigationItemChild3" />
		<AppNavigationItem title="AppNavigationItemChild4" />
	</template>
</AppNavigationItem>
```
### Editable element
Add the prop `:editable=true` and an edit placeholder if you need it. By default
the placeholder is the previous title of the element.

```
<AppNavigationItem title="Editable Item" :editable="true"
	editPlaceholder="your_placeholder_here" icon="icon-folder" @update:title="function(value){alert(value)}" />
```
### Undo element
Just set the `undo` and `title` props. When clicking the undo button, an `undo` event is emitted.

```
<AppNavigationItem :undo="true" title="Deleted important entry" @undo="alert('undo delete')"  />

```
### Pinned element
Just set the `pinned` prop.
```
<AppNavigationItem title="Pinned item" :pinned="true" />
```

</docs>

<template>
	<li class="app-navigation-entry-wrapper"
		:class="{
			'app-navigation-entry--opened': opened,
			'app-navigation-entry--pinned': pinned,
			'app-navigation-entry--collapsible': collapsible,
		}">
		<nav-element v-bind="navElement"
			:class="{
				'app-navigation-entry--no-icon': !isIconShown,
				'app-navigation-entry--editing': editingActive,
				'app-navigation-entry--deleted': undo,
				'active': isActive,
			}"
			class="app-navigation-entry">
			<!-- Icon and title -->
			<a v-if="!undo"
				class="app-navigation-entry-link"
				:aria-description="ariaDescription"
				href="#"
				@click="onClick">

				<!-- icon if not collapsible -->
				<!-- never show the icon over the collapsible if mobile -->
				<div :class="{ 'icon-loading-small': loading, [icon]: icon && isIconShown }"
					class="app-navigation-entry-icon">
					<slot v-show="!loading && isIconShown" name="icon" />
				</div>
				<span v-if="!editingActive" class="app-navigation-entry__title" :title="title">
					{{ title }}
				</span>
				<div v-if="editingActive" class="editingContainer">
					<InputConfirmCancel ref="editingInput"
						v-model="editingValue"
						:placeholder="editPlaceholder !== '' ? editPlaceholder : title"
						@cancel="cancelEditing"
						@confirm="handleEditingDone" />
				</div>
			</a>

			<AppNavigationIconCollapsible v-if="collapsible" :open="opened" @click.prevent.stop="toggleCollapse" />
			<!-- undo entry -->
			<div v-if="undo" class="app-navigation-entry__deleted">
				<div class="app-navigation-entry__deleted-description">
					{{ title }}
				</div>
			</div>

			<!-- Counter and Actions -->
			<div v-if="hasUtils && !editingActive" class="app-navigation-entry__utils">
				<div v-if="$slots.counter"
					class="app-navigation-entry__counter-wrapper">
					<slot name="counter" />
				</div>
				<Actions menu-align="right"
					:placement="menuPlacement"
					:open="menuOpen"
					:force-menu="forceMenu"
					:default-icon="menuIcon"
					@update:open="onMenuToggle">
					<template #icon>
						<!-- @slot Slot for the custom menu icon -->
						<slot name="menu-icon" />
					</template>
					<ActionButton v-if="editable && !editingActive"
						:aria-label="editButtonAriaLabel"
						@click="handleEdit">
						<template #icon>
							<Pencil :size="20" decorative />
						</template>
						{{ editLabel }}
					</ActionButton>
					<ActionButton v-if="undo"
						:aria-label="undoButtonAriaLabel"
						@click="handleUndo">
						<template #icon>
							<Undo :size="20" decorative />
						</template>
					</ActionButton>
					<slot name="actions" />
				</Actions>
			</div>

			<!-- Anything (virtual) that should be mounted in the component, like a related modal -->
			<slot name="extra" />
		</nav-element>
		<!-- Children elements -->
		<ul v-if="canHaveChildren && hasChildren" class="app-navigation-entry__children">
			<slot />
		</ul>
	</li>
</template>

<script>
import { directive as ClickOutside } from 'v-click-outside'

import Actions from '../Actions/index.js'
import ActionButton from '../ActionButton/index.js'
import AppNavigationIconCollapsible from './AppNavigationIconCollapsible.vue'
import isMobile from '../../mixins/isMobile/index.js'
import InputConfirmCancel from './InputConfirmCancel.vue'
import { t } from '../../l10n.js'

import Pencil from 'vue-material-design-icons/Pencil'
import Undo from 'vue-material-design-icons/Undo'

export default {
	name: 'AppNavigationItem',

	components: {
		Actions,
		ActionButton,
		AppNavigationIconCollapsible,
		InputConfirmCancel,
		Pencil,
		Undo,
	},
	directives: {
		ClickOutside,
	},
	mixins: [isMobile],
	props: {
		/**
		 * The title of the element.
		 */
		title: {
			type: String,
			required: true,
		},
		/**
		 * Refers to the icon on the left, this prop accepts a class
		 * like 'icon-category-enabled'.
		 */
		icon: {
			type: String,
			default: '',
		},

		/**
		 * Displays a loading animated icon on the left of the element
		 * instead of the icon.
		 */
		loading: {
			type: Boolean,
			default: false,
		},
		/**
		 * Passing in a route will make the root element of this
		 * component a `<router-link />` that points to that route.
		 * By leaving this blank, the root element will be a `<li>`.
		 */
		to: {
			type: [String, Object],
			default: '',
		},
		/**
		 * Pass in `true` if you want the matching behaviour to
		 * be non-inclusive: https://router.vuejs.org/api/#exact
		 */
		exact: {
			type: Boolean,
			default: false,
		},
		/**
		 * Gives the possibility to collapse the children elements into the
		 * parent element (true) or expands the children elements (false).
		 */
		allowCollapse: {
			type: Boolean,
			default: false,
		},
		/**
		 * Makes the title of the item editable by providing an `ActionButton`
		 * component that toggles a form
		 */
		editable: {
			type: Boolean,
			default: false,
		},
		/**
		 * Only for 'editable' items, sets label for the edit action button.
		 */
		editLabel: {
			type: String,
			default: '',
		},
		/**
		 * Only for items in 'editable' mode, sets the placeholder text for the editing form.
		 */
		editPlaceholder: {
			type: String,
			default: '',
		},
		/**
		 * Pins the item to the bottom left area, above the settings. Do not
		 * place 'non-pinned' `AppnavigationItem` components below `pinned`
		 * ones.
		 */
		pinned: {
			type: Boolean,
			default: false,
		},
		/**
		 * Puts the item in the 'undo' state.
		 */
		undo: {
			type: Boolean,
			default: false,
		},
		/**
		 * The navigation collapsible state (synced)
		 */
		open: {
			type: Boolean,
			default: false,
		},
		/**
		 * The actions menu open state (synced)
		 */
		menuOpen: {
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
		 * The action's menu default icon
		 */
		menuIcon: {
			type: String,
			default: undefined,
		},
		/**
		 * The action's menu direction
		 */
		menuPlacement: {
			type: String,
			default: 'bottom',
		},
		/**
		 * Entry aria details
		 */
		ariaDescription: {
			type: String,
			default: null,
		},
	},

	data() {
		return {
			editingValue: '',
			opened: this.open,
			editingActive: false,
			hasChildren: false,
		}
	},
	computed: {
		collapsible() {
			return this.allowCollapse && !!this.$slots.default
		},

		// is the icon shown?
		// we don't show it on mobile if the entry is collapsible
		// we show the collapse toggle directly!
		isIconShown() {
			return !this.collapsible || (this.collapsible && !this.isMobile)
		},

		// Checks if the component is already a children of another
		// instance of AppNavigationItem
		canHaveChildren() {
			if (this.$parent.$options._componentTag === 'AppNavigationItem') {
				return false
			} else {
				return true
			}
		},
		hasUtils() {
			if (this.editing) {
				return false
			} else if (this.$slots.actions || this.$slots.counter || this.editable || this.undo) {
				return true
			} else {
				return false
			}
		},
		// This is used to decide which outer element type to use
		navElement() {
			if (this.to) {
				return {
					is: 'router-link',
					tag: 'div',
					to: this.to,
					exact: this.exact,
				}
			}
			return {
				is: 'div',
			}
		},
		isActive() {
			return this.to && this.$route === this.to
		},
		editButtonAriaLabel() {
			return this.editLabel ? this.editLabel : t('Edit item')
		},
		undoButtonAriaLabel() {
			return t('Undo changes')
		},
	},
	watch: {
		open(newVal) {
			this.opened = newVal
		},
	},

	created() {
		this.updateSlotInfo()
	},

	beforeUpdate() {
		this.updateSlotInfo()
	},

	methods: {
		// sync opened menu state with prop
		onMenuToggle(state) {
			this.$emit('update:menuOpen', state)
		},
		// toggle the collapsible state
		toggleCollapse() {
			this.opened = !this.opened
			this.$emit('update:open', this.opened)
		},

		// forward click event
		onClick(event) {
			this.$emit('click', event)
		},

		// Edition methods
		handleEdit() {
			this.editingValue = this.title
			this.editingActive = true
			this.onMenuToggle(false)
			this.$nextTick(() => {
				this.$refs.editingInput.focusInput()
			})
		},
		cancelEditing() {
			this.editingActive = false
		},
		handleEditingDone() {
			this.$emit('update:title', this.editingValue)
			this.editingValue = ''
			this.editingActive = false
		},

		// Undo methods
		handleUndo() {
			this.$emit('undo')
		},

		updateSlotInfo() {
			this.hasChildren = !!this.$slots.default
		},
	},
}
</script>

<style lang="scss">
.app-navigation-entry {
	position: relative;
	display: flex;
	flex-shrink: 0;
	flex-wrap: wrap;
	box-sizing: border-box;
	width: 100%;
	min-height: $clickable-area;
	padding-right: 8px;
	border-radius: var(--border-radius-large);

	&-wrapper {
		position: relative;
		display: flex;
		flex-shrink: 0;
		flex-wrap: wrap;
		box-sizing: border-box;
		width: 100%;

		&.app-navigation-entry--collapsible:not(.app-navigation-entry--opened) > ul {
			// NO ANIMATE because if not really hidden, we can still tab through it
			display: none;
		}
	}

	// When .active class is applied, change color background of link and utils. The
	// !important prevents the focus state to override the active state.
	&.active {
		background-color: var(--color-primary-light) !important;
	}
	&:focus-within,
	&:hover {
		background-color: var(--color-background-hover);
	}
	&.active,
	&:focus-within,
	&:hover {
		.app-navigation-entry__children {
			background-color: var(--color-main-background);
		}
	}

	/* hide deletion/collapse of subitems */
	&.app-navigation-entry--deleted > ul {
		// NO ANIMATE because if not really hidden, we can still tab through it
		display: none;
	}

	&:not(.app-navigation-entry--editing) {
		.app-navigation-entry-link, .app-navigation-entry-div {
			padding-right: $icon-margin;
		}
	}

	// Main entry link
	.app-navigation-entry-link, .app-navigation-entry-div {
		z-index: 100; /* above the bullet to allow click*/
		display: flex;
		overflow: hidden;
		flex: 1 1 0;
		box-sizing: border-box;
		min-height: $clickable-area;
		padding: 0;
		white-space: nowrap;
		color: var(--color-main-text);
		background-repeat: no-repeat;
		background-position: $icon-margin center;
		background-size: $icon-size $icon-size;
		line-height: $clickable-area;

		.app-navigation-entry-icon {
			display: flex;
			align-items: center;
			flex: 0 0 $clickable-area;
			justify-content: center;
			width: $clickable-area;
			height: $clickable-area;
			background-size: $icon-size $icon-size;
		}

		.app-navigation-entry__title {
			overflow: hidden;
			max-width: 100%;
			white-space: nowrap;
			text-overflow: ellipsis;
		}

		.editingContainer {
			width: calc(100% - #{$clickable-area});
			margin: auto;
		}
	}
}
	/* Second level nesting for lists */
.app-navigation-entry__children {
	position: relative;
	display: flex;
	flex: 0 1 auto;
	flex-direction: column;
	width: 100%;

	.app-navigation-entry {
		display: inline-flex;
		flex-wrap: wrap;
		padding-left: $icon-size;
	}
}

/* Deleted entries */
.app-navigation-entry__deleted {
	display: inline-flex;
	flex: 1 1 0;
	padding-left: $clickable-area - $icon-margin !important;
	.app-navigation-entry__deleted-description {
		position: relative;
		overflow: hidden;
		flex: 1 1 0;
		white-space: nowrap;
		text-overflow: ellipsis;
		line-height: $clickable-area;
	}
}

/* Makes the icon of the collapsible element disappear
*  When hovering on the root element */
.app-navigation-entry--collapsible {
	//shows the triangle button
	.icon-collapse {
		visibility: hidden;
	}
	&.app-navigation-entry--no-icon,
	&:hover, &:focus {
		a .app-navigation-entry-icon {
			// hides the icon
			visibility: hidden;
		}
		.icon-collapse {
			//shows the triangle button
			visibility: visible;
		}
		// prevent the icon of children elements from being hidden
		// by the previous rule
		.app-navigation-entry__children li:not(.app-navigation-entry--collapsible) a :first-child {
			visibility: visible;
		}
	}
}

/* counter and actions */
.app-navigation-entry__utils {
	display: flex;
	align-items: center;
	flex: 0 1 auto;
}

/* counter */
.app-navigation-entry__counter-wrapper {
	// Add slightly more space to the right of the counter
	margin-right: 2px;
	display: flex;
	align-items: center;
	flex: 0 1 auto;
}

// STATES
/* editing state */
.app-navigation-entry--editing {
	.app-navigation-entry-edit {
		z-index: 250;
		opacity: 1;
	}
}

/* deleted state */
.app-navigation-entry--deleted {
	.app-navigation-entry-deleted {
		z-index: 250;
		transform: translateX(0);
	}
}

/* pinned state */
.app-navigation-entry--pinned {
	order: 2;
	margin-top: auto;
	// only put a marginTop auto to the first one!
	~ .app-navigation-entry--pinned {
		margin-top: 0;
	}
}

</style>
