<!--
  - @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
  - @copyright Copyright (c) 2020 Simon Belbeoch <simon.belbeoch@gmail.com>
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
		<!-- 33 and 34 code is for page up and page down -->
		<nav v-if="hasMultipleTabs"
			role="tablist"
			class="app-sidebar-tabs__nav"
			@keydown.left.exact.prevent="focusPreviousTab"
			@keydown.right.exact.prevent="focusNextTab"
			@keydown.tab.exact.prevent="focusActiveTabContent"
			@keydown.home.exact.prevent="focusFirstTab"
			@keydown.end.exact.prevent="focusLastTab"
			@keydown.33.exact.prevent="focusFirstTab"
			@keydown.34.exact.prevent="focusLastTab">
			<ul>
				<li v-for="tab in tabs" :key="tab.id" class="app-sidebar-tabs__tab">
					<a :id="tab.id"
						:aria-controls="`tab-${tab.id}`"
						:aria-selected="activeTab === tab.id"
						:class="{ active: activeTab === tab.id }"
						:data-id="tab.id"
						:href="`#tab-${tab.id}`"
						:tabindex="activeTab === tab.id ? 0 : -1"
						role="tab"
						@click.prevent="setActive(tab.id)">
						<span class="app-sidebar-tabs__tab-icon">
							<NcVNodes :vnodes="tab.renderIcon()" />
						</span>
						{{ tab.name }}
					</a>
				</li>
			</ul>
		</nav>

		<!-- tabs content -->
		<div :class="{'app-sidebar-tabs__content--multiple': hasMultipleTabs}"
			class="app-sidebar-tabs__content">
			<!-- @slot Tabs content - NcAppSidebarTab components or any content if there is no tabs -->
			<slot />
		</div>
	</div>
</template>

<script>
import NcVNodes from '../NcVNodes/index.js'

export default {
	name: 'NcAppSidebarTabs',

	components: {
		NcVNodes,
	},

	provide() {
		return {
			registerTab: this.registerTab,
			unregisterTab: this.unregisterTab,
			// Getter as an alternative to Vue 2.7 computed(() => this.activeTab)
			getActiveTab: () => this.activeTab,
		}
	},

	props: {
		/**
		 * Id of the tab to activate
		 */
		active: {
			type: String,
			default: '',
		},
	},

	emits: ['update:active'],

	data() {
		return {
			/**
			 * Tab descriptions from the passed NcSidebarTab components' props to build the tab navbar from.
			 */
			tabs: [],
			/**
			 * Local active (open) tab's ID. It allows to use component without active.sync
			 */
			activeTab: '',
		}
	},

	computed: {
		/**
		 * Has multiple tabs. If only one tab - its content is shown without navigation
		 *
		 * @return {boolean}
		 */
		hasMultipleTabs() {
			return this.tabs.length > 1
		},

		currentTabIndex() {
			return this.tabs.findIndex((tab) => tab.id === this.activeTab)
		},
	},

	watch: {
		active(active) {
			// Prevent running it twice
			if (active !== this.activeTab) {
				this.updateActive()
			}
		},
	},

	methods: {

		/**
		 * Set the current active tab
		 *
		 * @param {string} id the id of the tab
		 */
		setActive(id) {
			this.activeTab = id
			/**
			 * @property {string} active - active tab's id
			 */
			this.$emit('update:active', this.activeTab)
		},

		/**
		 * Focus the previous tab
		 * and emit to the parent component
		 */
		focusPreviousTab() {
			if (this.currentTabIndex > 0) {
				this.setActive(this.tabs[this.currentTabIndex - 1].id)
			}
			this.focusActiveTab()
		},

		/**
		 * Focus the next tab
		 * and emit to the parent component
		 */
		focusNextTab() {
			if (this.currentTabIndex < this.tabs.length - 1) {
				this.setActive(this.tabs[this.currentTabIndex + 1].id)
			}
			this.focusActiveTab()
		},

		/**
		 * Focus the first tab
		 * and emit to the parent component
		 */
		focusFirstTab() {
			this.setActive(this.tabs[0].id)
			this.focusActiveTab()
		},

		/**
		 * Focus the last tab
		 * and emit to the parent component
		 */
		focusLastTab() {
			this.setActive(this.tabs[this.tabs.length - 1].id)
			this.focusActiveTab()
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
			&& this.tabs.some(tab => tab.id === this.active)
				? this.active
				: this.tabs.length > 0
					? this.tabs[0].id
					: ''
		},

		/**
		 * Register child tab in the tabs
		 *
		 * @param {object} tab child tab passed to slot
		 */
		registerTab(tab) {
			this.tabs.push(tab)
			this.tabs.sort((a, b) => {
				if (a.order === b.order) {
					return OC.Util.naturalSortCompare(a.name, b.name)
				}
				return a.order - b.order
			})
			if (!this.activeTab) {
				this.updateActive()
			}
		},

		/**
		 * Unregister child tab from the tabs
		 *
		 * @param {string} id tab's id
		 */
		unregisterTab(id) {
			const tabIndex = this.tabs.findIndex((tab) => tab.id === id)
			if (tabIndex !== -1) {
				this.tabs.splice(tabIndex, 1)
			}
			if (this.activeTab === id) {
				this.updateActive()
			}
		},
	},
}
</script>
<style lang="scss" scoped>
.app-sidebar-tabs {
	display: flex;
	flex-direction: column;
	min-height: 0;
	flex: 1 1 100%;

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
				color: var(--color-main-text);
				border-bottom-color: var(--color-main-text);
				box-shadow: inset 0 -1px 0 var(--color-main-text);
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

		& > span {
			display: flex;
			align-items: center;
			justify-content: center;
			background-size: 16px;
		}
	}

	&__content {
		position: relative;
		// take full available height
		min-height: 0;
		height: 100%;
		// force the use of the tab component if more than one tab
		// you can just put raw content if you don't use tabs
		&--multiple > :not(section) {
			display: none;
		}
	}
}
</style>
