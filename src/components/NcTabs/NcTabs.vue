<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### General description

This component shows a row of tabs and the panel of the selected tab, to switch between views of the same content in the app content. For the tabs of the sidebar, use `NcAppSidebarTab` instead.

The content of a tab goes in its `panel-<id>` slot. Only the panel of the selected tab is rendered, so keep state that must survive switching tabs outside the panel. The tabs follow the [ARIA tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) with manual activation.

### Usage

```vue
<template>
	<div>
		<NcTabs v-model="active" :tabs="tabs" aria-label="Document">
			<template #panel-details>
				<p>The details of the document.</p>
			</template>
			<template #panel-history>
				<p>Who changed the document and when.</p>
			</template>
			<template #panel-comments>
				<p>What others said about the document.</p>
			</template>
		</NcTabs>
		<p>Selected tab: {{ active }}</p>
	</div>
</template>

<script>
export default {
	data() {
		return {
			active: 'details',
			tabs: [
				{ id: 'details', label: 'Details' },
				{ id: 'history', label: 'History' },
				{ id: 'comments', label: 'Comments', count: 3 },
			],
		}
	},
}
</script>
```

### With icons and a disabled tab

Like the tabs of the sidebar, a tab can have a filled icon in `iconPathSelected` for when it is selected. The outlined icon fades into the filled one.

```vue
<template>
	<NcTabs v-model="active" :tabs="tabs" aria-label="Settings">
		<template #panel-general>
			<p>General settings.</p>
		</template>
		<template #panel-sharing>
			<p>Sharing settings.</p>
		</template>
		<template #panel-security>
			<p>Security settings.</p>
		</template>
	</NcTabs>
</template>

<script>
import { mdiCog, mdiCogOutline, mdiShareVariant, mdiShareVariantOutline, mdiShieldLock, mdiShieldLockOutline } from '@mdi/js'

export default {
	data() {
		return {
			active: 'general',
			tabs: [
				{ id: 'general', label: 'General', iconPath: mdiCogOutline, iconPathSelected: mdiCog },
				{ id: 'sharing', label: 'Sharing', iconPath: mdiShareVariantOutline, iconPathSelected: mdiShareVariant, count: 12 },
				{ id: 'security', label: 'Security', iconPath: mdiShieldLockOutline, iconPathSelected: mdiShieldLock, disabled: true },
			],
		}
	},
}
</script>
```
</docs>

<script setup lang="ts">
import type { Slot } from 'vue'

import { computed, onMounted, reactive, ref, useCssModule } from 'vue'
import { createElementId } from '../../utils/createElementId.ts'
import { isLegacy34 } from '../../utils/legacy.ts'
import { isRtl } from '../../utils/rtl.ts'
import NcCounterBubble from '../NcCounterBubble/index.ts'
import NcIconSvgWrapper from '../NcIconSvgWrapper/index.ts'

export interface NcTabsTab {
	/** The unique id of the tab, also the name of its panel slot `panel-<id>` */
	id: string
	/** The label shown on the tab */
	label: string
	/** The SVG path of an icon shown before the label, for example one from `@mdi/js` */
	iconPath?: string
	/** The SVG path of the icon while the tab is selected, for example the filled variant of `iconPath` */
	iconPathSelected?: string
	/** A number shown in a counter bubble after the label */
	count?: number
	/** Whether the tab cannot be selected. It can still be reached with the keyboard, so it is announced. */
	disabled?: boolean
}

/**
 * The `id` of the selected tab.
 * When it does not match an enabled tab, the first enabled tab is shown, without changing the model.
 */
const modelValue = defineModel<string>()

const props = withDefaults(defineProps<{
	/**
	 * The tabs, in order.
	 */
	tabs: NcTabsTab[]

	/**
	 * The name of the tabs for assistive technology, for example the name of the item they belong to.
	 */
	ariaLabel?: string

	/**
	 * The id of an element that names the tabs, for example a visible heading.
	 * Takes precedence over `ariaLabel`.
	 */
	ariaLabelledby?: string
}>(), {
	ariaLabel: undefined,
	ariaLabelledby: undefined,
})

