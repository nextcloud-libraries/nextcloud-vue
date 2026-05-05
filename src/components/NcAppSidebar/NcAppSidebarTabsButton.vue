<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type NcAppSidebarTab from '../NcAppSidebarTab/NcAppSidebarTab.vue'

import NcVNodes from '../NcVNodes/NcVNodes.vue'
import { isLegacy34 } from '../../utils/legacy.ts'

const selected = defineModel<boolean>('selected', { required: true })

defineProps<{
	/**
	 * The sidebar tab this button controls
	 */
	tab: InstanceType<typeof NcAppSidebarTab>
}>()
</script>

<template>
	<button
		class="button-vue"
		:class="[$style.sidebarTabsButton, {
			[$style.sidebarTabsButton_selected]: selected,
			[$style.sidebarTabsButton_legacy]: isLegacy34,
		}]"
		role="tab"
		:aria-selected="selected"
		:tabindex="selected ? 0 : -1"
		@click="selected = true">
		<span :class="$style.sidebarTabsButton__icon">
			<NcVNodes :vnodes="tab.renderIcon()">
				<span :class="[$style.sidebarTabsButton__legacyIcon, tab.icon]" />
			</NcVNodes>
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
		height: 6px;
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
	background-color: var(--color-background-hover);

	&::after {
		width: 80%;
		opacity: 1;
	}

	&:hover {
		background-color: var(--color-background-dark);
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

.sidebarTabsButton__icon {
	display: inline-flex;
	align-items: center;
	justify-content: center;
}

.sidebarTabsButton__legacyIcon {
	background-size: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
