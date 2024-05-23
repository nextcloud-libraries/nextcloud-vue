<!--
  - @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
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
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
  -
  -->

<!-- Follows the tab aria guidelines
	https://www.w3.org/TR/wai-aria-practices/examples/tabs/tabs-1/tabs.html -->

<template>
	<section :id="`tab-${id}`"
		:class="{'app-sidebar__tab--active': isActive}"
		:aria-hidden="!isActive"
		:aria-label="isTablistShown() ? undefined : name"
		:aria-labelledby="isTablistShown() ? `tab-button-${id}` : undefined"
		class="app-sidebar__tab"
		:tabindex="isTablistShown() ? 0 : -1"
		:role="isTablistShown() ? 'tabpanel' : undefined"
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
		 * Tab icon's html class in navigation. Used if #icon slot is not provided
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
		'bottom-reached',
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

	beforeDestroy() {
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
				this.$emit('bottom-reached', event)
			}
			/**
			 * @property {Event} event Native scroll event
			 */
			this.$emit('scroll', event)
		},

		/**
		 * Render tab's icon slot if any
		 *
		 * @return {import('vue').VNode[]}
		 */
		renderIcon() {
			return this.$scopedSlots.icon?.()
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
