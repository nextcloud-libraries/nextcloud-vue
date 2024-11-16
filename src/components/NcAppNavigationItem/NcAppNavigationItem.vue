<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>

### Usage

#### Simple element

* With an icon:

```vue
	<template>
		<ul>
			<NcAppNavigationItem name="My name">
				<template #icon>
					<Check :size="20" />
				</template>
			</NcAppNavigationItem>
		</ul>
	</template>
	<script>
	import Check from 'vue-material-design-icons/Check.vue'

	export default {
		components: {
			Check,
		},
	}
	</script>
```
* With a spinning loader instead of the icon:

```vue
<ul>
	<NcAppNavigationItem name="Loading Item" :loading="true" />
</ul>
```
* With an active state (only needed when not using `vue-router` and the `to` property, otherwise this is set automatically)

```vue
<ul>
	<NcAppNavigationItem name="Current page" :active="true" />
</ul>
```

#### Element with actions
Wrap the children in a template. If you have more than 2 actions, a popover menu and a menu
button will be automatically created.

```vue
	<template>
		<div id="app-navigation-vue"><!-- Just a wrapper necessary in the docs. Not needed when NcAppNavigation is correctly used as parent. -->
			<ul>
				<NcAppNavigationItem name="Item with actions">
					<template #icon>
						<Check :size="20" />
					</template>
					<template #actions>
						<NcActionButton @click="alert('Edit')">
							<template #icon>
								<Pencil :size="20" />
							</template>
							Edit
						</NcActionButton>
						<NcActionButton @click="alert('Delete')">
							<template #icon>
								<Delete :size="20" />
							</template>
							Delete
						</NcActionButton>
						<NcActionLink name="Link" href="https://nextcloud.com">
							<template #icon>
								<OpenInNew :size="20" />
							</template>
						</NcActionLink>
					</template>
				</NcAppNavigationItem>
			</ul>
		</div>
	</template>
	<script>
	import Check from 'vue-material-design-icons/Check.vue'
	import Delete from 'vue-material-design-icons/Delete.vue'
	import OpenInNew from 'vue-material-design-icons/OpenInNew.vue'
	import Pencil from 'vue-material-design-icons/Pencil.vue'

	export default {
		components: {
			Check,
			Delete,
			OpenInNew,
			Pencil,
		},
	}
	</script>
```

#### Element with counter
Just nest the counter in a template within `<NcAppNavigationItem>` and add `#counter` to it.

```vue
	<template>
		<ul>
			<NcAppNavigationItem name="Item with counter">
				<template #icon>
					<Folder :size="20" />
				</template>
				<template #counter>
					<NcCounterBubble>
						99+
					</NcCounterBubble>
				</template>
			</NcAppNavigationItem>
		</ul>
	</template>
	<script>
	import Folder from 'vue-material-design-icons/Folder.vue'

	export default {
		components: {
			Folder,
		},
	}
	</script>
```

#### Element with children

Wrap the children in a template with the `slot` property and use the prop `allowCollapse` to choose wether to allow or
prevent the user from collapsing the items.

```vue
	<template>
		<ul>
			<NcAppNavigationItem name="Item with children" :allowCollapse="true" :open="true">
				<template #icon>
					<Folder :size="20" />
				</template>
				<template #counter>
					<NcCounterBubble>
						99+
					</NcCounterBubble>
				</template>
				<template #actions>
					<NcActionButton @click="alert('Edit')">
						<template #icon>
							<Pencil :size="20" />
						</template>
						Edit
					</NcActionButton>
					<NcActionButton @click="alert('Delete')">
						<template #icon>
							<Delete :size="20" />
						</template>
						Delete
					</NcActionButton>
					<NcActionLink name="Link" href="https://nextcloud.com">
						<template #icon>
							<OpenInNew :size="20" />
						</template>
					</NcActionLink>
				</template>
				<template>
					<NcAppNavigationItem name="AppNavigationItemChild1" />
					<NcAppNavigationItem name="AppNavigationItemChild2" />
					<NcAppNavigationItem name="AppNavigationItemChild3" />
					<NcAppNavigationItem name="AppNavigationItemChild4" />
				</template>
			</NcAppNavigationItem>
		</ul>
	</template>
	<script>
	import Folder from 'vue-material-design-icons/Folder.vue'
	import Delete from 'vue-material-design-icons/Delete.vue'
	import OpenInNew from 'vue-material-design-icons/OpenInNew.vue'
	import Pencil from 'vue-material-design-icons/Pencil.vue'

	export default {
		components: {
			Folder,
			Delete,
			OpenInNew,
			Pencil,
		},
	}
	</script>
```