defineSlots<{
	/**
	 * The panel of the tab with id `<id>`, for example `#panel-details`.
	 */
	[key: `panel-${string}`]: Slot
}>()

const style = useCssModule()
const idPrefix = createElementId()
const tabElements = ref<HTMLButtonElement[]>([])
const tablist = ref<HTMLElement>()

/** The id of the tab whose icon plays its click "pop" animation */
const popping = ref<string>()

// The hover highlight that slides between the tabs, like the tabs of the sidebar. Only once
// mounted, and only in the current design: the tabs before Nextcloud 34 keep their own look.
const highlightEnabled = ref(false)
const highlight = reactive({ visible: false, animated: false, overActive: false, left: 0, top: 0, width: 0, height: 0 })
// The tab the highlight covers, so moving within a tab (over its icon or label) does not measure again
let highlightedTab: Element | undefined

onMounted(() => {
	highlightEnabled.value = !isLegacy34
})

const enabledTabs = computed(() => props.tabs.filter((tab) => !tab.disabled))

// The model is not replaced by the fallback, so a tab that is disabled while it loads, for
// example one opened from a link, is shown once it is enabled
const activeTab = computed(() => enabledTabs.value.find((tab) => tab.id === modelValue.value) ?? enabledTabs.value[0])

/**
 * The id of the tab element of a tab.
 *
 * @param tab - The tab
 */
function tabElementId(tab: NcTabsTab): string {
	// By position, as an id with whitespace would break aria-controls and aria-labelledby
	return `${idPrefix}-tab-${props.tabs.indexOf(tab)}`
}

/**
 * The id of the panel element of a tab.
 *
 * @param tab - The tab
 */
function panelElementId(tab: NcTabsTab): string {
	return `${idPrefix}-panel-${props.tabs.indexOf(tab)}`
}

/**
 * Select a tab, and replay the pop of its icon (a brief enlarge) as click feedback, also when
 * it was already selected.
 *
 * @param tab - The tab to select
 */
function select(tab: NcTabsTab) {
	if (tab.disabled) {
		return
	}
	modelValue.value = tab.id
	popping.value = undefined
	requestAnimationFrame(() => {
		popping.value = tab.id
	})
}

/**
 * Move the highlight onto a tab. It slides there when it is already shown, otherwise it snaps
 * into place, so it does not slide in from the tab that was hovered before. Over the selected
 * tab it turns transparent, so that tab keeps its own background.
 *
 * @param element - The tab element to cover
 */
function showHighlightOn(element: HTMLElement) {
	const list = tablist.value!
	const tabRect = element.getBoundingClientRect()
	const listRect = list.getBoundingClientRect()
	const wasVisible = highlight.visible

	highlight.animated = wasVisible
	highlight.overActive = element.getAttribute('aria-selected') === 'true'
	// Within the row, which scrolls when the tabs do not fit
	highlight.left = tabRect.left - listRect.left + list.scrollLeft
	highlight.top = tabRect.top - listRect.top + list.scrollTop
	highlight.width = tabRect.width
	highlight.height = tabRect.height

	if (!wasVisible) {
		highlight.visible = true
		// Slide again once it is in place
		requestAnimationFrame(() => {
			highlight.animated = true
		})
	}
}

/**
 * Hide the highlight.
 */
function hideHighlight() {
	highlight.visible = false
	highlightedTab = undefined
}

/**
 * Move the highlight to the tab under the pointer or the focus. A disabled tab gets none, like
 * its hover background before.
 *
 * @param event - The pointerover or focusin event
 */
