<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { Slot } from 'vue'
import type NcAppSidebarTab from '../NcAppSidebarTab/NcAppSidebarTab.vue'

import { getCanonicalLocale } from '@nextcloud/l10n'
import { computed, nextTick, onMounted, provide, ref, useTemplateRef, watch } from 'vue'
import NcAppSidebarTabsButton from './NcAppSidebarTabsButton.vue'
import { isLegacy34 } from '../../utils/legacy.ts'

type SidebarTab = InstanceType<typeof NcAppSidebarTab>

const { active = '', forceTabs = false } = defineProps<{
	/**
	 * Id of the tab to activate
	 */
	active?: string

	/**
	 * Force the tab navigation to display even if there is only one tab
	 */
	forceTabs?: boolean
}>()

const emit = defineEmits<{
	/**
	 * Emitted when the active tab changes
	 *
	 * @param active - The id of the active tab
	 */
	'update:active': [active: string]
}>()

defineSlots<{
	/**
	 * Tabs content - NcAppSidebarTab components or any content if there is no tabs
	 */
	default?: Slot
}>()

defineExpose({ focusActiveTabContent })

const rootElement = useTemplateRef('root')
const navElement = useTemplateRef('nav')

/**
 * Tab descriptions from the passed NcSidebarTab components' props to build the tab navbar from.
 */
const tabs = ref<SidebarTab[]>([])

/**
 * Local active (open) tab's ID. It allows to use component without v-model:active
 */
const activeTab = ref(active)

/**
 * Has multiple tabs. If only one tab - its content is shown without navigation
 */
const hasMultipleTabs = computed(() => tabs.value.length > 1)
const showForSingleTab = computed(() => forceTabs && tabs.value.length === 1)
const currentTabIndex = computed(() => tabs.value.findIndex((tab) => tab.id === activeTab.value))

watch(() => active, (newActive) => {
	// Prevent running it twice
	if (newActive !== activeTab.value) {
		updateActive()
	}
})

provide('registerTab', registerTab)
provide('unregisterTab', unregisterTab)
provide('getActiveTab', () => activeTab.value)
// Used to check whether the tab header is shown so the tabs can reference the tab header for `aria-labelledby` or not
provide('isTablistShown', () => hasMultipleTabs.value)

/** Whether the sliding highlight runs (JS mounted, non-legacy design) */
const highlightEnabled = ref(false)
/** Whether the highlight is currently shown */
const highlightVisible = ref(false)
/** Whether position changes should transition (slide) or snap */
const highlightAnimated = ref(false)
/** Whether the highlight sits on the active tab (turns transparent) */
const highlightOverActive = ref(false)
/** Highlight geometry inside the tablist, in pixels */
const highlightRect = ref({ left: 0, top: 0, width: 0, height: 0 })
const highlightStyle = computed(() => ({
	transform: `translate(${highlightRect.value.left}px, ${highlightRect.value.top}px)`,
	width: `${highlightRect.value.width}px`,
	height: `${highlightRect.value.height}px`,
}))

/**
 * The tab the highlight currently covers.
 * Deliberately not reactive: a reactive proxy of the element would not match the element from an event.
 */
let highlightedButton: Element | null = null

onMounted(() => {
	// Progressive enhancement: the sliding highlight only runs once mounted,
	// and only for the current design (the legacy tabs keep their own look).
	highlightEnabled.value = !isLegacy34
})

/**
 * Set the current active tab
 *
 * @param id - The id of the tab
 */
function setActive(id: string) {
	activeTab.value = id
	emit('update:active', activeTab.value)
}

/**
 * Focus the previous tab
 * and emit to the parent component
 */
function focusPreviousTab() {
	if (currentTabIndex.value > 0) {
		setActive(tabs.value[currentTabIndex.value - 1]!.id)
	}
	focusActiveTab()
}

/**
 * Focus the next tab
 * and emit to the parent component
 */
function focusNextTab() {
	if (currentTabIndex.value < tabs.value.length - 1) {
		setActive(tabs.value[currentTabIndex.value + 1]!.id)
	}
	focusActiveTab()
}

/**
 * Focus the first tab
 * and emit to the parent component
 */
