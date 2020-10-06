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
	<div class="app-sidebar-tabs">
		<!-- tabs navigation -->
		<nav v-if="hasMultipleTabs"
			class="app-sidebar-tabs__nav"
			@keydown.left.exact.prevent="focusPreviousTab"
			@keydown.right.exact.prevent="focusNextTab"
			@keydown.tab.exact.prevent="focusActiveTabContent"
			@keydown.page-up.exact.prevent="focusFirstTab"
			@keydown.page-down.exact.prevent="focusLastTab">
			<ul>
				<li v-for="tab in tabs" :key="tab.id" class="app-sidebar-tabs__tab">
					<a :id="tab.id"
						:aria-controls="`tab-${tab.id}`"
						:aria-selected="activeTab === tab.id"
						:class="{ active: activeTab === tab.id }"
						:data-id="tab.id"
						:href="`#tab-${tab.id}`"
						:tabindex="activeTab === tab.id ? null : -1"
						role="tab"
						@click.prevent="setActive">
						<span :class="tab.icon" class="app-sidebar-tabs__tab-icon" />
						{{ tab.name }}
					</a>
				</li>
			</ul>
		</nav>

		<!-- tabs content -->
		<div :class="{'app-sidebar-tabs__content--multiple': hasMultipleTabs}"
			class="app-sidebar-tabs__content">
			<slot />
		</div>
	</div>
</template>

<script>
import Vue from 'vue'

const IsValidString = function(value) {
	return value && typeof value === 'string' && value.trim() !== ''
}

const IsValidStringWithoutSpaces = function(value) {
	return value && typeof value === 'string' && value.trim() !== '' && value.indexOf(' ') === -1
}

