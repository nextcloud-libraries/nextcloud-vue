<!--
  - @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
  -
  - @author John Molakvoæ <skjnldsv@protonmail.com>
  - @author Marco Ambrosini <marcoambrosini@pm.me>
  - @author Jonas Sulzer <jonas@violoncello.ch>
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
<AppNavigationItem title="My title" icon="icon-category-enabled">

```
* With a spinning loader instead of the icon:

<AppNavigationItem title="Loading Item" :loading="true" />

### Element with actions
Wrap the children in a template. If you have more than 2 actions, a popover menu and a menu
button will be automatically created.

```
<AppNavigationItem title="Item with actions" icon="icon-category-enabled">
	<template slot="actions">
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
Just nest the counter into <AppNavigationItem> and add `slot="counter"` to it.

```
<AppNavigationItem title="Item with counter" icon="icon-folder">
	<AppNavigationCounter slot="counter">
		99+
	</AppNavigationCounter>
</AppNavigationItem>
```

### Element with children

Wrap the children in a template with the `slot` property and use the prop `allowCollapse` to choose wether to allow or
prevent the user from collapsing the items.

```
<AppNavigationItem title="Item with children" :allowCollapse="true" :open="true">
	<template>
		<AppNavigationItem title="AppNavigationItemChild1" />
		<AppNavigationItem class="active" title="AppNavigationItemChild2" />
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
	editPlaceholder="your_placeholder_here" />
```

### New Item element
Add the prop `:new-item=true`.