#### Editable element
Add the prop `:editable=true` and an edit placeholder if you need it. By default
the placeholder is the previous name of the element.

```vue
	<template>
		<ul>
			<NcAppNavigationItem name="Editable Item" :editable="true"
				editPlaceholder="your_placeholder_here" @update:name="function(value){alert(value)}">
				<template #icon>
					<Folder :size="20" />
				</template>
			</NcAppNavigationItem>
		</ul>
	</template>
	<script>
	import Folder from 'vue-material-design-icons/Folder.vue'

	export default {
		components: {
			Folder,
		},
	}
	</script>
```

#### Undo element
Just set the `undo` and `name` props. When clicking the undo button, an `undo` event is emitted.

```
<ul>
	<NcAppNavigationItem :undo="true" name="Deleted important entry" @undo="alert('undo delete')"  />
</ul>
```

#### Link element
Href that start by http will be treated as external and opened in a new tab
```
<div>
	<ul>
		<NcAppNavigationItem name="Files" href="/index.php/apps/files" />
		<NcAppNavigationItem name="Nextcloud" href="https://nextcloud.com" />
	</ul>
</div>
```

#### Custom title
```
<ul>
	<NcAppNavigationItem name="Nextcloud" title="Open the Nextcloud website" href="https://nextcloud.com" />
</ul>
```

#### Pinned element
Just set the `pinned` prop.
```
<ul>
	<NcAppNavigationItem name="Pinned item" :pinned="true" />
</ul>
```
</docs>