function onHighlight(event: Event) {
	if (!highlightEnabled.value) {
		return
	}
	const element = (event.target as Element | null)?.closest?.<HTMLElement>('[role="tab"]')
	if (!element || element === highlightedTab || !tablist.value!.contains(element)) {
		return
	}
	if (element.getAttribute('aria-disabled') === 'true') {
		hideHighlight()
		return
	}
	highlightedTab = element
	showHighlightOn(element)
}

/**
 * Hide the highlight once the focus leaves the tabs.
 *
 * @param event - The focusout event
 */
function onHighlightFocusOut(event: FocusEvent) {
	if (highlightEnabled.value && !tablist.value!.contains(event.relatedTarget as Node | null)) {
		hideHighlight()
	}
}

/**
 * The tab element of a tab.
 *
 * @param tab - The tab
 */
function tabElement(tab: NcTabsTab): HTMLButtonElement | undefined {
	return tabElements.value.find((element) => element.id === tabElementId(tab))
}

/**
 * Move the focus between the tabs with the keyboard, including the disabled ones.
 * Selecting the focused tab is left to `Enter` and `Space`, which click the button.
 *
 * @param event - The keydown event
 */
function onKeydown(event: KeyboardEvent) {
	const tabs = props.tabs
	if (tabs.length === 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
		return
	}

	const focused = tabs.findIndex((tab) => tabElement(tab) === document.activeElement)
	const shown = activeTab.value ? tabs.indexOf(activeTab.value) : -1
	const current = focused !== -1 ? focused : shown

	const forward = isRtl ? 'ArrowLeft' : 'ArrowRight'
	const backward = isRtl ? 'ArrowRight' : 'ArrowLeft'
	let next: NcTabsTab | undefined
	if (event.key === forward) {
		next = tabs[(current + 1) % tabs.length]
	} else if (event.key === backward) {
		next = tabs[(current - 1 + tabs.length) % tabs.length]
	} else if (event.key === 'Home') {
		next = tabs[0]
	} else if (event.key === 'End') {
		next = tabs[tabs.length - 1]
	}

	if (next) {
		event.preventDefault()
		tabElement(next)?.focus()
	}
}

/**
 * The classes of a tab element.
 *
 * @param tab - The tab
 */
function tabClass(tab: NcTabsTab) {
	return [style.ncTabs__tab, {
		[style.ncTabs__tab_selected]: tab === activeTab.value,
		[style.ncTabs__tab_legacy]: isLegacy34,
		[style.ncTabs__tab_animatedHighlight]: highlightEnabled.value,
	}]
}
</script>

<template>
	<div :class="$style.ncTabs">
		<div
			ref="tablist"
			role="tablist"
			:aria-label="ariaLabel"
			:aria-labelledby="ariaLabelledby"
			:class="[$style.ncTabs__list, { [$style.ncTabs__list_legacy]: isLegacy34 }]"
			@keydown="onKeydown"
			@pointerover="onHighlight"
			@pointerleave="hideHighlight"
			@focusin="onHighlight"
			@focusout="onHighlightFocusOut">
			<div
				v-if="highlightEnabled"
				:class="[$style.ncTabs__highlight, {
					[$style.ncTabs__highlight_visible]: highlight.visible,
					[$style.ncTabs__highlight_animated]: highlight.animated,
					[$style.ncTabs__highlight_overActive]: highlight.overActive,
				}]"
				:style="{
					transform: `translate(${highlight.left}px, ${highlight.top}px)`,
					width: `${highlight.width}px`,
					height: `${highlight.height}px`,
				}"
				aria-hidden="true" />
			<button
				v-for="tab in tabs"
				:id="tabElementId(tab)"
				:key="tab.id"
				ref="tabElements"
				class="button-vue"
				:class="tabClass(tab)"
				type="button"
				role="tab"
				:aria-selected="tab === activeTab ? 'true' : 'false'"
				:aria-controls="tab === activeTab ? panelElementId(tab) : undefined"
				:tabindex="tab === activeTab ? 0 : -1"
				:aria-disabled="tab.disabled ? 'true' : undefined"
				@click="select(tab)">
				<span
					v-if="tab.iconPath"
					:class="[$style.ncTabs__icon, { [$style.ncTabs__icon_pop]: popping === tab.id }]"
					@animationend="popping = undefined">
					<!-- Both icons are stacked and crossfaded on selection, a tab without iconPathSelected
						crossfades its icon with itself -->
					<span :class="[$style.ncTabs__iconLayer, { [$style.ncTabs__iconLayer_hidden]: tab === activeTab }]">
						<NcIconSvgWrapper :path="tab.iconPath" :size="20" />
					</span>
					<span :class="[$style.ncTabs__iconLayer, { [$style.ncTabs__iconLayer_hidden]: tab !== activeTab }]">
						<NcIconSvgWrapper :path="tab.iconPathSelected ?? tab.iconPath" :size="20" />
					</span>
				</span>
				<span :class="$style.ncTabs__label">
					<span :class="$style.ncTabs__name">{{ tab.label }}</span>
					<NcCounterBubble
						v-if="tab.count !== undefined"
						:count="tab.count" />
				</span>
			</button>
		</div>
		<div
			v-if="activeTab"
			:id="panelElementId(activeTab)"
			:key="activeTab.id"
			role="tabpanel"
			:aria-labelledby="tabElementId(activeTab)"
			tabindex="0"
			:class="$style.ncTabs__panel">
			<slot :name="`panel-${activeTab.id}`" />
		</div>
	</div>
