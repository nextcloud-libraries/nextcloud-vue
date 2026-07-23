<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<!-- Follows the tab aria guidelines
	https://www.w3.org/TR/wai-aria-practices/examples/tabs/tabs-1/tabs.html -->

<docs>
A tab of the `NcAppSidebar`. The default slot is the tab panel content.

### Tab icon

The `icon` slot renders the icon in the tab navigation. It is passed whether the
tab is currently active, so a filled icon variant can be used for the active tab
and an outlined one for the others. The two are crossfaded on selection.

```vue
<NcAppSidebarTab id="settings" name="Settings">
	<template #icon="{ selected }">
		<IconCog v-if="selected" :size="20" />
		<IconCogOutline v-else :size="20" />
	</template>
	Settings tab content
</NcAppSidebarTab>
```

Passing a single icon is still supported - it is then used for both states.
</docs>

<template>
	<section
		:id="`tab-${id}`"
		:aria-hidden="!isActive"
		:aria-label="isTablistShown() ? undefined : name"
		:aria-labelledby="isTablistShown() ? `tab-button-${id}` : undefined"
		class="app-sidebar__tab"
		:class="{ 'app-sidebar__tab--active': isActive }"
		:role="isTablistShown() ? 'tabpanel' : undefined"
		:tabindex="isTablistShown() ? 0 : -1"
		@scroll="onScroll">
		<h3 class="hidden-visually">
			{{ name }}
		</h3>
		<!-- @slot Tab panel content -->
		<slot />
	</section>
</template>

<script>
export default {
	name: 'NcAppSidebarTab',

	inject: ['registerTab', 'unregisterTab', 'getActiveTab', 'isTablistShown'],

	props: {
		/**
		 * Unique id of the sidebar tab
		 */
		id: {
			type: String,
			required: true,
		},

		/**
		 * Tab name in navigation
		 */
		name: {
			type: String,
			required: true,
		},

		/**
		 * Tab icon's html class in navigation. Used if #icon slot is not provided.
		 *
		 * The #icon slot receives the tab's active state as `{ selected }`, so a
		 * filled icon variant can be rendered for the active tab.
		 */
		icon: {
			type: String,
			default: '',
		},

		/**
		 * Tab order in navigation. If not provided, name is used.
		 */
		order: {
			type: Number,
			default: 0,
		},
	},

	emits: [
		'bottomReached',
		'scroll',
	],

	expose: ['id', 'name', 'icon', 'order', 'renderIcon'],

	computed: {
		/**
		 * Is the current tab an active tab, that should be shown?
		 *
		 * @return {boolean}
		 */
		isActive() {
			return this.getActiveTab() === this.id
		},
	},

	created() {
		// As the tab is created - register it in the tabs component
		// It's better to provide computed tab object, not component instance as it easy
		this.registerTab(this)
	},

	beforeUnmount() {
		// Unregister the tab from tabs
		this.unregisterTab(this.id)
	},

	methods: {
		onScroll(event) {
			// Are we scrolled to the very bottom ?
			if (this.$el.scrollHeight - this.$el.scrollTop === this.$el.clientHeight) {
				/**
				 * Bottom scroll is reached
				 *
				 * @property {Event} event Native scroll event
				 */
				this.$emit('bottomReached', event)
			}
			/**
			 * @property {Event} event Native scroll event
			 */
			this.$emit('scroll', event)
		},

		/**
		 * Render tab's icon slot if any.
		 * The active state is passed to the slot so consumers can render a
		 * filled icon variant for the active tab, e.g.
		 * `<template #icon="{ selected }">`.
		 *
		 * @param {boolean} selected whether the tab is currently active
		 * @return {import('vue').VNode[]}
		 */
		renderIcon(selected = false) {
			return this.$slots.icon?.({ selected })
		},
	},
}
</script>

<style lang="scss" scoped>
.app-sidebar__tab {
	display: none;
	padding: 10px;
	min-height: 100%; // fill available height
	max-height: 100%; // scroll inside
	height: 100%;
	overflow: auto;

	&:focus {
		border-color: var(--color-primary-element);
		box-shadow: 0 0 0.2em var(--color-primary-element);
		outline: 0;
	}

	&--active {
		display: block;
	}
}
</style>