<template>
	<li :id="id"
		:class="{
			'app-navigation-entry--opened': opened,
			'app-navigation-entry--pinned': pinned,
			'app-navigation-entry--collapsible': isCollapsible(),
		}"
		class="app-navigation-entry-wrapper">
		<component :is="isRouterLink ? 'router-link' : 'NcVNodes'"
			v-slot="{ href: routerLinkHref, navigate, isActive }"
			:custom="isRouterLink ? true : false"
			:to="to"
			:exact="isRouterLink ? exact : null">
			<div :class="{
					'app-navigation-entry--editing': editingActive,
					'app-navigation-entry--deleted': undo,
					'active': (isActive && to) || active,
				}"
				class="app-navigation-entry">
				<!-- Icon and name -->
				<a v-if="!undo"
					class="app-navigation-entry-link"
					:aria-current="active || (isActive && to) ? 'page' : undefined"
					:aria-description="ariaDescription"
					:aria-expanded="$scopedSlots.default ? opened.toString() : undefined"
					:href="href || routerLinkHref || '#'"
					:target="isExternal(href) ? '_blank' : undefined"
					:title="title || name"
					@blur="handleBlur"
					@click="onClick($event, navigate, routerLinkHref)"
					@focus="handleFocus"
					@keydown.tab.exact="handleTab">

					<!-- icon if not collapsible -->
					<!-- never show the icon over the collapsible if mobile -->
					<div :class="{ [icon]: icon }"
						class="app-navigation-entry-icon">
						<NcLoadingIcon v-if="loading" />
						<!-- @slot Slot for the optional leading icon -->
						<slot v-else name="icon" />
					</div>
					<span v-if="!editingActive" class="app-navigation-entry__name">
						{{ name }}
					</span>
					<div v-if="editingActive" class="editingContainer">
						<NcInputConfirmCancel ref="editingInput"
							v-model="editingValue"
							:placeholder="editPlaceholder !== '' ? editPlaceholder : name"
							:primary="(isActive && to) || active"
							@cancel="cancelEditing"
							@confirm="handleEditingDone" />
					</div>
				</a>

				<!-- undo entry -->
				<div v-if="undo" class="app-navigation-entry__deleted">
					<div class="app-navigation-entry__deleted-description">
						{{ name }}
					</div>
				</div>

				<!-- Counter and Actions -->
				<div v-if="hasUtils && !editingActive"
					class="app-navigation-entry__utils"
					:class="{'app-navigation-entry__utils--display-actions': forceDisplayActions || menuOpenLocalValue || menuOpen }">
					<div v-if="$scopedSlots.counter"
						class="app-navigation-entry__counter-wrapper">
						<!-- @slot Slot for the `NcCounterBubble` -->
						<slot name="counter" />
					</div>
					<NcActions v-if="$scopedSlots.actions || (editable && !editingActive) || undo"
						ref="actions"
						:inline="inlineActions"
						class="app-navigation-entry__actions"
						container="#app-navigation-vue"
						:boundaries-element="actionsBoundariesElement"
						:placement="menuPlacement"
						:open="menuOpen"
						:type="(isActive && to) || active ? 'primary' : null"
						:force-menu="forceMenu"
						:default-icon="menuIcon"
						@update:open="onMenuToggle">
						<template #icon>
							<!-- @slot Slot for the custom menu icon -->
							<slot name="menu-icon" />
						</template>
						<NcActionButton v-if="editable && !editingActive"
							:aria-label="editButtonAriaLabel"
							@click="handleEdit">
							<template #icon>
								<Pencil :size="20" />
							</template>
							{{ editLabel }}
						</NcActionButton>
						<NcActionButton v-if="undo"
							:aria-label="undoButtonAriaLabel"
							@click="handleUndo">
							<template #icon>
								<Undo :size="20" />
							</template>
						</NcActionButton>
						<!-- @slot Slot for additional `NcAction*` -->
						<slot name="actions" />
					</NcActions>
				</div>
				<NcAppNavigationIconCollapsible v-if="isCollapsible()" :open="opened" @click.prevent.stop="toggleCollapse" />

				<!-- @slot Slot for anything (virtual) that should be mounted in the component, like a related modal -->
				<slot name="extra" />
			</div>
		</component>
		<!-- Children elements -->
		<ul v-if="canHaveChildren && $scopedSlots.default" class="app-navigation-entry__children">
			<!-- @slot Slot for children -->
			<slot />
		</ul>
	</li>
</template>

<script>
import NcActions from '../NcActions/index.js'
import NcActionButton from '../NcActionButton/index.js'
import NcLoadingIcon from '../NcLoadingIcon/index.js'
import NcVNodes from '../NcVNodes/index.js'
import NcAppNavigationIconCollapsible from './NcAppNavigationIconCollapsible.vue'
import { useIsMobile } from '../../composables/useIsMobile/index.js'
import NcInputConfirmCancel from './NcInputConfirmCancel.vue'
import { t } from '../../l10n.js'
import GenRandomId from '../../utils/GenRandomId.js'

import Pencil from 'vue-material-design-icons/Pencil.vue'
import Undo from 'vue-material-design-icons/Undo.vue'