```
<AppNavigationItem title="New Item" icon="icon-add" :new-item="true" @new-item="alert('new-item')" />
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
	<!-- Navigation item, can be either an <li> or a <router-link> depending on the props -->
	<nav-element v-bind="navElement"
		:class="{
			'app-navigation-entry--no-icon': !isIconShown,
			'app-navigation-entry--opened': opened,
			'app-navigation-entry--pinned': pinned,
			'app-navigation-entry--editing' : editing,
			'app-navigation-entry--deleted': undo,
			'app-navigation-entry--collapsible': collapsible,
			'active': isActive
		}"
		class="app-navigation-entry">
		<!-- Icon and title -->
		<a v-if="!undo && !newItem && !editing"
			class="app-navigation-entry-link"
			href="#"
			@click="onClick">

			<!-- icon if not collapsible -->
			<!-- never show the icon over the collapsible if mobile -->
			<div :class="{ 'icon-loading-small': loading, [icon]: icon && isIconShown }"
				class="app-navigation-entry-icon">
				<slot v-if="!loading" v-show="isIconShown" name="icon" />
			</div>
			<span class="app-navigation-entry__title" :title="title">
				{{ title }}
			</span>
		</a>

		<AppNavigationIconCollapsible v-if="collapsible" :open="opened" @click.prevent.stop="toggleCollapse" />
		<!-- undo entry -->
		<div v-if="undo" class="app-navigation-entry__deleted">
			<div class="app-navigation-entry__deleted-description">
				{{ title }}
			</div>
		</div>

		<!-- New Item -->
		<div v-if="newItem" class="app-navigation-entry-div" @click="handleEdit">
			<div :class="{ 'icon-loading-small': loading, [icon]: icon && isIconShown }"
				class="app-navigation-entry-icon">
				<slot v-if="!loading" v-show="isIconShown" name="icon" />
			</div>

			<span v-if="!editing" class="app-navigation-entry__title" :title="title">
				{{ title }}
			</span>

			<!-- inline input -->
			<div v-if="editing" class="app-navigation-entry__inline-input-container">
				<form @submit.prevent="handleEditDone" @keydown.esc.exact.prevent="cancelEdit">
					<input ref="inputTitle"
						v-model="inlineInputValue"
						type="text"
						class="app-navigation-entry__inline-input"
						:placeholder="editPlaceholder !== '' ? editPlaceholder : title">
					<button type="submit"
						class="icon-confirm"
						@click.stop.prevent="handleEditDone" />
					<button type="reset"
						class="icon-close"
						@click.stop.prevent="cancelEdit" />
				</form>
			</div>
		</div>

		<!-- Counter and Actions -->
		<div v-if="hasUtils" class="app-navigation-entry__utils">
			<slot name="counter" />
			<Actions menu-align="right"
				:open="menuOpen"
				:force-menu="forceMenu"
				:default-icon="menuIcon"
				@update:open="onMenuToggle">
				<ActionButton v-if="editable && !editing" icon="icon-rename" @click="handleEdit">
					{{ editLabel }}
				</ActionButton>
				<ActionButton v-if="undo" icon="app-navigation-entry__deleted-button icon-history" @click="handleUndo" />
				<slot name="actions" />
			</Actions>
		</div>

		<!-- Children elements -->
		<ul v-if="canHaveChildren && hasChildren" class="app-navigation-entry__children">
			<slot />
		</ul>
	</nav-element>
</template>

<script>
import { directive as ClickOutside } from 'v-click-outside'
import Actions from '../Actions/Actions'
import ActionButton from '../ActionButton/ActionButton'
import AppNavigationIconCollapsible from './AppNavigationIconCollapsible'
import isMobile from '../../mixins/isMobile'

export default {
	name: 'AppNavigationItem',

	components: {
		Actions,
		ActionButton,
		AppNavigationIconCollapsible,
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
		* component a <router-link /> that points to that route.
		* By leaving this blank, the root element will be a <li>.
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
		newItem: {
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
		* Only for 'editable' items, sets placeholder text for the editing form.
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
	},

	data() {
		return {
			inlineInputValue: '',
			opened: this.open,
			editing: false,
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
		hasChildren() {
			if (this.$slots.default) {
				return true
			} else {
				return false
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
		// li or router-link
		navElement() {
			if (this.to) {
				return {
					is: 'router-link',
					tag: 'li',
					to: this.to,
					exact: this.exact,
				}
			}
			return {
				is: 'li',
			}
		},
		isActive() {
			return this.to && this.$route === this.to
		},
	},
	watch: {
		open(newVal) {
			this.opened = newVal
		},
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
			if (this.editable) {
				this.inlineInputValue = this.title
			}
			if (this.editable || this.newItem) {
				this.editing = true
				this.onMenuToggle(false)
				this.$nextTick(() => {
					this.$refs.inputTitle.focus()
				})
			}
		},
		cancelEdit() {
			this.editing = false
		},
		handleEditDone() {
			if (this.editable) {
				this.handleRename()
			} else if (this.newItem) {
				this.handleNewItem()
			}
		},
		handleRename() {
			this.$emit('update:title', this.inlineInputValue)
			this.inlineInputValue = ''
			this.editing = false
		},
		handleNewItem() {
			this.$emit('new-item', this.inlineInputValue)
			this.inlineInputValue = ''
			this.editing = false
		},

		// Undo methods
		handleUndo() {
			this.$emit('undo')
		},
	},
}
</script>

<style lang="scss" scoped>
@import '../../fonts/scss/iconfont-vue';

.app-navigation-entry {
	position: relative;
	display: flex;
	flex-shrink: 0;
	flex-wrap: wrap;
	order: 1;
	box-sizing: border-box;
	width: 100%;
	min-height: $clickable-area;

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
	&.app-navigation-entry--deleted,
	&.app-navigation-entry--collapsible:not(.app-navigation-entry--opened) {
		> ul {
			// NO ANIMATE because if not really hidden, we can still tab through it
			display: none;
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
		padding-right: $icon-margin;
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
			padding-left: 6px;
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
			padding-left: $clickable-area - $icon-margin;
		}
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

.app-navigation-entry__inline-input-container {
	flex: 1 0 100%;
	max-width: calc(100% - #{$clickable-area});
	margin: auto;
	/* Ugly hack for overriding the main entry link */
	/* align the input correctly with the link text
	44px-6px padding for the input */
	/*padding-left: $clickable-area - $icon-margin - 6px !important;*/
	form {
		display: flex;
		.app-navigation-entry__inline-input {
			flex: 1 1 100%;
			font-size: 14px;
		}

		// submit and cancel buttons
		button {
			display: flex;
			align-items: center;
			justify-content: center;
			width: $clickable-area !important;
			color: var(--color-main-text);
			background: none;
			font-size: 16px;

			// icon hover/focus feedback
			&::before {
				opacity: $opacity_normal;
			}
			&:hover,
			&:focus {
				&::before {
					opacity: $opacity_full;
				}
			}

			&.icon-confirm {
				@include iconfont('confirm');
			}

			&.icon-close {
				@include iconfont('close');
			}
		}
		.icon-close {
			margin: 0;
			border: none;
			background-color: transparent;
		}
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
	// visually balance the menu so it's not
	// stuck to the scrollbar
	.action-item {
		margin-right: 2px;
	}
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
