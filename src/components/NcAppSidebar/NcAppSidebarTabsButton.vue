<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type NcAppSidebarTab from '../NcAppSidebarTab/NcAppSidebarTab.vue'

import { ref } from 'vue'
import NcVNodes from '../NcVNodes/NcVNodes.vue'
import { isLegacy34 } from '../../utils/legacy.ts'

const selected = defineModel<boolean>('selected', { required: true })

defineProps<{
	/**
	 * The sidebar tab this button controls
	 */
	tab: InstanceType<typeof NcAppSidebarTab>

	/**
	 * Whether the parent tablist renders a sliding highlight. When set, the
	 * button drops its own hover background so only the moving highlight shows.
	 */
	animatedHighlight?: boolean
}>()

/** Whether the icon is playing its click "pop" animation */
const popping = ref(false)

/**
 * Activate the tab and replay the icon pop (a brief enlarge) as click feedback.
 * Restarting on every click (not only on becoming selected) keeps the feedback
 * even when re-clicking the active tab. Under reduced motion --animation-slow
 * collapses to 0, so the pop is instant.
 */
function onClick() {
	selected.value = true
	popping.value = false
	requestAnimationFrame(() => {
		popping.value = true
	})
}
</script>

<template>
	<button
		class="button-vue"
		:class="[$style.sidebarTabsButton, {
			[$style.sidebarTabsButton_selected]: selected,
			[$style.sidebarTabsButton_legacy]: isLegacy34,
			[$style.sidebarTabsButton_animatedHighlight]: animatedHighlight,
		}]"
		role="tab"
		:aria-selected="selected"
		:tabindex="selected ? 0 : -1"
		@click="onClick">
		<span
			:class="[$style.sidebarTabsButton__icon, { [$style.sidebarTabsButton__icon_pop]: popping }]"
			@animationend="popping = false">
			<!-- Both icon variants are stacked and crossfaded on selection, so the
				outline fades into the filled variant (and back) instead of snapping.
				Consumers that render a single icon simply crossfade it with itself. -->
			<span :class="[$style.sidebarTabsButton__iconLayer, { [$style.sidebarTabsButton__iconLayer_hidden]: selected }]">
				<NcVNodes :vnodes="tab.renderIcon(false)">
					<span :class="[$style.sidebarTabsButton__legacyIcon, tab.icon]" />
				</NcVNodes>
			</span>
			<span :class="[$style.sidebarTabsButton__iconLayer, { [$style.sidebarTabsButton__iconLayer_hidden]: !selected }]">
				<NcVNodes :vnodes="tab.renderIcon(true)">
					<span :class="[$style.sidebarTabsButton__legacyIcon, tab.icon]" />
				</NcVNodes>
			</span>
		</span>
		<span :class="$style.sidebarTabsButton__name">
			{{ tab.name }}
		</span>
	</button>
</template>

<style module lang="scss">
.sidebarTabsButton {
	border: none;
	color: var(--color-main-text);
	font-size: var(--default-font-size);
	cursor: pointer;
	display: flex;
	flex-direction: column;
	gap: var(--default-grid-baseline);
	min-width: var(--default-clickable-area);

	* {
		cursor: pointer;
	}
}

// New design (NC34+): rounded pill with a small primary indicator under the
// active tab.
.sidebarTabsButton:not(.sidebarTabsButton_legacy) {
	position: relative;
	border-radius: var(--border-radius-element);
	background-color: var(--color-main-background);
	padding: var(--default-grid-baseline);
	padding-block-end: calc(var(--default-grid-baseline) * 2);
	transition: background-color var(--animation-quick);

	&::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		width: 0;
		height: 4px;
		border-radius: 999px;
		background-color: var(--color-primary-element);
		opacity: 0;
		transform: translateX(-50%);
		transition: width var(--animation-quick), opacity var(--animation-quick);
	}

	&:hover {
		background-color: var(--color-background-hover);
	}

	&:focus-visible {
		outline: 2px solid var(--color-main-text);
		outline-offset: 2px;
	}
}

// Legacy design (NC < 34): full-width primary border under the active tab.
.sidebarTabsButton_legacy {
	border-bottom: var(--default-grid-baseline) solid transparent !important;
	border-radius: var(--border-radius-small);
	background-color: var(--color-main-background);
	padding: var(--border-radius-small);
	transition:
		background-color var(--animation-quick),
		border-bottom-color var(--animation-quick);

	&:hover {
		background-color: var(--color-background-hover) !important;
	}

	&:active,
	&:focus {
		background-color: var(--color-main-background) !important;
	}
}

.sidebarTabsButton_selected {
	cursor: default;

	* {
		cursor: default;
	}
}

.sidebarTabsButton:not(.sidebarTabsButton_legacy).sidebarTabsButton_selected {
	// Same tint as the hover highlight of the tablist, so the highlight sliding
	// on and off the active tab stays seamless.
	background-color: color-mix(in srgb, var(--color-primary-element) 8%, transparent);

	&::after {
		width: 80%;
		opacity: 1;
	}

	// Kept identical on hover: the highlight turns transparent over the active
	// tab, so any other colour here would show up as a jump.
	&:hover {
		background-color: color-mix(in srgb, var(--color-primary-element) 8%, transparent);
	}
}

// When the tablist renders a sliding highlight, the hover background is drawn
// by that moving element, which sits behind the buttons. Non-selected buttons
// must stay fully transparent so it shows through; the active tab keeps its own
// static background from the rule above, which is more specific.
.sidebarTabsButton_animatedHighlight:not(.sidebarTabsButton_legacy) {
	background-color: transparent;

	&:hover {
		background-color: transparent;
	}
}

.sidebarTabsButton_legacy.sidebarTabsButton_selected {
	border-bottom-color: var(--color-primary-element) !important;
	border-bottom-left-radius: 0;
	border-bottom-right-radius: 0;

	&:hover {
		background-color: var(--color-primary-element-light-hover) !important;
		color: var(--color-primary-element-light-text) !important;
	}
}

.sidebarTabsButton__name {
	font-weight: var(--font-weight-element, normal);
	overflow: hidden;
	text-overflow: ellipsis;
	text-wrap: nowrap;
}

.sidebarTabsButton_legacy.sidebarTabsButton_selected .sidebarTabsButton__name {
	font-weight: var(--font-weight-element, bold);
}

// The two icon layers are stacked in the same grid cell so they overlap and
// the container still sizes to the icon.
.sidebarTabsButton__icon {
	display: inline-grid;
	place-items: center;
}

.sidebarTabsButton__iconLayer {
	grid-area: 1 / 1;
	display: inline-flex;
	// Crossfade between the outline and filled variant. --animation-slow collapses
	// to 0 under reduced motion, so the swap becomes instant.
	transition: opacity var(--animation-slow) ease-in-out;
}

.sidebarTabsButton__iconLayer_hidden {
	opacity: 0;
}

// Brief enlarge as click feedback. Duration uses --animation-slow, which the
// reduced-motion theme collapses to 0, so the pop is skipped there.
.sidebarTabsButton__icon_pop {
	animation: sidebar-tab-icon-pop var(--animation-slow) ease-in-out;
}

@keyframes sidebar-tab-icon-pop {
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

.sidebarTabsButton__legacyIcon {
	background-size: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