export default {
	name: 'NcAppNavigationItem',

	components: {
		NcActions,
		NcActionButton,
		NcAppNavigationIconCollapsible,
		NcInputConfirmCancel,
		NcLoadingIcon,
		NcVNodes,
		Pencil,
		Undo,
	},

	props: {
		/**
		 * If you are not using vue-router you can use the property to set this item as the active navigation entry.
		 * When using vue-router and the `to` property this is set automatically.
		 */
		active: {
			type: Boolean,
			default: false,
		},

		/**
		 * The main text content of the entry.
		 */
		name: {
			type: String,
			required: true,
		},

		/**
		 * The title attribute of the element.
		 */
		title: {
			type: String,
			default: null,
		},

		/**
		 * id attribute of the list item element
		 */
		id: {
			type: String,
			default: () => 'app-navigation-item-' + GenRandomId(),
			validator: id => id.trim() !== '',
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
			default: null,
		},

		/**
		 * A direct link. This will be used as the `href` attribute.
		 * This will ignore any `to` prop being defined.
		 */
		href: {
			type: String,
			default: null,
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
		 * Makes the name of the item editable by providing an `ActionButton`
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

		/**
		 * To be used only when the elements in the actions menu are very important
		 */
		forceDisplayActions: {
			type: Boolean,
			default: false,
		},

		/**
		 * Number of action items outside the menu
		 */
		inlineActions: {
			type: Number,
			default: 0,
		},
	},

	emits: [
		'update:menuOpen',
		'update:open',
		'update:name',
		'click',
		'undo',
	],

	setup() {
		return {
			isMobile: useIsMobile(),
		}
	},

	data() {
		return {
			editingValue: '',
			opened: this.open, // Collapsible state
			editingActive: false,
			/**
			 * Tracks the open state of the actions menu
			 */
			menuOpenLocalValue: false,
			focused: false,
			actionsBoundariesElement: undefined,
		}
	},

	computed: {
		isRouterLink() {
			return this.to && !this.href
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
			if (this.$scopedSlots.actions || this.$scopedSlots.counter || this.editable || this.undo) {
				return true
			}
			return false
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

	mounted() {
		this.actionsBoundariesElement = document.querySelector('#content-vue') || undefined
	},

	methods: {
		// sync opened menu state with prop
		onMenuToggle(state) {
			this.$emit('update:menuOpen', state)
			this.menuOpenLocalValue = state
		},
		// toggle the collapsible state
		toggleCollapse() {
			this.opened = !this.opened
			this.$emit('update:open', this.opened)
		},

		/**
		 * Handle link click
		 *
		 * @param {PointerEvent} event - Native click event
		 * @param {Function} [navigate] - VueRouter link's navigate if any
		 * @param {string} [routerLinkHref] - VueRouter link's href
		 */
		onClick(event, navigate, routerLinkHref) {
			// Always forward native event
			this.$emit('click', event)
			// Do not navigate with control keys - it is opening in a new tab
			if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
				return
			}
			// Prevent default link behaviour if it's a router-link and navigate manually
			if (routerLinkHref) {
				navigate?.(event)
				event.preventDefault()
			}
		},

		// Edition methods
		handleEdit() {
			this.editingValue = this.name
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
			this.$emit('update:name', this.editingValue)
			this.editingValue = ''
			this.editingActive = false
		},

		// Undo methods
		handleUndo() {
			this.$emit('undo')
		},

		/**
		 * Does this item have children and is collapsing allowed via the prop?
		 *
		 * @return {boolean} True, if the item can be collapsed
		 */
		isCollapsible() {
			return this.allowCollapse && !!this.$scopedSlots.default
		},

		/**
		 * Show actions upon focus
		 */
		handleFocus() {
			this.focused = true
		},

		handleBlur() {
			this.focused = false
		},

		/**
		 * This method checks if the root element of the component is focused and
		 * if that's the case it focuses the actions button if available
		 *
		 * @param {Event} e the keydown event
		 */
		handleTab(e) {
			// If there is no actions menu, do nothing.
			if (!this.$refs.actions) {
				return
			}
			if (this.focused) {
				e.preventDefault()
				this.$refs.actions.$refs.triggerButton.$el.focus()
				this.focused = false
			} else {
				this.$refs.actions.$refs.triggerButton.$el.blur()
			}
		},

		/**
		 * Is this an external link
		 *
		 * @param {string} href The link to check
		 * @return {boolean} Whether it is external or not
		 */
		isExternal(href) {
			// Match any protocol
			return href && href.match(/[a-z]+:\/\//i)
		},
	},
}
</script>

<style scoped lang="scss">
@import '../../assets/NcAppNavigationItem';
</style>