</template>

<style lang="scss" module>
.ncTabs {
	display: flex;
	flex-direction: column;
	min-width: 0;
}

// The same look as the tabs of the sidebar (NcAppSidebarTabsButton)
.ncTabs__list {
	position: relative;
	display: flex;
	gap: var(--default-grid-baseline);
	// The row scrolls, so it clips what is outside it: leave room for the focus outline
	padding-block-start: 4px;
	padding-inline: 4px;
	padding-block-end: var(--default-grid-baseline);
	overflow-x: auto;
	border-block-end: 1px solid var(--color-border);
	scrollbar-width: thin;
	// Keep the highlight layered below the tabs
	isolation: isolate;
}

.ncTabs__list_legacy {
	gap: 0;
	padding-block-end: 0;
}

.ncTabs__highlight {
	position: absolute;
	top: 0;
	// Physical left to match the offset measured with getBoundingClientRect, so it stays right in RTL
	// stylelint-disable-next-line csstools/use-logical
	left: 0;
	z-index: 0;
	width: 0;
	height: 0;
	border-radius: var(--border-radius-element);
	// The same tint as the selected tab
	background-color: color-mix(in srgb, var(--color-primary-element) 8%, transparent);
	opacity: 0;
	pointer-events: none;
	will-change: transform, width, height;
	// Sliding only with _animated, so the highlight snaps into place when it appears
	transition:
		opacity var(--animation-quick) ease-in-out,
		background-color var(--animation-quick) ease-in-out;
}

.ncTabs__highlight_animated {
	transition:
		transform var(--animation-quick) ease-in-out,
		width var(--animation-quick) ease-in-out,
		height var(--animation-quick) ease-in-out,
		opacity var(--animation-quick) ease-in-out,
		background-color var(--animation-quick) ease-in-out;
}

.ncTabs__highlight_visible {
	opacity: 1;
}

// Over the selected tab its own background shows, while the highlight still slides on and off it
.ncTabs__highlight_overActive {
	background-color: transparent;
}