function focusFirstTab() {
	setActive(tabs.value[0]!.id)
	focusActiveTab()
}

/**
 * Focus the last tab
 * and emit to the parent component
 */
function focusLastTab() {
	setActive(tabs.value.at(-1)!.id)
	focusActiveTab()
}

/**
 * Focus the current active tab
 */
function focusActiveTab() {
	rootElement.value?.querySelector<HTMLElement>(`#${CSS.escape(`tab-button-${activeTab.value}`)}`)?.focus()
}

/**
 * Focus the content on tab
 * see aria accessibility guidelines
 */
function focusActiveTabContent() {
	rootElement.value?.querySelector<HTMLElement>(`#${CSS.escape(`tab-${activeTab.value}`)}`)?.focus()
}

/**
 * Update the current active tab
 */
function updateActive() {
	activeTab.value = (active && tabs.value.some(({ id }) => id === active))
		? active
		: (tabs.value[0]?.id ?? '')
}

/**
 * Register child tab in the tabs
 *
 * @param tab - The child tab passed to the slot
 */
function registerTab(tab: SidebarTab) {
	tabs.value.push(tab)
	tabs.value.sort((a, b) => {
		if (a.order === b.order) {
			return a.name.localeCompare(b.name, [getCanonicalLocale()])
		}
		return a.order - b.order
	})
	updateActive()
}

/**
 * Unregister child tab from the tabs
 *
 * @param id - The tab's id
 */
function unregisterTab(id: string) {
	const tabIndex = tabs.value.findIndex((tab) => tab.id === id)
	if (tabIndex !== -1) {
		tabs.value.splice(tabIndex, 1)
	}
	if (activeTab.value === id) {
		updateActive()
	}
}

/**
 * Move the sliding highlight onto a tab button. It slides there if
 * already visible, otherwise it snaps into place so it does not slide in
 * from a previously hovered tab. Over the active tab it turns transparent
 * so the active tab keeps its own static background.
 *
 * @param button - The tab button element to cover
 */
function showHighlightOn(button: Element) {
	const buttonRect = button.getBoundingClientRect()
	const navRect = navElement.value!.getBoundingClientRect()
	const wasVisible = highlightVisible.value

	// Re-appearing: snap into place first so it does not slide in from the
	// tab that was hovered before
	highlightAnimated.value = wasVisible
	highlightOverActive.value = button.getAttribute('aria-selected') === 'true'
	highlightRect.value = {
		left: buttonRect.left - navRect.left,
		top: buttonRect.top - navRect.top,
		width: buttonRect.width,
		height: buttonRect.height,
	}

	if (!wasVisible) {
		highlightVisible.value = true
		// Enable sliding again once it is in place and faded in
		nextTick(() => requestAnimationFrame(() => {
			highlightAnimated.value = true
		}))
	}
}

/**
 * Hide the sliding highlight
 */
function hideHighlight() {
	highlightVisible.value = false
	highlightedButton = null
}

/**
 * Move the highlight to the tab button under the pointer or focus
 *
 * @param event - The pointer or focus event
 */
function handleHighlight(event: PointerEvent | FocusEvent) {
	if (!highlightEnabled.value) {
		return
	}
	const button = (event.target as Element | null)?.closest?.('.app-sidebar-tabs__tab')
	// pointerover fires again for every element inside a tab (icon, label),
	// so skip the measuring when the highlight already covers this tab
	if (!button || button === highlightedButton || !navElement.value?.contains(button)) {
		return
	}
	highlightedButton = button
	showHighlightOn(button)
}

/**
 * Hide the highlight once focus leaves the tablist entirely
 *
 * @param event - The focusout event
 */
function onHighlightFocusOut(event: FocusEvent) {
	if (highlightEnabled.value && !navElement.value?.contains(event.relatedTarget as Node | null)) {
		hideHighlight()
	}
}
</script>

<!-- Follows the tab aria guidelines
	https://www.w3.org/TR/wai-aria-practices/examples/tabs/tabs-1/tabs.html -->
<template>
	<div ref="root" class="app-sidebar-tabs">
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
			<slot />
		</div>
	</div>
</template>

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