export default {
	name: 'AppSidebarTabs',
	props: {
		/**
		 * Id of the tab to activate
		 */
		active: {
			type: String,
			default: '',
		},
	},

	data() {
		return {
			/**
			 * The tab component instances to build the tab navbar from.
			 */
			tabs: [],
			/**
			 * The id of the currently active tab.
			 */
			activeTab: '',
			/**
			 * Dummy array to react on slot changes.
			 */
			children: [],
		}
	},

	computed: {
		hasMultipleTabs() {
			return this.tabs.length > 1
		},
		currentTabIndex() {
			return this.tabs.findIndex(tab => tab.id === this.activeTab)
		},
	},

	watch: {
		active(active) {
			// Prevent running it twice
			if (active !== this.activeTab) {
				this.updateActive()
			}
		},

		children() {
			this.updateTabs()
		},
	},

	mounted() {
		// Init the tabs list
		this.updateTabs()

		// Let's make the children list reactive
		this.children = this.$children
	},

	methods: {

		/**
		 * Set the current active tab
		 */
		setActive({ target }) {
			// if click on icon, make sure we get the link
			const id = target.closest('a').dataset.id
			this.activeTab = id
			this.$emit('update:active', this.activeTab)

		},

		/**
		 * Focus the previous tab
		 * and emit to the parent component
		 */
		focusPreviousTab() {
			if (this.currentTabIndex > 0) {
				this.activeTab = this.tabs[this.currentTabIndex - 1].id
				this.$emit('update:active', this.activeTab)
			}
			this.focusActiveTab() // focus nav item
		},

		/**
		 * Focus the next tab
		 * and emit to the parent component
		 */
		focusNextTab() {
			if (this.currentTabIndex < this.tabs.length - 1) {
				this.activeTab = this.tabs[this.currentTabIndex + 1].id
				this.$emit('update:active', this.activeTab)
			}
			this.focusActiveTab() // focus nav item
		},

		/**
		 * Focus the first tab
		 * and emit to the parent component
		 */
		focusFirstTab() {
			this.activeTab = this.tabs[0].id
			this.$emit('update:active', this.activeTab)
			this.focusActiveTab() // focus nav item
		},

		/**
		 * Focus the last tab
		 * and emit to the parent component
		 */
		focusLastTab() {
			this.activeTab = this.tabs[this.tabs.length - 1].id
			this.$emit('update:active', this.activeTab)
			this.focusActiveTab() // focus nav item
		},

		/**
		 * Focus the current active tab
		 */
		focusActiveTab() {
			this.$el.querySelector('#' + this.activeTab).focus()
		},

		/**
		 * Focus the content on tab
		 * see aria accessibility guidelines
		 */
		focusActiveTabContent() {
			this.$el.querySelector('#tab-' + this.activeTab).focus()
		},

		/**
		 * Update the current active tab
		 */
		updateActive() {
			this.activeTab = this.active
				&& this.tabs.findIndex(tab => tab.id === this.active) !== -1
				? this.active
				: this.tabs.length > 0
					? this.tabs[0].id
					: ''
		},

		/**
		 * Manually update the sidebar tabs according to $slots.default
		 */
		updateTabs() {
			if (!this.$slots.default) {
				this.tabs = []
				return
			}

			// Find all valid children (AppSidbarTab, other components, text nodes, etc.)
			const children = this.$slots.default.filter(elem => elem.tag || elem.text.trim())

			// Find all valid instances of AppSidebarTab
			const invalidTabs = []
			const tabs = children.reduce((tabs, tabNode) => {
				const tab = tabNode.componentInstance
				// Make sure all required props are provided and valid
				if (IsValidString(tab?.name)
					&& IsValidStringWithoutSpaces(tab?.id)
					&& IsValidStringWithoutSpaces(tab?.icon)) {
					tabs.push(tab)
				} else {
					invalidTabs.push(tabNode)
				}
				return tabs
			}, [])

			// Tabs are optional, but you can use either tabs or non-tab-content only
			if (tabs.length !== 0 && tabs.length !== children.length) {
				Vue.util.warn('Mixing tabs and non-tab-content is not possible.')
				invalidTabs.map(invalid => console.debug('Ignoring invalid tab', invalid))
			}

			// We sort the tabs by their order or by their name
			this.tabs = tabs.sort((a, b) => {
				const orderA = a.order || 0
				const orderB = b.order || 0
				if (orderA === orderB) {
					return OC.Util.naturalSortCompare(a.name, b.name)
				}
				return orderA - orderB
			})

			// Init active tab if exists
			if (this.tabs.length > 0) {
				this.updateActive()
			}
		},
	},
}
</script>
<style lang="scss" scoped>
.app-sidebar-tabs {
	flex: 1 1 auto;
	display: flex;
	flex-direction: column;

	&__nav {
		margin-top: 10px;
		ul {
			display: flex;
			justify-content: stretch;
		}
	}
	&__tab {
		display: block;
		flex: 1 1;
		min-width: 0;
		text-align: center;
		a {
			position: relative;
			display: block;
			overflow: hidden;
			padding: 25px 5px 5px 5px;
			transition: color var(--animation-quick), opacity var(--animation-quick), border-color var(--animation-quick);
			text-align: center;
			white-space: nowrap;
			text-overflow: ellipsis;
			opacity: $opacity_normal;
			color: var(--color-main-text);
			border-bottom: 1px solid var(--color-border);

			&:hover,
			&:focus,
			&:active,
			&.active {
				opacity: $opacity_full;
				.app-sidebar-tabs__tab-icon {
					opacity: $opacity_full;
				}
			}
			&:not(.active):hover,
			&:not(.active):focus {
				border-bottom-color: var(--color-background-darker);
				box-shadow: inset 0 -1px 0 var(--color-background-darker);
			}
			&.active {
				color: var(--color-text-light);
				border-bottom-color: var(--color-text-light);
				box-shadow: inset 0 -1px 0 var(--color-text-light);
				font-weight: bold;
			}
			// differentiate the two for accessibility purpose
			// make sure the user knows she's focusing the navigation
			// and can use arrows/home/pageup...
			&:focus {
				border-bottom-color: var(--color-primary-element);
				box-shadow: inset 0 -1px 0 var(--color-primary-element);
			}
		}
	}

	&__tab-icon {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 25px;
		transition: opacity var(--animation-quick);
		opacity: $opacity_normal;
		background-position: center 8px;
		background-size: 16px;
	}

	&__content {
		position: relative;
		// take full available height
		flex: 1 1 100%;
		// force the use of the tab component if more than one tab
		// you can just put raw content if you don't use tabs
		&--multiple > :not(section) {
			display: none;
		}
	}
}
</style>