.ncTabs__tab {
	position: relative;
	// Above the highlight
	z-index: 1;
	display: flex;
	flex: 1 1 1px;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: var(--default-grid-baseline);
	min-width: max-content;
	min-height: var(--default-clickable-area);
	margin: 0;
	padding: var(--default-grid-baseline);
	padding-block-end: calc(2 * var(--default-grid-baseline));
	border: none;
	border-radius: var(--border-radius-element);
	color: var(--color-main-text);
	background-color: var(--color-main-background);
	font-size: var(--default-font-size);
	cursor: pointer;
	transition: background-color var(--animation-quick);

	&::after {
		content: '';
		position: absolute;
		inset-block-end: 0;
		inset-inline: 50%;
		height: 4px;
		border-radius: 999px;
		background-color: var(--color-primary-element);
		opacity: 0;
		transition: inset-inline var(--animation-quick), opacity var(--animation-quick);
	}

	&:hover:not([aria-disabled='true']) {
		background-color: var(--color-background-hover);
	}

	&:focus-visible {
		outline: 2px solid var(--color-main-text);
		outline-offset: 2px;
	}

	// Only the content is faded, so the focus outline of a disabled tab stays visible
	&[aria-disabled='true'] {
		cursor: default;

		> * {
			opacity: .5;
		}
	}
}

.ncTabs__tab_selected {
	cursor: default;

	&,
	&:hover:not([aria-disabled='true']) {
		background-color: color-mix(in srgb, var(--color-primary-element) 8%, transparent);
	}

	&::after {
		inset-inline: 10%;
		opacity: 1;
	}
}

// With the sliding highlight the other tabs stay transparent, so the highlight behind them shows
.ncTabs__tab_animatedHighlight:not(.ncTabs__tab_selected) {
	&,
	&:hover:not([aria-disabled='true']) {
		background-color: transparent;
	}
}

// Forced colors replace the backgrounds that mark the selected tab, so draw its bar in the
// system highlight color
@media (forced-colors: active) {
	.ncTabs__tab_selected::after {
		background-color: Highlight;
		forced-color-adjust: none;
	}
}

// Nextcloud before 34: a line below the selected tab, as the sidebar tabs there.
.ncTabs__tab_legacy {
	padding: var(--border-radius-small);
	border-block-end: var(--default-grid-baseline) solid transparent;
	border-radius: var(--border-radius-small);
	transition: background-color var(--animation-quick), border-block-end-color var(--animation-quick);

	&::after {
		display: none;
	}

	&.ncTabs__tab_selected {
		border-block-end-color: var(--color-primary-element);
		border-end-start-radius: 0;
		border-end-end-radius: 0;

		&,
		&:hover:not([aria-disabled='true']) {
			background-color: var(--color-main-background);
		}

		&:hover:not([aria-disabled='true']) {
			color: var(--color-primary-element-light-text);
			background-color: var(--color-primary-element-light-hover);
		}
	}
}

// The two icons in the same grid cell, so they overlap and the icon keeps its size
.ncTabs__icon {
	display: inline-grid;
	place-items: center;
}

.ncTabs__iconLayer {
	display: inline-flex;
	grid-area: 1 / 1;
	// --animation-slow is 0 with reduced motion, so the icons swap at once
	transition: opacity var(--animation-slow) ease-in-out;
}

.ncTabs__iconLayer_hidden {
	opacity: 0;
}

// A brief enlarge as click feedback, skipped with reduced motion like the crossfade
.ncTabs__icon_pop {
	animation: nc-tabs-icon-pop var(--animation-slow) ease-in-out;
}

@keyframes nc-tabs-icon-pop {
	0% {
		transform: scale(1);
	}

	40% {
		transform: scale(1.2);
	}

	100% {
		transform: scale(1);
	}
}

.ncTabs__label {
	display: flex;
	align-items: center;
	gap: var(--default-grid-baseline);
}

// A tab is never narrower than its name, the row scrolls instead
.ncTabs__name {
	font-weight: var(--font-weight-element, normal);
}

.ncTabs__tab_legacy.ncTabs__tab_selected .ncTabs__name {
	font-weight: var(--font-weight-element, bold);
}

.ncTabs__panel {
	padding-block: calc(3 * var(--default-grid-baseline));

	&:focus-visible {
		outline: 2px solid var(--color-main-text);
		outline-offset: 2px;
	}
}
</style>
