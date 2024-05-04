<!--
  - @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
  - @copyright Copyright (c) 2020 Simon Belbeoch <simon.belbeoch@gmail.com>
  -
  - @author John Molakvoæ <skjnldsv@protonmail.com>
  - @author Ferdinand Thiessen <opensource@fthiessen.de>
  -
  - @license AGPL-3.0-or-later
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
		<div
			v-if="hasMultipleTabs"
			role="tablist"
			class="app-sidebar-tabs__nav"
			@keydown.left.exact.prevent.stop="focusPreviousTab"
			@keydown.right.exact.prevent.stop="focusNextTab"
			@keydown.tab.exact.prevent.stop="focusActiveTabContent"
			@keydown.home.exact.prevent.stop="focusFirstTab"
			@keydown.end.exact.prevent.stop="focusLastTab"
			@keydown.page-up.exact.prevent.stop="focusFirstTab"
			@keydown.page-down.exact.prevent.stop="focusLastTab">
			<NcCheckboxRadioSwitch
				v-for="tab in tabs"
				:key="tab.id"
				:aria-controls="`tab-${tab.id}`"
				:aria-selected="String(activeTab === tab.id)"
				:button-variant="true"
				:checked="activeTab === tab.id"
				:wrapper-id="`tab-button-${tab.id}`"
				:tabindex="activeTab === tab.id ? 0 : -1"
				button-variant-grouped="horizontal"
				class="app-sidebar-tabs__tab"
				:class="{ active: tab.id === activeTab }"
				role="tab"
				type="button"
				@update:checked="setActive(tab.id)">
				<span class="app-sidebar-tabs__tab-caption">
					{{ tab.name }}
				</span>
				<template #icon>
					<NcVNodes :vnodes="tab.renderIcon()">
						<span class="app-sidebar-tabs__tab-icon" :class="tab.icon" />
					</NcVNodes>
				</template>
			</NcCheckboxRadioSwitch>
		</div>

		<!-- tabs content -->
		<div
			:class="{ 'app-sidebar-tabs__content--multiple': hasMultipleTabs }"
			class="app-sidebar-tabs__content">
			<!-- @slot Tabs content - NcAppSidebarTab components or any content if there is no tabs -->
			<slot />
		</div>
	</div>
</template>

<script>
import NcVNodes from '../NcVNodes/index.js'
import NcCheckboxRadioSwitch from '../NcCheckboxRadioSwitch/index.js'

export default {
	name: 'NcAppSidebarTabs',

	components: {
		NcCheckboxRadioSwitch,
		NcVNodes,
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
			this.activeTab =
				this.active && this.tabs.some((tab) => tab.id === this.active)
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

		// Override checkbox-radio-switch styles so that it looks like tabs
		& :deep(.checkbox-radio-switch--button-variant) {
			border: unset !important;
			border-radius: 0 !important;
			.checkbox-content {
				padding: var(--default-grid-baseline);
				border-radius: var(--default-grid-baseline)
					var(--default-grid-baseline) 0 0 !important;
				margin: 0 !important;
				border-bottom: var(--default-grid-baseline) solid transparent !important;
				.checkbox-content__icon--checked > * {
					color: var(--color-main-text) !important;
				}
			}
			&.checkbox-radio-switch--checked .checkbox-radio-switch__content {
				background: transparent !important;
				color: var(--color-main-text) !important;
				border-bottom: var(--default-grid-baseline) solid
					var(--color-primary-element) !important;
			}
		}
	}

	&__tab {
		flex: 1 1;
		&.active {
			color: var(--color-primary-element);
		}

		&-caption {
			flex: 0 1 100%;
			width: 100%;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			text-align: center;
		}

		&-icon {
			display: flex;
			align-items: center;
			justify-content: center;
			background-size: 20px;
		}

		// Override max-width to use all available space
		:deep(.checkbox-radio-switch__content) {
			max-width: unset;
		}
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
