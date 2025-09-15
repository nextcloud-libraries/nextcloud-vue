<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<!-- Follows the tab aria guidelines
	https://www.w3.org/TR/wai-aria-practices/examples/tabs/tabs-1/tabs.html -->
<template>
	<div class="app-sidebar-tabs">
		<!-- tabs navigation -->
		<!-- 33 and 34 code is for page up and page down -->
		<div
			v-if="hasMultipleTabs || showForSingleTab"
			role="tablist"
			class="app-sidebar-tabs__nav"
			@keydown.left.exact.prevent.stop="focusPreviousTab"
			@keydown.right.exact.prevent.stop="focusNextTab"
			@keydown.tab.exact.prevent.stop="focusActiveTabContent"
			@keydown.home.exact.prevent.stop="focusFirstTab"
			@keydown.end.exact.prevent.stop="focusLastTab"
			@keydown.page-up.exact.prevent.stop="focusFirstTab"
			@keydown.page-down.exact.prevent.stop="focusLastTab">
			<NcAppSidebarTabsButton
				v-for="tab in tabs"
				:id="`tab-button-${tab.id}`"
				:key="tab.id"
				class="app-sidebar-tabs__tab"
				:aria-controls="`tab-${tab.id}`"
				:selected="activeTab === tab.id"
				:tab
				@update:selected="setActive(tab.id)" />
		</div>

		<!-- tabs content -->
		<div
			class="app-sidebar-tabs__content"
			:class="{ 'app-sidebar-tabs__content--multiple': hasMultipleTabs }">
			<!-- @slot Tabs content - NcAppSidebarTab components or any content if there is no tabs -->
			<slot />
		</div>
	</div>
</template>

<script>
import NcAppSidebarTabsButton from './NcAppSidebarTabsButton.vue'

export default {
	name: 'NcAppSidebarTabs',

	components: {
		NcAppSidebarTabsButton,
	},

	provide() {
		return {
			registerTab: this.registerTab,
			unregisterTab: this.unregisterTab,
			// Getter as an alternative to Vue 2.7 computed(() => this.activeTab)
			getActiveTab: () => this.activeTab,
			// Used to check whether the tab header is shown so the tabs can reference the tab header for `aria-labelledby` or not
			isTablistShown: () => this.hasMultipleTabs,
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

		/**
		 * Force the tab navigation to display even if there is only one tab
		 */
		forceTabs: {
			type: Boolean,
			default: false,
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
			 * Local active (open) tab's ID. It allows to use component without v-model:active
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

		showForSingleTab() {
			return this.forceTabs && this.tabs.length === 1
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
			this.$el.querySelector(`#tab-button-${this.activeTab}`).focus()
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
			this.activeTab = (this.active && this.tabs.some((tab) => tab.id === this.active))
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
			this.updateActive()
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
		display: flex;
		justify-content: stretch;
		margin: 10px 8px 0 8px;
		border-bottom: 1px solid var(--color-border);
	}

	&__tab {
		flex: 1 1 1px;
	}

	&__content {
		position: relative;
		min-height: 256px;
		height: 100%;
		// force the use of the tab component if more than one tab
		// you can just put raw content if you don't use tabs
		&--multiple > :not(section) {
			display: none;
		}
	}
}
</style>
