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
			ref="nav"
			role="tablist"
			class="app-sidebar-tabs__nav"
			:class="{ 'app-sidebar-tabs__nav--legacy': isLegacy34 }"
			@keydown.left.exact.prevent.stop="focusPreviousTab"
			@keydown.right.exact.prevent.stop="focusNextTab"
			@keydown.tab.exact.prevent.stop="focusActiveTabContent"
			@keydown.home.exact.prevent.stop="focusFirstTab"
			@keydown.end.exact.prevent.stop="focusLastTab"
			@keydown.page-up.exact.prevent.stop="focusFirstTab"
			@keydown.page-down.exact.prevent.stop="focusLastTab"
			@pointerover="handleHighlight"
			@pointerleave="hideHighlight"
			@focusin="handleHighlight"
			@focusout="onHighlightFocusOut">
			<div
				v-if="highlightEnabled"
				class="app-sidebar-tabs__highlight"
				:class="{
					'app-sidebar-tabs__highlight--visible': highlightVisible,
					'app-sidebar-tabs__highlight--animated': highlightAnimated,
					'app-sidebar-tabs__highlight--over-active': highlightOverActive,
				}"
				:style="highlightStyle"
				aria-hidden="true" />
			<NcAppSidebarTabsButton
				v-for="tab in tabs"
				:id="`tab-button-${tab.id}`"
				:key="tab.id"
				class="app-sidebar-tabs__tab"
				:aria-controls="`tab-${tab.id}`"
				:selected="activeTab === tab.id"
				:animatedHighlight="highlightEnabled"
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
import { getCanonicalLocale } from '@nextcloud/l10n'
import NcAppSidebarTabsButton from './NcAppSidebarTabsButton.vue'
import { isLegacy34 } from '../../utils/legacy.ts'

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

	data(props) {
		return {
			/**
			 * Tab descriptions from the passed NcSidebarTab components' props to build the tab navbar from.
			 */
			tabs: [],
			/**
			 * Local active (open) tab's ID. It allows to use component without v-model:active
			 */
			activeTab: props.active,
			isLegacy34,
			/** Whether the sliding highlight runs (JS mounted, non-legacy design) */
			highlightEnabled: false,
			/** Whether the highlight is currently shown */
			highlightVisible: false,
			/** Whether position changes should transition (slide) or snap */
			highlightAnimated: false,
			/** Whether the highlight sits on the active tab (turns transparent) */
			highlightOverActive: false,
			/** Highlight geometry inside the tablist, in pixels */
			highlightLeft: 0,
			highlightTop: 0,
			highlightWidth: 0,
			highlightHeight: 0,
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

		highlightStyle() {
			return {
				transform: `translate(${this.highlightLeft}px, ${this.highlightTop}px)`,
				width: `${this.highlightWidth}px`,
				height: `${this.highlightHeight}px`,
			}
		},
	},

	watch: {
		tabs() {
			if (this.active) {
				this.updateActive()
			}
		},

		active(active) {
			// Prevent running it twice
			if (active !== this.activeTab) {
				this.updateActive()
			}
		},
	},

	mounted() {
		// The tab the highlight currently covers. Deliberately not in data(): a
		// reactive proxy of the element would not match the element from an event.
		this.highlightedButton = null
		// Progressive enhancement: the sliding highlight only runs once mounted,
		// and only for the current design (the legacy tabs keep their own look).
		this.highlightEnabled = !this.isLegacy34
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
			this.activeTab = (this.active && this.tabs.some(({ id }) => id === this.active))
				? this.active
				: (this.tabs[0]?.id ?? '')
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
					return a.name.localeCompare(b.name, [getCanonicalLocale()])
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

		/**
		 * Move the sliding highlight onto a tab button. It slides there if
		 * already visible, otherwise it snaps into place so it does not slide in
		 * from a previously hovered tab. Over the active tab it turns transparent
		 * so the active tab keeps its own static background.
		 *
		 * @param {HTMLElement} button the tab button element to cover
		 */
		showHighlightOn(button) {
			const buttonRect = button.getBoundingClientRect()
			const navRect = this.$refs.nav.getBoundingClientRect()
			const wasVisible = this.highlightVisible

			// Re-appearing: snap into place first so it does not slide in from the
			// tab that was hovered before
			this.highlightAnimated = wasVisible
			this.highlightOverActive = button.getAttribute('aria-selected') === 'true'
			this.highlightLeft = buttonRect.left - navRect.left
			this.highlightTop = buttonRect.top - navRect.top
			this.highlightWidth = buttonRect.width
			this.highlightHeight = buttonRect.height

			if (!wasVisible) {
				this.highlightVisible = true
				// Enable sliding again once it is in place and faded in
				this.$nextTick(() => requestAnimationFrame(() => {
					this.highlightAnimated = true
				}))
			}
		},

		/** Hide the sliding highlight */
		hideHighlight() {
			this.highlightVisible = false
			this.highlightedButton = null
		},

		/**
		 * Move the highlight to the tab button under the pointer or focus
		 *
		 * @param {Event} event the pointer or focus event
		 */
		handleHighlight(event) {
			if (!this.highlightEnabled) {
				return
			}
			const button = event.target?.closest?.('.app-sidebar-tabs__tab')
			// pointerover fires again for every element inside a tab (icon, label),
			// so skip the measuring when the highlight already covers this tab
			if (!button || button === this.highlightedButton || !this.$refs.nav.contains(button)) {
				return
			}
			this.highlightedButton = button
			this.showHighlightOn(button)
		},

		/**
		 * Hide the highlight once focus leaves the tablist entirely
		 *
		 * @param {FocusEvent} event the focusout event
		 */
		onHighlightFocusOut(event) {
			if (this.highlightEnabled && !this.$refs.nav.contains(event.relatedTarget)) {
				this.hideHighlight()
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
		position: relative;
		display: flex;
		justify-content: stretch;
		margin: 10px 8px 0 8px;
		border-bottom: 1px solid var(--color-border);
		isolation: isolate; // keep the highlight layered predictably within the nav

		&:not(&--legacy) {
			gap: var(--default-grid-baseline);
			padding-block-end: var(--default-grid-baseline);
		}
	}

	&__highlight {
		position: absolute;
		top: 0;
		// Physical left to match the physical offset computed from
		// getBoundingClientRect (see showHighlightOn), so it stays correct in RTL.
		// stylelint-disable-next-line csstools/use-logical
		left: 0;
		width: 0;
		height: 0;
		// Painted below the tab buttons (which are positioned), so it sits behind
		// the button content.
		z-index: 0;
		pointer-events: none;
		opacity: 0;
		border-radius: var(--border-radius-element);
		// Matches the hover highlight of the navigation entries.
		background-color: color-mix(in srgb, var(--color-primary-element) 8%, transparent);
		will-change: transform, width, height;
		// The fade and the background morph are always transitioned; sliding is
		// opt-in via --animated so the highlight snaps when it (re)appears.
		// Durations use --animation-quick (matching the navigation entries), which
		// the reduced-motion theme
		// collapses to 0.
		transition:
			opacity var(--animation-quick) ease-in-out,
			background-color var(--animation-quick) ease-in-out;

		&--animated {
			transition:
				transform var(--animation-quick) ease-in-out,
				width var(--animation-quick) ease-in-out,
				height var(--animation-quick) ease-in-out,
				opacity var(--animation-quick) ease-in-out,
				background-color var(--animation-quick) ease-in-out;
		}

		&--visible {
			opacity: 1;
		}

		// Over the active tab the highlight turns transparent so the active tab's
		// own background shows through, while it still slides on and off it.
		&--over-active {
			background-color: transparent;
		}
	}

	&__tab {
		position: relative; // sit above the sliding highlight
		z-index: 1;
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
